import { useState, useCallback, useEffect } from 'react';
import { AppState, NavigationState, AIGeneratedQuestions, ContentType } from '../types/app-state';
import { ReportData } from '../types/report';
import { JourneyTracker } from '../lib/journey-tracker';
import { getScreenConfig } from '../lib/screen-config-new';
import { getContentType } from '../lib/content-type-utils';
import { secureApiCall } from '../lib/api-client';

const SCREEN_SEQUENCE = ['PRELIM_1', 'PRELIM_2', 'PRELIM_3', 'Q4', 'Q5', 'Q6', 'Q7', 'REPORT'];


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

  useEffect(() => {
    const disableMotion = shouldDisableMotion();
    if (disableMotion) {
      setState(prev => (prev.motionEnabled ? { ...prev, motionEnabled: false } : prev));
    }
  }, []);

  // Update screen configuration when screen changes
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
        }));
        return;
      }

      const config = getScreenConfig(state.currentScreen, state.industry || undefined);
      
      setState(prev => ({
        ...prev,
        currentTitle: config.title,
        currentSubtitle: config.subtitle ?? '',
        currentOptions: config.options,
        isTextInput: config.textInput || false,
        isMultiSelect: config.multiSelect || false,
        maxSelections: config.maxSelections || 1,
        aiGenerated: config.aiGenerated || false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load screen configuration',
      }));
    }
  }, [state.currentScreen, state.industry]);

  // Load AI-generated questions for dynamic screens
  useEffect(() => {
    if (state.aiGenerated && !aiQuestions && state.industry && (
      state.customScenario || state.industry !== 'Custom Strategic Initiative'
    )) {
      loadAIQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.aiGenerated, state.industry, state.customScenario, aiQuestions]);

  const loadAIQuestions = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const journey = journeyTracker.getFullContext(state.currentScreen);
      
      const response = await secureApiCall('/api/ai-assessment', {
        userJourney: journey,
        requestType: 'generate_questions',
        industry: state.industry,
        customScenario: state.customScenario,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Failed to generate questions: ${errorText}`);
      }

      const data: AIGeneratedQuestions = await response.json();
      
      if (!data || !data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid response format');
      }
      setAiQuestions(data);
      
      // Map AI questions to current screen
      const questionIndex = parseInt(state.currentScreen.replace('Q', '')) - 4;
      const question = data.questions[questionIndex];
      if (question) {
        setState(prev => ({
          ...prev,
          currentTitle: question.text,
          currentOptions: question.options,
          isLoading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load questions',
      }));
    }
  };

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

  const handleHover = useCallback((value: number | null) => {
    setState(prev => ({ ...prev, hoveredOption: value }));
  }, []);

  const generateReport = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const journey = journeyTracker.getFullContext('REPORT');

      const response = await secureApiCall('/api/ai-assessment', {
        userJourney: journey,
        requestType: 'generate_report',
        industry: state.industry,
        customScenario: state.customScenario,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Failed to generate report: ${errorText}`);
      }

      const reportData: ReportData = await response.json();

      if (!reportData || typeof reportData !== 'object') {
        throw new Error('Invalid report format');
      }

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
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate report',
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
      } catch (error) {
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
    },
  };
}
