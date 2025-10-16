import { useState, useCallback, useEffect, useRef } from 'react';
import { AppState, NavigationState, AIGeneratedQuestions, ContentType } from '../types/app-state';
import { ReportData, isReportData } from '../types/report';
import { JourneyTracker } from '../lib/journey-tracker';
import { getScreenConfig } from '../lib/screen-config-new';
import { getContentType } from '../lib/content-type-utils';
import { secureApiCall } from '../lib/api-client';

const SCREEN_SEQUENCE = ['PRELIM_1', 'PRELIM_2', 'PRELIM_3', 'AIQ1', 'AIQ2', 'AIQ3', 'AIQ4', 'AIQ5', 'REPORT'];

function getAIQuestionIndex(screen: string): number {
  if (screen.startsWith('AIQ')) {
    const n = Number(screen.slice(3));
    return Number.isFinite(n) ? n - 1 : -1; // AIQ1->0 .. AIQ5->4
  }
  return -1;
}


type TransitionValidation = {
  valid: boolean;
  reason?: string;
};

const validateTransition = (currentState: AppState): TransitionValidation => {
  if (currentState.isTextInput) {
    if (currentState.textValue.trim().length < 5) {
      return { valid: false, reason: 'Please enter at least 5 characters' };
    }
  } else if (currentState.isMultiSelect) {
    if (currentState.multiSelections.length === 0) {
      return { valid: false, reason: 'Please select at least one option' };
    }
  } else if (currentState.currentScreen !== 'REPORT') {
    if (currentState.tempSelection === null) {
      return { valid: false, reason: 'Please select an option' };
    }
  }

  return { valid: true };
};

const shouldDisableMotion = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const isMobile = /Mobi|Android/i.test(window.navigator.userAgent);
  return prefersReducedMotion || isMobile;
};

