/*
 * Multi‑provider AI service for the conversion tool.
 *
 * This module exposes a diagnoseConversion function that accepts a
 * button number and question context and returns either a list of
 * five questions (for the prelim pain points screen) or a final
 * report (for the last question) along with a response string.
 * It first attempts to use OpenAI and falls back to a Gemini
 * provider via the existing genkit setup.  If both providers
 * fail it returns a graceful fallback response.
 */

'use server';

import { z } from 'genkit';

// Input and output schemas for our AI flow
const DiagnoseConversionInputSchema = z.object({
  buttonNumber: z.number().describe('The number of the button that was pressed.'),
  question: z.string().describe('The context of the screen where the button was pressed.'),
});

const DiagnoseConversionOutputSchema = z.object({
  response: z.string().describe('The generated response from the AI.'),
  questions: z.array(z.string()).optional().describe('A list of 5 questions, generated only for the PRELIM_B screen.'),
});

export type ConversionDiagnosisInput = z.infer<typeof DiagnoseConversionInputSchema>;
export type ConversionDiagnosisOutput = z.infer<typeof DiagnoseConversionOutputSchema>;

// AI provider types and configuration
type AIProvider = 'openai' | 'gemini';

interface AIServiceConfig {
  primaryProvider: AIProvider;
  fallbackProvider: AIProvider;
  maxRetries: number;
  retryDelay: number;
}

const AI_CONFIG: AIServiceConfig = {
  primaryProvider: 'openai',
  fallbackProvider: 'gemini',
  maxRetries: 1,
  retryDelay: 500,
};

// OpenAI service wrapper.  This class constructs prompts based on
// our current context and calls the OpenAI chat API.
class OpenAIService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

public async generateResponse(input: DiagnoseConversionInput): Promise<DiagnoseConversionOutput> {
    const prompt = this.buildPrompt(input);
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional business assessment AI that helps visitors understand their needs and provides actionable insights. Always respond with valid JSON matching the required schema.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }
    try {
      return JSON.parse(content) as DiagnoseConversionOutput;
    } catch (parseError) {
      throw new Error('Invalid JSON response from OpenAI');
    }
  }

  private buildPrompt(input: DiagnoseConversionInput): string {
    if (input.question === 'Screen: PRELIM_B') {
      return `You're helping a business visitor who selected option ${input.buttonNumber} for pain points. Generate a professional response with 5 targeted questions that will help assess their specific needs.\n\nReturn JSON with:\n- "response": A brief encouraging message about moving forward with their assessment\n- "questions": An array of 5 specific, actionable questions related to their pain points\n\nFocus on conversion optimization, lead qualification, and providing value.`;
    }
    if (input.question === 'Screen: Q5') {
      return `Create a professional business assessment report based on the visitor's journey. They selected option ${input.buttonNumber} for the final question.\n\nReturn JSON with:\n- "response": A comprehensive, actionable report that provides real value and encourages next steps\n\nThe report should:\n- Summarize key insights from their selections\n- Provide specific recommendations\n- Include a clear call-to-action for next steps\n- Be professional but engaging\n- Be 200-300 words`;
    }
    return `The visitor selected option ${input.buttonNumber} for: "${input.question}". Provide a brief, encouraging response that acknowledges their selection and builds momentum toward the assessment completion.\n\nReturn JSON with:\n- "response": A short, positive acknowledgment (1-2 sentences)`;
  }
}

// Gemini service wrapper - temporarily disabled to avoid ES module issues
class GeminiService {
  async generateResponse(input: DiagnoseConversionInput): Promise<DiagnoseConversionOutput> {
    throw new Error('Gemini service temporarily disabled');
  }
}

// Main service with fallback.  It attempts the primary provider and
// falls back if an error is thrown.  If both providers fail, it
// returns a minimal fallback response appropriate for the context.
class AIService {
  private openAI: OpenAIService;
  private gemini: GeminiService;
  private config: AIServiceConfig;

  constructor() {
    this.openAI = new OpenAIService();
    this.gemini = new GeminiService();
    this.config = AI_CONFIG;
  }

  async generateResponse(input: DiagnoseConversionInput): Promise<DiagnoseConversionOutput> {
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        if (this.config.primaryProvider === 'openai') {
          return await this.openAI.generateResponse(input);
        } else {
          return await this.gemini.generateResponse(input);
        }
      } catch (primaryError) {
        if (attempt < this.config.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
          continue;
        }
        
        try {
          if (this.config.fallbackProvider === 'gemini') {
            return await this.gemini.generateResponse(input);
          } else {
            return await this.openAI.generateResponse(input);
          }
        } catch (fallbackError) {
          return this.generateFallbackResponse(input);
        }
      }
    }
    return this.generateFallbackResponse(input);
  }

  private generateFallbackResponse(input: DiagnoseConversionInput): DiagnoseConversionOutput {
    if (input.question === 'Screen: PRELIM_B') {
      return {
        response: "Thank you for your selection! Let's dive deeper into your specific needs with a few targeted questions.",
        questions: [
          "What's your biggest challenge in this area right now?",
          'How is this currently impacting your business operations?',
          'What solutions have you tried before?',
          'What would success look like for you?',
          "What's your timeline for addressing this challenge?",
        ],
      };
    }
    if (input.question === 'Screen: Q5') {
      return {
        response: `Based on your responses, we've identified key areas where our expertise can help drive meaningful results for your business. Your selections indicate a strategic approach to growth and optimization.\n\nWe recommend scheduling a consultation to discuss:\n• Customized solutions for your specific challenges\n• Implementation strategies that fit your timeline\n• Expected outcomes and success metrics\n\nNext steps: Contact our team to schedule your complimentary strategy session and turn these insights into action.`,
      };
    }
    return {
      response: `Thank you for selection ${input.buttonNumber}. Moving forward with your assessment...`,
    };
  }
}

// Singleton instance
const aiService = new AIService();

// Exported function used by the rest of the app
export async function diagnoseConversion(input: DiagnoseConversionInput): Promise<DiagnoseConversionOutput> {
  if (!Number.isInteger(input.buttonNumber) || input.buttonNumber < 1 || input.buttonNumber > 5) {
    throw new Error('Invalid button number. Must be an integer between 1 and 5.');
  }
  if (!input.question || typeof input.question !== 'string') {
    throw new Error('Invalid question parameter.');
  }
  try {
    const result = await aiService.generateResponse(input);
    if (!result.response || typeof result.response !== 'string') {
      throw new Error('Invalid AI response: missing or invalid response field');
    }
    if (result.questions) {
      if (!Array.isArray(result.questions) || result.questions.length !== 5) {
        throw new Error('Invalid AI response: questions must be an array of 5 strings');
      }
      if (!result.questions.every((q: string) => typeof q === 'string' && q.length > 0)) {
        throw new Error('Invalid AI response: all questions must be non-empty strings');
      }
    }
    return result;
  } catch (error) {
    console.error('Error in diagnoseConversion:', error);
    throw error;
  }
}