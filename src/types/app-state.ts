// Central type definitions for app state management

import { ReportData } from './report';

export interface AppState {
  // Current screen information
  currentScreen: string;
  currentScreenIndex: number;
  totalScreens: number;
  
  // Industry and context
  industry: string | null;
  customScenario: string | null;
  
  // UI state
  progress: number;
  isLoading: boolean;
  error: string | null;
  
  // Selection state
  tempSelection: number | null;
  multiSelections: number[];
  textValue: string;
  hoveredOption: number | null;
  
  // Report state
  reportData: ReportData | null;
  isReport: boolean;
  
  // Screen configuration state
  currentTitle: string;
  currentSubtitle?: string;
  currentOptions: string[];
  isTextInput: boolean;
  isMultiSelect: boolean;
  maxSelections: number;
  aiGenerated: boolean;
}

export interface TextInputState {
  value: string;
  isValid: boolean;
  minLength: number;
  maxLength: number;
  validationError: string | null;
  preview: string;
  showPreview: boolean;
}

export interface ReportGenerationRequest {
  userJourney: {
    sessionId: string;
    responses: Array<{
      screen: string;
      buttonNumber: number;
      buttonText: string;
      timestamp: number;
      textInput?: string;
    }>;
    metadata: {
      startTime: number;
      currentScreen: string;
      totalScreens: number;
    };
  };
  requestType: 'generate_questions' | 'generate_report';
  industry?: string;
  customScenario?: string;
  signature: string;
}

export interface ReportGenerationResponse {
  success: boolean;
  data?: ReportData;
  error?: string;
  provider?: 'openai' | 'gemini';
  fallbackUsed?: boolean;
}

export interface AIGeneratedQuestions {
  response: string;
  questions: Array<{
    text: string;
    options: string[];
  }>;
}

export interface NavigationState {
  canGoBack: boolean;
  canConfirm: boolean;
  isFirstScreen: boolean;
  isLastScreen: boolean;
}
