'use server';

import { z } from 'genkit';
import type { UserJourney } from '../../lib/journey-tracker';

const FullContextInputSchema = z.object({
  userJourney: z.object({
    sessionId: z.string(),
    responses: z.array(z.object({
      screen: z.string(),
      buttonNumber: z.number(),
      buttonText: z.string(),
      timestamp: z.number(),
    })),
  }),
  requestType: z.enum(['generate_questions', 'generate_report']),
  industry: z.string().optional(),
});

const FullContextOutputSchema = z.object({
  response: z.string(),
  questions: z.array(z.string()).optional(),
  reportFactors: z.array(z.object({
    factor: z.string(),
    analysis: z.string(),
    recommendation: z.string()
  })).optional(),
});

export type FullContextInput = z.infer<typeof FullContextInputSchema>;
export type FullContextOutput = z.infer<typeof FullContextOutputSchema>;

class FullContextAIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
  }

  async generateContent(input: FullContextInput): Promise<FullContextOutput> {
    const prompt = this.buildPrompt(input);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a business assessment AI that creates highly personalized, industry-specific content based on complete user journeys. Always respond with valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    return JSON.parse(content) as FullContextOutput;
  }

  private buildPrompt(input: FullContextInput): string {
    const journey = input.userJourney.responses.map(r => 
      `${r.screen}: "${r.buttonText}"`
    ).join('\n');

    if (input.requestType === 'generate_questions') {
      return `Industry: ${input.industry || 'General Business'}
User Journey:
${journey}

Based on their industry and preliminary responses, generate 5 highly specific, diagnostic STATEMENTS (not questions) that users can agree/disagree with using a 5-point scale.

Each statement should:
- Be tailored to their industry and previous answers
- Present a specific business situation or challenge they might face
- Be something they can strongly agree or disagree with
- Help identify their exact circumstances

Return JSON with:
- "response": Brief message about generating personalized statements
- "questions": Array of 5 specific STATEMENTS (not questions) for Q4, Q5, Q6, Q7, Q8

Make each statement unique and progressively more specific. Format as statements, not questions.`;
    }

    if (input.requestType === 'generate_report') {
      return `Industry: ${input.industry}
Complete User Journey:
${journey}

Create a comprehensive business assessment report with 8 customizable factors. Analyze their complete journey and provide specific insights.

Return JSON with:
- "response": Executive summary (100-150 words)
- "reportFactors": Array of 8 objects, each with:
  - "factor": Factor name (e.g., "Growth Potential", "Operational Efficiency")
  - "analysis": Specific analysis based on their responses (50-75 words)
  - "recommendation": Actionable recommendation (30-50 words)

Make each factor highly relevant to their industry and specific situation.`;
    }

    return `Analyze the user journey and provide contextual insights.`;
  }

  generateFallback(input: FullContextInput): FullContextOutput {
    if (input.requestType === 'generate_questions') {
      return {
        response: "Generating personalized questions based on your responses...",
        questions: [
          "We struggle with measuring success in our key business areas",
          "This challenge significantly impacts our daily operations",
          "Previous solutions we've tried haven't delivered expected results",
          "We have a clear vision of our ideal business outcome",
          "We have a realistic timeline for addressing our priorities"
        ]
      };
    }

    return {
      response: "Based on your responses, we've identified key areas for improvement and growth opportunities tailored to your specific situation.",
      reportFactors: [
        {
          factor: "Strategic Focus",
          analysis: "Your responses indicate a clear strategic direction with specific priorities.",
          recommendation: "Continue focusing on your identified key areas while monitoring progress."
        },
        {
          factor: "Operational Efficiency", 
          analysis: "There are opportunities to streamline processes and improve workflow.",
          recommendation: "Implement systematic process improvements and automation where possible."
        },
        {
          factor: "Growth Potential",
          analysis: "Strong foundation for scaling with proper resource allocation.",
          recommendation: "Develop a structured growth plan with clear milestones."
        },
        {
          factor: "Risk Management",
          analysis: "Current approach shows awareness of key business risks.",
          recommendation: "Establish formal risk assessment and mitigation procedures."
        },
        {
          factor: "Team Development",
          analysis: "Team capabilities align well with business objectives.",
          recommendation: "Invest in targeted skill development and leadership training."
        },
        {
          factor: "Technology Integration",
          analysis: "Technology usage supports current operations effectively.",
          recommendation: "Evaluate emerging technologies for competitive advantage."
        },
        {
          factor: "Customer Focus",
          analysis: "Customer-centric approach evident in decision-making process.",
          recommendation: "Enhance customer feedback systems and personalization."
        },
        {
          factor: "Financial Health",
          analysis: "Financial planning shows consideration of long-term sustainability.",
          recommendation: "Implement regular financial reviews and scenario planning."
        }
      ]
    };
  }
}

const fullContextService = new FullContextAIService();

export async function generateQuestionsFromPrelims(userJourney: UserJourney, industry: string): Promise<FullContextOutput> {
  try {
    return await fullContextService.generateContent({
      userJourney,
      requestType: 'generate_questions',
      industry
    });
  } catch (error) {
    const sanitizedError = error instanceof Error 
      ? error.message.replace(/[\r\n\t]/g, '').substring(0, 100)
      : 'Unknown error';
    console.error('Question generation error:', sanitizedError);
    return fullContextService.generateFallback({
      userJourney,
      requestType: 'generate_questions',
      industry
    });
  }
}

export async function generateCustomReport(userJourney: UserJourney, industry: string): Promise<FullContextOutput> {
  try {
    return await fullContextService.generateContent({
      userJourney,
      requestType: 'generate_report', 
      industry
    });
  } catch (error) {
    const sanitizedError = error instanceof Error 
      ? error.message.replace(/[\r\n\t]/g, '').substring(0, 100)
      : 'Unknown error';
    console.error('Report generation error:', sanitizedError);
    return fullContextService.generateFallback({
      userJourney,
      requestType: 'generate_report',
      industry
    });
  }
}