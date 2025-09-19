'use server';

import { z } from 'zod';
import { generateScenarioQuestions, GenerateScenarioQuestionsOutput } from '@/ai/flows/generate-scenario-questions';
import { generateInsightfulReport, GenerateInsightfulReportOutput } from '@/ai/flows/generate-insightful-report';

const scenarioSchema = z.object({
  scenario: z.string().min(20, { message: 'Please provide a more detailed scenario (at least 20 characters).' }),
});

const reportSchema = z.object({
  data: z.string().min(20, { message: 'Please provide more data for the report (at least 20 characters).' }),
});

export type ActionResult<T> = { success: true; data: T } | { success: false; error: string } | null;

export async function submitScenario(
  prevState: ActionResult<GenerateScenarioQuestionsOutput>,
  formData: FormData
): Promise<ActionResult<GenerateScenarioQuestionsOutput>> {
  const validatedFields = scenarioSchema.safeParse({
    scenario: formData.get('scenario'),
  });

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.errors[0].message };
  }

  try {
    const result = await generateScenarioQuestions({
      scenarioDescription: validatedFields.data.scenario,
    });
    if (!result || !result.questions || result.questions.length === 0) {
      return { success: false, error: 'The AI could not generate questions for this scenario. Please try a different one.' };
    }
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}

export async function submitReportData(
  prevState: ActionResult<GenerateInsightfulReportOutput>,
  formData: FormData
): Promise<ActionResult<GenerateInsightfulReportOutput>> {
  const validatedFields = reportSchema.safeParse({
    data: formData.get('data'),
  });

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.errors[0].message };
  }

  try {
    const result = await generateInsightfulReport({
      data: validatedFields.data.data,
    });
    if (!result || !result.report) {
       return { success: false, error: 'The AI could not generate a report for this data. Please try different data.' };
    }
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}
