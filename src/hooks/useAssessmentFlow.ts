import { useState, useCallback, useEffect } from 'react';
import { AppState, NavigationState, AIGeneratedQuestions } from '../types/app-state';
import { ReportData } from '../types/report';
import { JourneyTracker } from '../lib/journey-tracker';
import { getScreenConfig } from '../lib/screen-config-new';

const SCREEN_SEQUENCE = ['PRELIM_1', 'PRELIM_2', 'PRELIM_3', 'Q4', 'Q5', 'Q6', 'Q7', 'REPORT'];

export function useAssessmentFlow() {
  const [journeyTracker] = useState(() => new JourneyTracker());
  const [state, setState] = useState<AppState>({
    currentScreen: 'PRELIM_1',
    currentScreenIndex: 0,
    totalScreens: SCREEN_SEQUENCE.length,
    industry: null,
    customScenario: null,
    progress: 0,
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
  });

  const [aiQuestions, setAiQuestions] = useState<AIGeneratedQuestions | null>(null);

  // Update screen configuration when screen changes
  useEffect(() => {
    try {
      if (state.currentScreen === 'REPORT') {
        setState(prev => ({
          ...prev,
          isReport: true,
          currentTitle: 'Your Deployment Report',
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
        currentSubtitle: config.subtitle,
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
    if (state.aiGenerated && !aiQuestions && state.industry) {
      loadAIQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.aiGenerated, state.industry, aiQuestions]);

  const loadAIQuestions = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const journey = journeyTracker.getFullContext(state.currentScreen);
      const timestamp = Date.now().toString();
      const nonce = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      
      const response = await fetch('/api/ai-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-timestamp': timestamp, 'x-nonce': nonce },
        body: JSON.stringify({
          userJourney: journey,
          requestType: 'generate_questions',
          industry: state.industry,
          customScenario: state.customScenario,
          // signature removed; server computes HMAC
        }),
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
      if (data.questions && data.questions[questionIndex]) {
        setState(prev => ({
          ...prev,
          currentTitle: data.questions[questionIndex].text,
          currentOptions: data.questions[questionIndex].options,
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
      const signaturePayload = {
        userJourney: journey,
        requestType: 'generate_report',
        industry: state.industry,
        customScenario: state.customScenario,
      };
      const timestamp = Date.now().toString();
      const nonce = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

      const response = await fetch('/api/ai-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-timestamp': timestamp, 'x-nonce': nonce },
        body: JSON.stringify({
          ...signaturePayload,
          // signature removed; server computes HMAC
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Failed to generate report: ${errorText}`);
      }

      const reportData: ReportData = await response.json();

      if (!reportData || typeof reportData !== 'object') {
        throw new Error('Invalid report format');
      }

      setState(prev => ({
        ...prev,
        currentScreen: 'REPORT',
        currentScreenIndex: SCREEN_SEQUENCE.length - 1,
        progress: 100,
        reportData,
        isReport: true,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate report',
      }));
    }
  }, [journeyTracker, state.customScenario, state.industry]);

  const handleConfirm = useCallback(async () => {
    // Validate input
    if (state.isTextInput) {
      if (state.textValue.trim().length < 5) {
        setState(prev => ({ ...prev, error: 'Please enter at least 5 characters' }));
        return;
      }
      
      // Save text input to journey
      journeyTracker.addResponse(state.currentScreen, 0, state.textValue.trim(), state.textValue.trim());
      
      // Store custom scenario if this is PRELIM_2
      if (state.currentScreen === 'PRELIM_2' && state.industry === 'Custom Use Case') {
        setState(prev => ({ ...prev, customScenario: state.textValue.trim() }));
      }
    } else if (state.isMultiSelect) {
      if (state.multiSelections.length === 0) {
        setState(prev => ({ ...prev, error: 'Please select at least one option' }));
        return;
      }
      
      // Save multi-selections
      const selectedTexts = state.multiSelections.map(val => state.currentOptions[val - 1]).join(', ');
      journeyTracker.addResponse(state.currentScreen, state.multiSelections[0], selectedTexts);
    } else {
      if (state.tempSelection === null) {
        setState(prev => ({ ...prev, error: 'Please select an option' }));
        return;
      }
      
      const selectedText = state.currentOptions[state.tempSelection - 1];
      journeyTracker.addResponse(state.currentScreen, state.tempSelection, selectedText);
      
      // Store industry if this is PRELIM_1
      if (state.currentScreen === 'PRELIM_1') {
        setState(prev => ({ ...prev, industry: selectedText }));
      }
    }

    // Move to next screen
    const nextIndex = state.currentScreenIndex + 1;
    
    if (nextIndex >= SCREEN_SEQUENCE.length - 1) {
      // Generate report
      await generateReport();
    } else {
      const nextScreen = SCREEN_SEQUENCE[nextIndex];
      setState(prev => ({
        ...prev,
        currentScreen: nextScreen,
        currentScreenIndex: nextIndex,
        progress: (nextIndex / (SCREEN_SEQUENCE.length - 1)) * 100,
        tempSelection: null,
        multiSelections: [],
        textValue: '',
        error: null,
      }));
    }
  }, [state, journeyTracker]);



  const handleBack = useCallback(() => {
    if (state.currentScreenIndex > 0) {
      const prevIndex = state.currentScreenIndex - 1;
      const prevScreen = SCREEN_SEQUENCE[prevIndex];
      
      setState(prev => ({
        ...prev,
        currentScreen: prevScreen,
        currentScreenIndex: prevIndex,
        progress: (prevIndex / (SCREEN_SEQUENCE.length - 1)) * 100,
        tempSelection: null,
        multiSelections: [],
        textValue: '',
        error: null,
        isReport: false,
        hoveredOption: null,
      }));
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
      progress: 0,
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

  return {
    state,
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
