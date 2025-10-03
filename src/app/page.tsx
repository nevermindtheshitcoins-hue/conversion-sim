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

const AI_SCALE_OPTIONS = [
  'Yes, this is a major challenge',
  'Somewhat challenging',
  'Minor issue',
  'Not applicable to us',
  'We have this handled',
  'Need more information',
  'Prefer not to answer',
];

export default function ConversionTool() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [journeyTracker] = useState(() => new JourneyTracker());
  const [tempSelection, setTempSelection] = useState<number | null>(null);
  const [multiSelections, setMultiSelections] = useState<number[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [industry, setIndustry] = useState<string>('');
  const [aiQuestions, setAiQuestions] = useState<Array<{ text: string; options: string[] }>>([]);
  
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentScreen = SCREEN_ORDER[currentScreenIndex];
  const progress = Math.round(((currentScreenIndex + 1) / SCREEN_ORDER.length) * 100);

  function getInteractionMode(screen: string | undefined, industry: string) {
    try {
      if (!screen) return { isTextInput: false, isMultiSelect: false };
      const config = getScreenConfig(screen, industry);
      const isTextInput = !!config.textInput;
      const multiSelectKeywords = ['challenges', 'priorities', 'factors', 'areas', 'issues'];
      const hasMultiKeyword = multiSelectKeywords.some(k => config.title.toLowerCase().includes(k));
      const isMultiSelect = !!config.multiSelect || (!isTextInput && hasMultiKeyword && (config.options?.length ?? 0) > 3);
      return { isTextInput, isMultiSelect };
    } catch {
      return { isTextInput: false, isMultiSelect: false };
    }
  }

  const { isTextInput, isMultiSelect } = React.useMemo(
    () => getInteractionMode(currentScreen, industry),
    [currentScreen, industry]
  );

  const options = React.useMemo(() => {
    if (!currentScreen) return ['Loading...'];

    // Industry picker
    if (currentScreen === 'PRELIM_1') return INDUSTRIES.slice(0, 7);

    // AI questions Q4+
    if (currentScreen.startsWith('Q')) {
      const qNum = parseInt(currentScreen.substring(1), 10) - 4; // Q4 = index 0
      const q = aiQuestions[qNum];
      if (q) {
        const opts = Array.isArray(q.options) && q.options.length > 0 ? q.options : AI_SCALE_OPTIONS;
        return opts.slice(0, 7);
      }
      // If AI failed to populate, prefer explicit message-less options to avoid nonsense
      return AI_SCALE_OPTIONS.slice(0, 7);
    }

    // Config-driven screens
    try {
      const config = getScreenConfig(currentScreen, industry);
      return (config.options || []).slice(0, 7);
    } catch {
      return AI_SCALE_OPTIONS.slice(0, 7);
    }
  }, [currentScreen, industry, aiQuestions]);

  const getScreenContent = () => {
    if (!currentScreen) return 'LOADING...';
    if (currentScreen === 'PRELIM_1') return 'SELECT INDUSTRY';
    if (currentScreen === 'REPORT') return 'YOUR ASSESSMENT';
    if (currentScreen.startsWith('Q')) {
      const questionIndex = parseInt(currentScreen.substring(1), 10) - 4;
      const q = aiQuestions[questionIndex];
      return q?.text || 'Preparing tailored question…';
    }
    try {
      const config = getScreenConfig(currentScreen, industry);
      return config.title.toUpperCase();
    } catch {
      return 'ASSESSMENT QUESTION';
    }
  };



  const processAIGeneration = async (screen: string, context: UserJourney, industry: string) => {
    try {
      if (screen === 'PRELIM_3') {
        const result = await generateQuestionsFromPrelims(context, industry);
        if (result?.questions && Array.isArray(result.questions)) {
          const normalized = result.questions.map((q: any) => {
            if (typeof q === 'string') {
              return { text: q, options: AI_SCALE_OPTIONS.slice(0, 7) };
            }
            const text = typeof q?.text === 'string' && q.text.trim() ? q.text : 'Question';
            const options = Array.isArray(q?.options) && q.options.length > 0 ? q.options : AI_SCALE_OPTIONS;
            return { text, options: options.slice(0, 7) };
          });
          setAiQuestions(normalized);
        } else {
          throw new Error('Invalid questions format received');
        }
      }

      if (screen === 'Q7') {
        const result = await generateCustomReport(context, industry);
        if (result?.response) {
          const enriched: ReportData = {
            ...result,
            response: `DEPLOYMENT ANALYSIS:\n\n${result.response}`,
            reportFactors: (result.reportFactors ?? []).slice(0, 4).map((f: any) => ({
              factor: f?.factor || 'Unspecified Factor',
              analysis: f?.analysis || 'No analysis provided',
              recommendation: f?.recommendation || 'Consider revisiting this area',
            })),
          } as ReportData;
          setReportData(enriched);
        } else {
          throw new Error('Invalid report format received');
        }
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      throw error;
    }
  };



  const handleConfirm = async () => {
    if (!currentScreen) return;

    if (isTextInput) {
      if (textInput.trim().length < 5 || textInput.trim().length > 100) {
        setError('Please enter 5-100 characters describing your scenario');
        return;
      }
      journeyTracker.addResponse(currentScreen, 1, textInput.trim());
      setTextInput('');
    } else {
      const hasSelection = isMultiSelect ? multiSelections.length > 0 : tempSelection !== null;
      if (!hasSelection) {
        setError(isMultiSelect ? 'Please select at least one option' : 'Please select an option');
        return;
      }
      if (isMultiSelect) {
        const selectedTexts = multiSelections.map(sel => options[sel - 1]).join(', ');
        journeyTracker.addResponse(currentScreen, multiSelections[0], selectedTexts);
        setMultiSelections([]);
      } else if (tempSelection !== null) {
        const buttonText = options[tempSelection - 1];
        if (currentScreen === 'PRELIM_1') setIndustry(buttonText);
        journeyTracker.addResponse(currentScreen, tempSelection, buttonText);
      }
    }

    setTempSelection(null);
    setError(null);
    setIsLoading(true);

    try {
      await processAIGeneration(currentScreen, journeyTracker.getFullContext(currentScreen), industry);
      setTimeout(() => { setCurrentScreenIndex(p => p + 1); setIsLoading(false); }, 1500);
    } catch (err) {
      console.error('Processing error:', err);
      setError('Processing error occurred');
      setTimeout(() => { setCurrentScreenIndex(p => p + 1); setIsLoading(false); }, 1000);
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
      setMultiSelections(prev => {
        return prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value];
      });
      setTempSelection(null);
    } else {
      setTempSelection(value);
      setMultiSelections([]);
    }
    setError(null);
  };

  const handleCopyReport = React.useCallback(() => {
    if (reportData?.response) {
      const factorsText = reportData.reportFactors?.map(f => `${f.factor}: ${f.analysis} → ${f.recommendation}`).join('\n\n') || '';
      const reportText = `BUSINESS DEPLOYMENT REPORT\n\n${reportData.response}\n\n${factorsText}`;
      copyToClipboard(reportText);
    }
  }, [reportData]);

  const canConfirm = React.useMemo(() => {
    if (currentScreenIndex >= SCREEN_ORDER.length || !currentScreen) return true;
    if (isTextInput) return textInput.trim().length >= 5 && textInput.trim().length <= 100;
    if (isMultiSelect) return multiSelections.length > 0;
    return tempSelection !== null;
  }, [currentScreenIndex, currentScreen, isTextInput, textInput, isMultiSelect, multiSelections, tempSelection]);



  const showTextPreview = React.useMemo(() => {
    try {
      const config = getScreenConfig(currentScreen, industry);
      return Boolean(config.textInput) && textInput.length > 0;
    } catch {
      return false;
    }
  }, [currentScreen, industry, textInput.length]);

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
          showTextPreview={showTextPreview}
          textPreview={textInput}
        />
        <Buttons
          isTextInput={isTextInput}
          isMultiSelect={isMultiSelect}
          textValue={textInput}
          onTextChange={setTextInput}
          options={options}
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