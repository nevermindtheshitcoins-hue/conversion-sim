'use server';

import { diagnoseConversionEnhanced } from '../ai/flows/enhanced-conversion-flow';
import type { EnhancedAIInput } from '../ai/flows/enhanced-conversion-flow';

export async function submitSelectionEnhanced(input: EnhancedAIInput) {
  try {
    const result = await diagnoseConversionEnhanced(input);
    
    return {
      success: true,
      data: {
        response: result.response,
        questions: result.questions || [],
      },
    };
  } catch (error) {
    const sanitizedError = error instanceof Error 
      ? { message: error.message.replace(/[\r\n\t]/g, '').substring(0, 200), name: error.name }
      : 'Unknown error';
    console.error('Enhanced action error:', sanitizedError);
    const sanitizedUserError = error instanceof Error 
      ? error.message.replace(/[\r\n\t]/g, '').substring(0, 200)
      : 'Unknown error occurred';
    return {
      success: false,
      error: sanitizedUserError,
    };
  }
}