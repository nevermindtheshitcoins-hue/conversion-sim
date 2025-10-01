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
    console.error('Enhanced action error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}