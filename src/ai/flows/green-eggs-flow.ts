'use server';

/**
 * @fileOverview Generates a response for the "Green Eggs and ???" prompt.
 *
 * - greenEggsFlow - A function that generates the response.
 * - GreenEggsFlowInput - The input type for the greenEggsFlow function.
 * - GreenEggsFlowOutput - The return type for the greenEggsFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GreenEggsFlowInputSchema = z.object({
  buttonNumber: z.number().describe('The number of the button that was pressed.'),
});
export type GreenEggsFlowInput = z.infer<typeof GreenEggsFlowInputSchema>;

const GreenEggsFlowOutputSchema = z.object({
  response: z.string().describe('The generated response from the AI.'),
});
export type GreenEggsFlowOutput = z.infer<typeof GreenEggsFlowOutputSchema>;

export async function greenEggsFlow(input: GreenEggsFlowInput): Promise<GreenEggsFlowOutput> {
  const prompt = ai.definePrompt({
    name: 'greenEggsPrompt',
    input: {schema: GreenEggsFlowInputSchema},
    output: {schema: GreenEggsFlowOutputSchema},
    prompt: `I pressed button {{buttonNumber}} now make me Green Eggs and ???`,
  });

  const {output} = await prompt(input);
  return output!;
}
