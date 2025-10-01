/*
 * Server actions for communicating with the AI flow.  Actions are
 * invoked from client components via Next.js and run on the server.
 * They wrap the diagnosePlant function and return a discriminated
 * union indicating success or error.
 */

'use server';

import { diagnosePlant, DiagnosePlantOutput } from '@/ai/flows/conversion-flow';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
  | null;

export async function submitSelection(
  buttonNumber: number,
  question: string
): Promise<ActionResult<DiagnosePlantOutput>> {
  if (buttonNumber < 1 || buttonNumber > 5) {
    return { success: false, error: 'Invalid button selection.' };
  }
  try {
    const input = { buttonNumber, question };
    console.log('Submitting to AI flow with input:', JSON.stringify(input, null, 2));
    const result = await diagnosePlant(input);
    console.log('Received from AI flow:', JSON.stringify(result, null, 2));
    if (!result || !result.response) {
      return { success: false, error: 'The AI could not generate a response. Please try again.' };
    }
    return { success: true, data: result };
  } catch (e) {
    console.error('ERROR in submitSelection:', e);
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}