/*
 * Server actions for communicating with the AI flow.  Actions are
 * invoked from client components via Next.js and run on the server.
 * They wrap the diagnosePlant function and return a discriminated
 * union indicating success or error.
 */

'use server';

import { diagnoseConversion, DiagnoseConversionOutput } from '@/ai/flows/conversion-flow';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
  | null;

export async function submitSelection(
  buttonNumber: number,
  question: string
): Promise<ActionResult<DiagnoseConversionOutput>> {
  if (buttonNumber < 1 || buttonNumber > 5) {
    return { success: false, error: 'Invalid button selection.' };
  }
  try {
    const input = { buttonNumber, question };
    const sanitizedInput = { buttonNumber, question: question.replace(/[\r\n\t]/g, '').substring(0, 100) };
    console.log('Submitting to AI flow with input:', JSON.stringify(sanitizedInput, null, 2));
    const result = await diagnoseConversion(input);
    const sanitizedResult = { ...result, response: result.response?.replace(/[\r\n\t]/g, '').substring(0, 200) || '' };
    console.log('Received from AI flow:', JSON.stringify(sanitizedResult, null, 2));
    if (!result || !result.response) {
      return { success: false, error: 'The AI could not generate a response. Please try again.' };
    }
    return { success: true, data: result };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message.replace(/[\r\n\t]/g, '').substring(0, 100) : 'Unknown error occurred';
    console.error('ERROR in submitSelection:', errorMessage);
    
    // Return specific error messages for better debugging
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return { success: false, error: 'API configuration error. Please check settings.' };
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return { success: false, error: 'Network error. Please check your connection.' };
      }
    }
    
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}