export function useAssessmentFlow() {
  const [journeyTracker] = useState(() => new JourneyTracker());
  const [state, setState] = useState<AppState>({
    currentScreen: 'PRELIM_1',
    currentScreenIndex: 0,
    totalScreens: SCREEN_SEQUENCE.length,
    industry: null,
    customScenario: null,
    isLoading: false,
    error: null,
    tempSelection: null,
    multiSelections: [],
    textValue: '',
    hoveredOption: null,
    reportData: null,
    isReport: false,
    currentTitle: '',
    currentSubtitle: '',
    currentOptions: [],
    isTextInput: false,
    isMultiSelect: false,
    maxSelections: 1,
    aiGenerated: false,
    motionEnabled: true,
    contentType: ContentType.SINGLE_CHOICE,
  });

  const [aiQuestions, setAiQuestions] = useState<AIGeneratedQuestions | null>(null);
  const aiQuestionsRef = useRef<AIGeneratedQuestions | null>(null);
  const aiFetchInFlightRef = useRef(false);

  useEffect(() => {
    aiQuestionsRef.current = aiQuestions;
  }, [aiQuestions]);

  useEffect(() => {
    const disableMotion = shouldDisableMotion();
    if (disableMotion) {
      setState(prev => (prev.motionEnabled ? { ...prev, motionEnabled: false } : prev));
    }
  }, []);

  useEffect(() => {
    try {
      if (state.currentScreen === 'REPORT') {
        setState(prev => ({
          ...prev,
          isReport: true,
          currentTitle: 'Strategic Business Case & Value Proposition',
          currentSubtitle: 'Executive Assessment Report',
          currentOptions: [],
          isTextInput: false,
          isMultiSelect: false,
          aiGenerated: false,
        }));
        return;
      }

      const isAIScreen = state.currentScreen.startsWith('AIQ');
      if (isAIScreen) {
        setState(prev => ({
          ...prev,
          isReport: false,
          aiGenerated: true,
          currentTitle: 'Loading question...',
          currentSubtitle: '',
          currentOptions: [],
          isTextInput: false,
          isMultiSelect: false,
          error: null,
        }));
        return;
      }

      const config = getScreenConfig(state.currentScreen, state.industry || undefined);

      setState(prev => ({
        ...prev,
        isReport: false,
        currentTitle: config.title,
        currentSubtitle: config.subtitle ?? '',
        currentOptions: config.options,
        isTextInput: config.textInput ?? false,
        isMultiSelect: config.multiSelect ?? false,
        maxSelections: config.maxSelections ?? 7,
        aiGenerated: Boolean(config.aiGenerated),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load screen configuration',
      }));
    }
  }, [state.currentScreen, state.industry]);

  useEffect(() => {
    if (!state.aiGenerated) {
      return;
    }

    const questionIndex = getAIQuestionIndex(state.currentScreen);
    if (questionIndex < 0) {
      return;
    }

    if (!aiQuestions) {
      return;
    }

    const question = aiQuestions.questions[questionIndex];
    if (!question) {
      setState(prev => ({
        ...prev,
        error: prev.error ?? 'Unable to load AI question for this step',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      currentTitle: question.text,
      currentSubtitle: '',
      currentOptions: Array.isArray(question.options) ? question.options : [],
      isTextInput: question.type === 'text_input',
      isMultiSelect: question.type === 'multi_choice',
      maxSelections:
        question.type === 'multi_choice' && Number.isFinite(question.maxSelections)
          ? (question.maxSelections as number)
          : 7,
      error: null,
    }));
  }, [state.aiGenerated, state.currentScreen, aiQuestions]);

  const loadAIQuestions = useCallback(
    async (screen: string, industry: string | null, customScenario: string | null) => {
      if (aiFetchInFlightRef.current) {
        return;
      }

      aiFetchInFlightRef.current = true;

      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        currentTitle: 'Generating questions...',
        currentSubtitle: '',
        currentOptions: [],
        isTextInput: false,
        isMultiSelect: false,
        maxSelections: 1,
      }));

      try {
        const trimmedIndustry = typeof industry === 'string' ? industry.trim() : '';
        const trimmedScenario = typeof customScenario === 'string' ? customScenario.trim() : '';

        const journey = journeyTracker.getFullContext(screen);

        const requestBody: Record<string, unknown> = {
          userJourney: journey,
          requestType: 'generate_questions',
        };

        if (trimmedIndustry) {
          requestBody.industry = trimmedIndustry;
        }

        if (trimmedScenario) {
          requestBody.customScenario = trimmedScenario;
        }

        const response = await secureApiCall('/api/ai-assessment', requestBody);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`Failed to generate questions: ${errorText}`);
        }

        const data: AIGeneratedQuestions = await response.json();

        if (!data || !Array.isArray(data.questions)) {
          throw new Error('Invalid response format');
        }

        setAiQuestions(data);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load questions';
        console.error('❌ loadAIQuestions failed:', error);

        // Extract request ID if available in error message
        const requestIdMatch = message.match(/\[req_[\w_]+\]/);
        const requestId = requestIdMatch ? requestIdMatch[0] : '';
        
        // Format error message with context
        const errorDisplay = requestId 
          ? `${message}\n${requestId}`
          : message;

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorDisplay,
          currentTitle: 'Unable to generate questions',
          currentSubtitle: 'Please try again.',
          currentOptions: [],
          isTextInput: false,
          isMultiSelect: false,
          maxSelections: 1,
        }));
      } finally {
        aiFetchInFlightRef.current = false;
      }
    },
    [journeyTracker]
  );

  useEffect(() => {
    // Trigger on any AI screen (AIQ1-AIQ5), not just AIQ1
    const isAIScreen = state.currentScreen.startsWith('AIQ');
    if (!isAIScreen) {
      return;
    }

    // Don't re-fetch if already loaded
    if (aiFetchInFlightRef.current) {
      return;
    }

    if (aiQuestionsRef.current) {
      return;
    }

    const trimmedIndustry = typeof state.industry === 'string' ? state.industry.trim() : '';
    if (!trimmedIndustry) {
      return;
    }

    if (
      trimmedIndustry === 'Custom Strategic Initiative' &&
      !(typeof state.customScenario === 'string' && state.customScenario.trim().length > 0)
    ) {
      return;
    }

    void loadAIQuestions(state.currentScreen, trimmedIndustry, state.customScenario ?? null);
  }, [state.currentScreen, state.industry, state.customScenario, loadAIQuestions]);

  const handleSelection = useCallback((value: number, isMulti: boolean) => {
    if (isMulti) {
      setState(prev => {
        const newSelections = prev.multiSelections.includes(value)
          ? prev.multiSelections.filter(v => v !== value)
          : [...prev.multiSelections, value];
        return { ...prev, multiSelections: newSelections, error: null };
      });
    } else {
      setState(prev => ({ ...prev, tempSelection: value, error: null }));
    }
  }, []);

  const handleTextChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, textValue: value, error: null }));
  }, []);

  const handleRetryAiQuestions = useCallback(() => {
    if (!state.aiGenerated) {
      return;
    }

    const trimmedIndustry = typeof state.industry === 'string' ? state.industry.trim() : '';
    if (!trimmedIndustry) {
      return;
    }

    if (
      trimmedIndustry === 'Custom Strategic Initiative' &&
      !(typeof state.customScenario === 'string' && state.customScenario.trim().length > 0)
    ) {
      return;
    }

    if (aiFetchInFlightRef.current) {
      return;
    }

    setAiQuestions(null);
    aiQuestionsRef.current = null;
    void loadAIQuestions(state.currentScreen, trimmedIndustry, state.customScenario ?? null);
  }, [state.aiGenerated, state.currentScreen, state.industry, state.customScenario, loadAIQuestions]);

  const handleHover = useCallback((value: number | null) => {
    setState(prev => ({ ...prev, hoveredOption: value }));
  }, []);

  const generateReport = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const journey = journeyTracker.getFullContext('REPORT');

        const trimmedIndustry = typeof state.industry === 'string' ? state.industry.trim() : '';
        const trimmedScenario = typeof state.customScenario === 'string' ? state.customScenario.trim() : '';

        const requestBody: Record<string, unknown> = {
          userJourney: journey,
          requestType: 'generate_report',
        };

        if (trimmedIndustry) {
          requestBody.industry = trimmedIndustry;
        }

        if (trimmedScenario) {
          requestBody.customScenario = trimmedScenario;
        }

        const response = await secureApiCall('/api/ai-assessment', requestBody);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Failed to generate report: ${errorText}`);
      }

      const rawReport: unknown = await response.json();

      if (!isReportData(rawReport)) {
        throw new Error('Invalid report format');
      }

      const reportData: ReportData = rawReport;

      setState(prev => {
        const nextState: AppState = {
          ...prev,
          currentScreen: 'REPORT',
          currentScreenIndex: SCREEN_SEQUENCE.length - 1,
          reportData,
          isReport: true,
          isLoading: false,
          tempSelection: null,
          multiSelections: [],
          textValue: '',
          hoveredOption: null,
        };

        return nextState;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate report';
      console.error('❌ generateReport failed:', error);

      // Extract request ID if available in error message
      const requestIdMatch = message.match(/\[req_[\w_]+\]/);
      const requestId = requestIdMatch ? requestIdMatch[0] : '';
      
      // Format error message with context
      const errorDisplay = requestId 
        ? `${message}\n${requestId}`
        : message;

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorDisplay,
      }));
    }
  }, [journeyTracker, state.customScenario, state.industry]);

  const handleConfirm = useCallback(async () => {
    const validation = validateTransition(state);

    if (!validation.valid) {
      setState(prev => ({ ...prev, error: validation.reason ?? 'Please complete required fields' }));
      return;
    }

    if (state.isTextInput) {
      const trimmed = state.textValue.trim();
      journeyTracker.addResponse(state.currentScreen, 0, trimmed, trimmed);
    } else if (state.isMultiSelect) {
      const selectedTexts = state.multiSelections
        .map(val => state.currentOptions[val - 1])
        .filter((text): text is string => text !== undefined)
        .join(', ');
      const firstSelection = state.multiSelections[0];
      if (firstSelection !== undefined) {
        journeyTracker.addResponse(state.currentScreen, firstSelection, selectedTexts);
      }
    } else if (state.tempSelection !== null) {
      const selectedText = state.currentOptions[state.tempSelection - 1];
      if (selectedText !== undefined) {
        journeyTracker.addResponse(state.currentScreen, state.tempSelection, selectedText);
      }
    }

    const nextIndex = state.currentScreenIndex + 1;

    if (nextIndex >= SCREEN_SEQUENCE.length - 1) {
      await generateReport();
      return;
    }

    const nextScreen = SCREEN_SEQUENCE[nextIndex];
    if (!nextScreen) return;

    const trimmedValue = state.textValue.trim();
    const selectedOption =
      state.tempSelection != null ? state.currentOptions[state.tempSelection - 1] ?? null : null;

    setState(prev => {
      const nextState: AppState = {
        ...prev,
        currentScreen: nextScreen,
        currentScreenIndex: nextIndex,
        tempSelection: null,
        multiSelections: [],
        textValue: '',
        error: null,
        isReport: false,
        hoveredOption: null,
      };

      if (state.isTextInput && prev.currentScreen === 'PRELIM_2' && prev.industry === 'Custom Strategic Initiative') {
        nextState.customScenario = trimmedValue;
      }

      if (!state.isTextInput && !state.isMultiSelect && selectedOption !== null && prev.currentScreen === 'PRELIM_1') {
        nextState.industry = selectedOption;
        nextState.totalScreens = SCREEN_SEQUENCE.length + (selectedOption === 'Custom Strategic Initiative' ? 1 : 0);
      }

      return nextState;
    });
  }, [state, journeyTracker, generateReport]);



  const handleBack = useCallback(() => {
    if (state.currentScreenIndex > 0) {
      const prevIndex = state.currentScreenIndex - 1;
      const prevScreen = SCREEN_SEQUENCE[prevIndex];
      if (!prevScreen) return;
      
      setState(prev => {
        const nextState: AppState = {
          ...prev,
          currentScreen: prevScreen,
          currentScreenIndex: prevIndex,
          tempSelection: null,
          multiSelections: [],
          textValue: '',
          error: null,
          isReport: false,
          hoveredOption: null,
        };

        return nextState;
      });
    }
  }, [state.currentScreenIndex]);

  const handleReset = useCallback(() => {
    journeyTracker.clear();
    setAiQuestions(null);
    aiQuestionsRef.current = null;
    aiFetchInFlightRef.current = false;
    setState({
      currentScreen: 'PRELIM_1',
      currentScreenIndex: 0,
      totalScreens: SCREEN_SEQUENCE.length,
      industry: null,
      customScenario: null,
      isLoading: false,
      error: null,
      tempSelection: null,
      multiSelections: [],
      textValue: '',
      hoveredOption: null,
      reportData: null,
      isReport: false,
      currentTitle: '',
      currentSubtitle: '',
      currentOptions: [],
      isTextInput: false,
      isMultiSelect: false,
      maxSelections: 1,
      aiGenerated: false,
      motionEnabled: !shouldDisableMotion(),
      contentType: ContentType.SINGLE_CHOICE,
    });
  }, [journeyTracker]);

  const handleCopyReport = useCallback(async () => {
    if (state.reportData) {
      const reportText = JSON.stringify(state.reportData, null, 2);
      try {
        await navigator.clipboard.writeText(reportText);
        setState(prev => ({ ...prev, error: null }));
        // Could add a success message state if needed
      } catch (copyError) {
        console.error('Clipboard copy failed', copyError);
        setState(prev => ({ ...prev, error: 'Failed to copy report' }));
      }
    }
  }, [state.reportData]);

  const navigationState: NavigationState = {
    canGoBack: state.currentScreenIndex > 0,
    canConfirm: state.isTextInput 
      ? state.textValue.trim().length >= 5
      : state.isMultiSelect 
        ? state.multiSelections.length > 0
        : state.tempSelection !== null,
    isFirstScreen: state.currentScreenIndex === 0,
    isLastScreen: state.currentScreen === 'REPORT',
  };

  const contentType = getContentType(state);

  return {
    state: {
      ...state,
      contentType,
    },
    navigationState,
    handlers: {
      handleSelection,
      handleTextChange,
      handleConfirm,
      handleBack,
      handleReset,
      handleCopyReport,
      handleHover,
      handleRetryAiQuestions,
    },
  };
}
