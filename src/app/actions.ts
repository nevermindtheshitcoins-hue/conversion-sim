'use server';

import {greenEggsFlow, GreenEggsFlowOutput} from '@/ai/flows/green-eggs-flow';

export type ActionResult<T> = {success: true; data: T} | {success: false; error: string} | null;

export async function submitSelection(buttonNumber: number): Promise<ActionResult<GreenEggsFlowOutput>> {
  if (buttonNumber < 1 || buttonNumber > 5) {
    return {success: false, error: 'Invalid button selection.'};
  }

  try {
    const result = await greenEggsFlow({buttonNumber});
    if (!result || !result.response) {
      return {success: false, error: 'The AI could not generate a response. Please try again.'};
    }
    return {success: true, data: result};
  } catch (e) {
    console.error(e);
    return {success: false, error: 'An unexpected error occurred. Please try again later.'};
  }
}
