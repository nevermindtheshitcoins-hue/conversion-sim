'use server';

/**
 * @fileOverview A scenario-based question generator AI agent.
 *
 * - generateScenarioQuestions - A function that handles the question generation process.
 * - GenerateScenarioQuestionsInput - The input type for the generateScenarioQuestions function.
 * - GenerateScenarioQuestionsOutput - The return type for the generateScenarioQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScenarioQuestionsInputSchema = z.object({
  scenarioDescription: z
    .string()
    .describe('A description of the scenario for which questions need to be generated.'),
});
export type GenerateScenarioQuestionsInput = z.infer<typeof GenerateScenarioQuestionsInputSchema>;

const GenerateScenarioQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The scenario-based question.'),
      options: z
        .array(z.string().max(5))
        .describe('The multiple-choice options for the question (A-E).')
        .length(5),
    })
  ).length(5),
});
export type GenerateScenarioQuestionsOutput = z.infer<typeof GenerateScenarioQuestionsOutputSchema>;

export async function generateScenarioQuestions(
  input: GenerateScenarioQuestionsInput
): Promise<GenerateScenarioQuestionsOutput> {
  return generateScenarioQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScenarioQuestionsPrompt',
  input: {schema: GenerateScenarioQuestionsInputSchema},
  output: {schema: GenerateScenarioQuestionsOutputSchema},
  prompt: `You are an expert in creating scenario-based questions with multiple-choice answers.

  You will generate exactly 5 questions based on the provided scenario description. Each question should have 5 options (A-E).
  Each option must be no more than 5 words.
  The questions and options must be structured deterministically as JSON.

  Scenario Description: {{{scenarioDescription}}}
  `,
});

const generateScenarioQuestionsFlow = ai.defineFlow(
  {
    name: 'generateScenarioQuestionsFlow',
    inputSchema: GenerateScenarioQuestionsInputSchema,
    outputSchema: GenerateScenarioQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
