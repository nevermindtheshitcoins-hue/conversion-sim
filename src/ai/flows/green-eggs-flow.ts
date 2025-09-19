'use server';

/**
 * @fileOverview A flow for the Green Eggs and Ham-style chooser app.
 *
 * - diagnosePlant - A function that handles responding to user choices.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantInputSchema = z.object({
  buttonNumber: z.number().describe('The number of the button that was pressed.'),
  question: z.string().describe('The context of the screen where the button was pressed.'),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  response: z.string().describe('The generated response from the AI.'),
  questions: z.array(z.string()).optional().describe('A list of 5 questions, generated only for the PRELIM_B screen.'),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

const GreenEggsFlowOutputSchemaPartial = DiagnosePlantOutputSchema.partial();

export async function diagnosePlant(input: DiagnosePlantInput): Promise<DiagnosePlantOutput> {
  let promptText: string;
  let outputSchema: z.ZodSchema<any>;

  if (input.question === 'Screen: PRELIM_B') {
    promptText = `Hooray! Hooray! You're on your way! You've passed the prelims, come what may! For pressing button {{buttonNumber}}, a treasure awaits, a list of questions to open the gates! Please provide a JSON object with a 'response' field containing a short celebratory message and a 'questions' field containing an array of 5 unique questions.`;
    outputSchema = DiagnosePlantOutputSchema;
  } else if (input.question === 'Screen: Q5') {
    promptText = `Oh, the places you'll go, the things you will see! You've answered the questions, all five, with glee! With button {{buttonNumber}} as your guide and your key, a marvelous report is what you will see! Create a final report based on the journey so far.`;
    outputSchema = GreenEggsFlowOutputSchemaPartial;
  } else {
    promptText = `The user was asked the question: "{{question}}". They selected button {{buttonNumber}}. Provide a one-word answer to the question, and then repeat that answer a number of times equal to the button number selected.`;
    outputSchema = GreenEggsFlowOutputSchemaPartial;
  }

  const prompt = ai.definePrompt({
    name: 'greenEggsPrompt',
    input: {schema: DiagnosePlantInputSchema},
    output: {schema: outputSchema},
    prompt: promptText,
  });

  const {output} = await prompt(input);
  return output!;
}
