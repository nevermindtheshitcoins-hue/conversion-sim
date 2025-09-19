'use server';

/**
 * @fileOverview Generates a concise, insightful report summarizing key findings.
 *
 * - generateInsightfulReport - A function that generates the report.
 * - GenerateInsightfulReportInput - The input type for the generateInsightfulReport function.
 * - GenerateInsightfulReportOutput - The return type for the generateInsightfulReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightfulReportInputSchema = z.object({
  data: z.string().describe('Data or observations to summarize in the report.'),
});
export type GenerateInsightfulReportInput = z.infer<typeof GenerateInsightfulReportInputSchema>;

const GenerateInsightfulReportOutputSchema = z.object({
  report: z.string().describe('The generated insightful report.'),
});
export type GenerateInsightfulReportOutput = z.infer<typeof GenerateInsightfulReportOutputSchema>;

export async function generateInsightfulReport(input: GenerateInsightfulReportInput): Promise<GenerateInsightfulReportOutput> {
  return generateInsightfulReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightfulReportPrompt',
  input: {schema: GenerateInsightfulReportInputSchema},
  output: {schema: GenerateInsightfulReportOutputSchema},
  prompt: `You are an expert at summarizing data into concise, insightful reports.  The report should be structured as follows:\n\nTitle: A short title for the report (<= 10 words)\nDateline: The date of the report\nLede: A brief introductory paragraph (3-4 sentences)\nSupporting Sentences: Key findings and supporting details.\nQuote: A relevant quote from an expert or source.\nCTA: A call to action.\n\nData: {{{data}}}`,
});

const generateInsightfulReportFlow = ai.defineFlow(
  {
    name: 'generateInsightfulReportFlow',
    inputSchema: GenerateInsightfulReportInputSchema,
    outputSchema: GenerateInsightfulReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
