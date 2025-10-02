'use server';

import { z } from 'genkit';
import type { UserJourney } from '../../lib/journey-tracker';
import type { ScreenConfig } from '../../lib/screen-config';

// Enhanced input schema with full context
const EnhancedDiagnoseInputSchema = z.object({
  currentSelection: z.object({
    buttonNumber: z.number(),
    buttonText: z.string(),
    screen: z.string(),
  }),
  userJourney: z.object({
    sessionId: z.string(),
    responses: z.array(z.object({
      screen: z.string(),
      buttonNumber: z.number(),
      buttonText: z.string(),
      timestamp: z.number(),
    })),
    metadata: z.object({
      startTime: z.number(),
      currentScreen: z.string(),
      totalScreens: z.number(),
    }),
  }),
  screenConfig: z.object({
    title: z.string(),
    options: z.array(z.string()),
    context: z.string(),
  }),
});

const DiagnoseConversionOutputSchema = z.object({
  response: z.string().describe('The generated response from the AI.'),
  questions: z.array(z.string()).optional().describe('A list of 5 questions, generated only for the PRELIM_B screen.'),
});

export type EnhancedDiagnoseInput = z.infer<typeof EnhancedDiagnoseInputSchema>;
export type DiagnoseConversionOutput = z.infer<typeof DiagnoseConversionOutputSchema>;

export interface EnhancedAIInput {
  currentSelection: {
    buttonNumber: number;
    buttonText: string;
    screen: string;
  };
  userJourney: UserJourney;
  screenConfig: ScreenConfig;
}

// Enhanced OpenAI service with full context
class EnhancedOpenAIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  public async generateResponse(input: EnhancedAIInput): Promise<DiagnoseConversionOutput> {
    const prompt = this.buildContextualPrompt(input);
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
            content: 'You are a professional business assessment AI that creates personalized, contextual responses based on the complete user journey. Always respond with valid JSON matching the required schema.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1200,
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

  private buildContextualPrompt(input: EnhancedAIInput): string {
    const journey = input.userJourney.responses.map(r => 
      `${r.screen}: "${r.buttonText}"`
    ).join('\n');
    
    const currentSelection = `${input.currentSelection.screen}: "${input.currentSelection.buttonText}"`;
    
    // Generate questions for PRELIM_B
    if (input.currentSelection.screen === 'PRELIM_B') {
      return `User Journey Context:\n${journey}\n\nCurrent Selection: ${currentSelection}\n\nYou're helping a business visitor assess their needs. Based on their pain point selection "${input.currentSelection.buttonText}", generate 5 highly targeted, specific questions that will help uncover their exact situation and needs.\n\nReturn JSON with:\n- "response": A brief, encouraging message acknowledging their selection\n- "questions": 5 specific questions tailored to their selected pain point\n\nMake questions actionable and diagnostic, not generic.`;
    }
    
    // Generate dynamic questions for Q3 based on their journey
    if (input.currentSelection.screen === 'Q3' && input.screenConfig.aiGenerated) {
      return `User Journey Context:\n${journey}\n\nCurrent Selection: ${currentSelection}\n\nBased on their goal from Q2 and current obstacle selection, generate 4-5 highly specific follow-up questions that dig deeper into their constraint. Some questions may need multiple answers.\n\nReturn JSON with:\n- "response": Brief acknowledgment of their obstacle\n- "questions": 4-5 targeted questions about their specific obstacle that help identify root causes and potential solutions\n\nMake questions diagnostic and solution-oriented.`;
    }
    
    // Final comprehensive report
    if (input.currentSelection.screen === 'Q5') {
      return `Complete User Journey:\n${journey}\nFinal Selection: ${currentSelection}\n\nCreate a comprehensive, personalized business assessment report. Analyze their complete journey and provide specific, actionable insights based on their exact selections.\n\nReturn JSON with:\n- "response": A detailed report (250-350 words) that:\n  • References their specific selections\n  • Provides tailored recommendations\n  • Includes concrete next steps\n  • Feels uniquely crafted for their situation\n\nMake it feel like a custom consultation, not a generic template.`;
    }
    
    return `User Journey So Far:\n${journey}\nCurrent: ${currentSelection}\n\nProvide a brief, contextual response that acknowledges their selection and builds momentum. Reference their journey when relevant.\n\nReturn JSON with:\n- "response": A personalized acknowledgment (1-2 sentences)`;
  }
}

// Enhanced AI service with fallback
class EnhancedAIService {
  private openAI: EnhancedOpenAIService;

  constructor() {
    this.openAI = new EnhancedOpenAIService();
  }

  async generateResponse(input: EnhancedAIInput): Promise<DiagnoseConversionOutput> {
    try {
      return await this.openAI.generateResponse(input);
    } catch (error) {
      return this.generateFallbackResponse(input);
    }
  }

  private generateFallbackResponse(input: EnhancedAIInput): DiagnoseConversionOutput {
    const selection = input.currentSelection.buttonText;
    
    if (input.currentSelection.screen === 'PRELIM_B') {
      return {
        response: `Thank you for identifying "${selection}" as your key challenge. Let's explore this further with targeted questions.`,
        questions: [
          "What specific aspect of this challenge impacts you most?",
          'How long have you been experiencing this issue?',
          'What approaches have you tried so far?',
          'What would an ideal solution look like?',
          "What's preventing you from solving this right now?",
        ],
      };
    }
    
    if (input.currentSelection.screen === 'Q5') {
      const journey = input.userJourney.responses.map(r => r.buttonText).join(', ');
      return {
        response: `Based on your journey (${journey}) and final selection of "${selection}", we see a clear pattern of strategic thinking and growth focus.\n\nYour responses indicate specific opportunities in:\n• Targeted solutions for your identified challenges\n• Strategic implementation aligned with your decision-making style\n• Measurable outcomes that match your success criteria\n\nRecommended next step: Schedule a consultation to transform these insights into a customized action plan tailored to your specific situation.`,
      };
    }
    
    return {
      response: `Thank you for selecting "${selection}". This gives us valuable insight into your situation.`,
    };
  }
}

// Singleton instance
const enhancedAIService = new EnhancedAIService();

// Enhanced exported function
export async function diagnoseConversionEnhanced(input: EnhancedAIInput): Promise<DiagnoseConversionOutput> {
  if (!input.currentSelection?.buttonText || !input.currentSelection?.screen) {
    throw new Error('Invalid current selection data.');
  }
  if (!input.userJourney?.sessionId) {
    throw new Error('Invalid user journey data.');
  }

  try {
    const result = await enhancedAIService.generateResponse(input);
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
    console.error('Error in diagnoseConversionEnhanced:', error);
    throw error;
  }
}