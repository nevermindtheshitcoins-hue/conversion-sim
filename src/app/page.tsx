'use client';

import React, { useState, useEffect } from 'react';
import { generateCustomReport, generateQuestionsFromPrelims } from '../ai/flows/full-context-flow';
import { JourneyTracker, UserJourney } from '../lib/journey-tracker';
import { getScreenConfig } from '../lib/screen-config-new';
import { copyToClipboard, isInIframe, validateParentOrigin } from '../lib/iframe-utils';
import { QuestionsAndAnswers } from '../components/QuestionsAndAnswers';
import { Buttons } from '../components/Buttons';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ReportData } from '../types/report';
import { validateTextInput, validateSelection } from '../utils/validation';

const INDUSTRIES = [
  "Elections & Gov",
  "Healthcare & Trials", 
  "Supply Chain",
  "Corporate Decisions",
  "Education",
  "Surveys & Polling",
  "CUSTOM",
];

const SCREEN_ORDER = ['PRELIM_1', 'PRELIM_2', 'PRELIM_3', 'Q4', 'Q5', 'Q6', 'Q7', 'REPORT'];

export default function ConversionTool() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [journeyTracker] = useState(() => new JourneyTracker());
  const [tempSelection, setTempSelection] = useState<number | null>(null);
  const [multiSelections, setMultiSelections] = useState<number[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [industry, setIndustry] = useState<string>('');
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentScreen = SCREEN_ORDER[currentScreenIndex];
  const progress = Math.round(((currentScreenIndex + 1) / SCREEN_ORDER.length) * 100);

  const getScreenContent = () => {
    if (!currentScreen) return 'LOADING...';
    if (currentScreen === 'PRELIM_1') return 'SELECT INDUSTRY';
    if (currentScreen === 'REPORT') return 'YOUR ASSESSMENT';
    if (currentScreen.startsWith('Q') && aiQuestions.length > 0) {
      const questionIndex = parseInt(currentScreen.substring(1), 10) - 4;
      return aiQuestions[questionIndex] || 'AI GENERATED QUESTION';
    }
    try {
      const config = getScreenConfig(currentScreen, industry);
      return config.title.toUpperCase();
    } catch {
      return 'ASSESSMENT QUESTION';
    }
  };

  const getOptions = () => {
    if (!currentScreen) return ['Loading...'];
    
    if (currentScreen === 'PRELIM_1') {
      return INDUSTRIES;
    }
    
    if (currentScreen.startsWith('Q') && aiQuestions.length > 0) {
      const questionIndex = parseInt(currentScreen.substring(1), 10) - 4;
      if (questionIndex >= 0 && questionIndex < aiQuestions.length) {
        // Return actual multiple choice options instead of agreement scale
        return [
          'Yes, this is a major challenge',
          'Somewhat challenging',
          'Minor issue',
          'Not applicable to us',
          'We have this handled',
          'Need more information',
          'Prefer not to answer'
        ];
      }
    }
    
    try {
      const config = getScreenConfig(currentScreen, industry);
      const options = config.options.slice(0, 7);
      while (options.length < 7) {
        options.push(`Option ${options.length + 1}`);
      }
      return options;
    } catch {
      return [
        'Option 1',
        'Option 2', 
        'Option 3',
        'Option 4',
        'Option 5',
        'Option 6',
        'Option 7',
      ];
    }
  };

  const getMultiSelectConfig = () => {
    try {
      const config = getScreenConfig(currentScreen, industry);
      const multiSelectKeywords = ['challenges', 'priorities', 'factors', 'areas', 'issues'];
      const hasMultiKeyword = multiSelectKeywords.some(keyword => 
        config.title.toLowerCase().includes(keyword)
      );
      return {
        isMultiSelect: Boolean(config.multiSelect) || (hasMultiKeyword && config.options.length > 3),
        maxSelections: config.maxSelections || 3,
        isTextInput: Boolean(config.textInput)
      };
    } catch {
      return { isMultiSelect: false, maxSelections: 3, isTextInput: false };
    }
  };

  const processAIGeneration = async (screen: string, context: UserJourney, industry: string) => {
    try {
      if (screen === 'PRELIM_3') {
        const result = await generateQuestionsFromPrelims(context, industry);
        if (result?.questions && Array.isArray(result.questions)) {
          setAiQuestions(result.questions);
        } else {
          throw new Error('Invalid questions format received');
        }
      }

      if (screen === 'Q7') {
        const result = await generateCustomReport(context, industry);
        if (result?.response) {
          setReportData(result);
        } else {
          throw new Error('Invalid report format received');
        }
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      throw error;
    }
  };

  const processUserInput = () => {
    const { isMultiSelect, maxSelections, isTextInput } = getMultiSelectConfig();
    
    if (isTextInput) {
      const validation = validateTextInput(textInput);
      if (!validation.isValid) {
        setError(validation.error!);
        return false;
      }
      journeyTracker.addResponse(currentScreen, 1, textInput.trim());
      setTextInput('');
    } else {
      const validation = validateSelection(tempSelection, multiSelections, isMultiSelect, maxSelections);
      if (!validation.isValid) {
        setError(validation.error!);
        return false;
      }
      
      const options = getOptions();
      if (isMultiSelect) {
        const selectedTexts = multiSelections.map(sel => options[sel - 1]).join(', ');
        journeyTracker.addResponse(currentScreen, multiSelections[0], selectedTexts);
        setMultiSelections([]);
      } else {
        const buttonText = options[tempSelection! - 1];
        if (currentScreen === 'PRELIM_1') {
          setIndustry(buttonText);
        }
        journeyTracker.addResponse(currentScreen, tempSelection!, buttonText);
      }
    }
    return true;
  };

  const handleConfirm = async () => {
    if (!currentScreen) {
      setError('Invalid screen state');
      return;
    }
    
    if (!processUserInput()) return;
    
    setTempSelection(null);
    setError(null);
    setIsLoading(true);

    try {
      await processAIGeneration(currentScreen, journeyTracker.getFullContext(currentScreen), industry);
      setTimeout(() => {
        setCurrentScreenIndex(prev => prev + 1);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Processing error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentScreenIndex(0);
    journeyTracker.clear();
    setTempSelection(null);
    setMultiSelections([]);
    setTextInput('');
    setIndustry('');
    setAiQuestions([]);
    setReportData(null);
    setError(null);
  };

  const handleBack = () => {
    if (tempSelection !== null || multiSelections.length > 0 || textInput.trim()) {
      setTempSelection(null);
      setMultiSelections([]);
      setTextInput('');
      return;
    }
    setCurrentScreenIndex(prev => Math.max(0, prev - 1));
  };

  const handleSelect = (value: number, isMulti: boolean) => {
    if (isMulti) {
      setMultiSelections(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else {
      setTempSelection(value);
    }
  };

  const handleCopyReport = () => {
    if (reportData && reportData.response) {
      const reportText = `BUSINESS DEPLOYMENT REPORT\n\n${reportData.response}\n\n${reportData.reportFactors?.map(f => `${f.factor}: ${f.analysis} → ${f.recommendation}`).join('\n\n') || ''}`;
      copyToClipboard(reportText);
    }
  };

  const getCanConfirm = () => {
    if (currentScreenIndex >= SCREEN_ORDER.length) return true;
    if (!currentScreen) return false;
    
    const { isMultiSelect, isTextInput } = getMultiSelectConfig();
    
    if (isTextInput) {
      return validateTextInput(textInput).isValid;
    }
    
    return validateSelection(tempSelection, multiSelections, isMultiSelect).isValid;
  };
  
  const canConfirm = getCanConfirm();

  const getIsTextInput = () => {
    return getMultiSelectConfig().isTextInput;
  };

  const getShowTextPreview = () => {
    try {
      const config = getScreenConfig(currentScreen, industry);
      return Boolean(config.textInput) && textInput.length > 0;
    } catch {
      return false;
    }
  };

  // Validate iframe origin on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && isInIframe() && !validateParentOrigin()) {
      console.error('Unauthorized iframe embedding');
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className={`min-h-screen w-full bg-[#0a0f12] text-slate-100 flex flex-col font-sans ${typeof window !== 'undefined' && isInIframe() ? 'iframe-embedded' : ''}`}>
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/30">
          <div
            className="h-full bg-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_18px_2px_rgba(250,204,21,0.8)]" />
          <h1 className="text-lg tracking-[0.25em] font-semibold">Business Proof</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-full text-xs tracking-widest border border-emerald-300/30 bg-emerald-900/30 text-emerald-300">
            STEP {currentScreenIndex + 1}
          </div>
        </div>
      </header>
      
      <main className="flex-1 grid grid-cols-12 gap-6 p-6">
        <QuestionsAndAnswers
          progress={progress}
          title={getScreenContent()}
          industry={industry}
          isLoading={isLoading}
          reportData={currentScreenIndex >= SCREEN_ORDER.length ? reportData : null}
          showTextPreview={getShowTextPreview()}
          textPreview={textInput}
        />
        <Buttons
          isTextInput={getIsTextInput()}
          textValue={textInput}
          onTextChange={setTextInput}
          options={getOptions()}
          tempSelection={tempSelection}
          multiSelections={multiSelections}
          onSelect={handleSelect}
          onConfirm={handleConfirm}
          onBack={handleBack}
          onReset={handleReset}
          canConfirm={canConfirm}
          error={error}
          isReport={currentScreenIndex >= SCREEN_ORDER.length}
          onCopyReport={handleCopyReport}
          isFirstScreen={currentScreenIndex === 0}
        />
      </main>
      
      <footer className="px-6 py-3 text-[11px] text-white/40 border-t border-white/10">
        <div className="flex items-center gap-4">
          <span>© Business Assessment Tool</span>
          <span>AI-driven • Industry-specific • Auditable reports</span>
        </div>
      </footer>
      </div>
    </ErrorBoundary>
  );
}