'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { submitSelection } from '@/app/actions';

const DOMAINS = ['SNEETCH', 'THNEED', 'ZAX', 'YOP', 'GLUNK'] as const;
const TICKER_ITEMS = [
  'ZIZZ ZAZZ',
  'WHO HOO',
  'FLEEP FLOOP',
  'BAR BALLOO',
  'YOPPITY YOP',
  'GLUNK GO',
] as const;

type ScreenType = 'QUESTION' | 'LOADING' | 'REPORT';

interface Screen {
  id: string;
  content: string;
  type: ScreenType;
  apiCall?: boolean;
}

type FlowState = 'initial' | 'collecting' | 'generating' | 'complete' | 'error';

const useScreenFlow = () => {
  const [screens] = useState<Screen[]>([
    { id: 'INIT', content: 'Select Domain', type: 'QUESTION' },
    { id: 'PRELIM_A', content: 'Select Use Case', type: 'QUESTION' },
    { id: 'PRELIM_B', content: 'Select Pain Points', type: 'QUESTION', apiCall: true },
    { id: 'LOADING_QUESTIONS', content: 'Generating Questions...', type: 'LOADING' },
    { id: 'Q1', content: 'Question 1', type: 'QUESTION' },
    { id: 'Q2', content: 'Question 2', type: 'QUESTION' },
    { id: 'Q3', content: 'Question 3', type: 'QUESTION' },
    { id: 'Q4', content: 'Question 4', type: 'QUESTION' },
    { id: 'Q5', content: 'Question 5', type: 'QUESTION', apiCall: true },
    { id: 'LOADING_REPORT', content: 'Generating Report...', type: 'LOADING' },
    { id: 'REPORT', content: '', type: 'REPORT' },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flowState, setFlowState] = useState<FlowState>('initial');
  const [dynamicScreens, setDynamicScreens] = useState<Screen[]>(screens);

  const currentScreen = dynamicScreens[currentIndex];
  const progress = Math.round((currentIndex / (dynamicScreens.length - 1)) * 100);

  const updateScreenContent = useCallback((screenId: string, content: string) => {
    setDynamicScreens(prev =>
      prev.map(screen =>
        screen.id === screenId ? { ...screen, content } : screen
      )
    );
  }, []);

  const updateQuestionsFromAPI = useCallback(
    (questions: string[]) => {
      questions.forEach((question, index) => {
        updateScreenContent(`Q${index + 1}`, question);
      });
    },
    [updateScreenContent]
  );

  const goToNext = useCallback(() => {
    if (currentIndex < dynamicScreens.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, dynamicScreens.length]);

  const goToPrevious = useCallback(() => {
    let prevIndex = currentIndex - 1;
    if (dynamicScreens[prevIndex]?.type === 'LOADING') {
      prevIndex = Math.max(0, prevIndex - 1);
    }
    setCurrentIndex(Math.max(0, prevIndex));
  }, [currentIndex, dynamicScreens]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setFlowState('initial');
    setDynamicScreens(screens);
  }, [screens]);

  return {
    currentScreen,
    currentIndex,
    progress,
    flowState,
    setFlowState,
    updateScreenContent,
    updateQuestionsFromAPI,
    goToNext,
    goToPrevious,
    reset,
  };
};

const useSelectionState = () => {
  const [selections, setSelections] = useState<(number | null)[]>([]);
  const [tempSelection, setTempSelection] = useState<number | null>(null);
  const [multiSelections, setMultiSelections] = useState<number[]>([]);

  const toggleMultiSelection = useCallback((selection: number) => {
    setMultiSelections(prev => {
      if (prev.includes(selection)) {
        return prev.filter(s => s !== selection);
      } else if (prev.length < 5) { // Max 5 selections
        return [...prev, selection];
      }
      return prev;
    });
  }, []);

  const clearMultiSelections = useCallback(() => {
    setMultiSelections([]);
  }, []);

  const recordSelection = useCallback((index: number, selection: number) => {
    setSelections(prev => {
      const newSelections = [...prev];
      newSelections[index] = selection;
      return newSelections;
    });
  }, []);

  const clearSelection = useCallback((index: number) => {
    setSelections(prev => {
      const newSelections = [...prev];
      newSelections[index] = null;
      return newSelections;
    });
  }, []);

  const resetSelections = useCallback(() => {
    setSelections([]);
    setTempSelection(null);
    setMultiSelections([]); // Add this line
  }, []);

  const useSelectionState = () => {
  const [selections, setSelections] = useState<(number | null)[]>([]);
  const [tempSelection, setTempSelection] = useState<number | null>(null);
  const [multiSelections, setMultiSelections] = useState<number[]>([]);

  // Add these new functions
  const toggleMultiSelection = useCallback((selection: number) => {
    setMultiSelections(prev => {
      if (prev.includes(selection)) {
        return prev.filter(s => s !== selection);
      } else if (prev.length < 5) { // Max 5 selections
        return [...prev, selection];
      }
      return prev;
    });
  }, []);

  const clearMultiSelections = useCallback(() => {
    setMultiSelections([]);
  }, []);

  const resetSelections = useCallback(() => {
    setSelections([]);
    setTempSelection(null);
    setMultiSelections([]); 
  }, []);

  return {
    selections,
    tempSelection,
    setTempSelection,
    recordSelection,
    clearSelection,
    resetSelections,
    multiSelections,
    toggleMultiSelection,
    clearMultiSelections,
  };
};

  return {
    selections,
    tempSelection,
    setTempSelection,
    recordSelection,
    clearSelection,
    resetSelections,
  };
};

const LoadingDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-4 text-center">
    <Loader2 className="h-16 w-16 animate-spin text-emerald-400" />
    <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow">
      {message}
    </h2>
  </div>
);

const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => (
  <div className="text-center">
    <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-red-400 drop-shadow">
      ERROR
    </h2>
    <p className="mt-4 text-sm tracking-[0.35em] text-white">{error}</p>
  </div>
);

const ReportDisplay: React.FC<{ content: string }> = ({ content }) => (
  <div className="text-center h-full flex flex-col justify-center">
    <h2 className="text-2xl font-extrabold tracking-widest text-yellow-300 drop-shadow">
      YOUR ASSESSMENT
    </h2>
    <p className="mt-2 text-sm tracking-[0.2em] text-emerald-300">
      Report Generated. Press Green Button to copy.
    </p>
    <div className="mt-4 text-left text-sm bg-black/20 p-4 rounded-lg overflow-y-auto max-h-80">
      <pre className="whitespace-pre-wrap font-sans">{content}</pre>
    </div>
  </div>
);

const QuestionDisplay: React.FC<{ content: string }> = ({ content }) => (
  <div className="text-center">
    <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow">
      {content}
    </h2>
    <p className="mt-4 text-sm tracking-[0.35em] text-emerald-300">
      SELECT YOUR OPTION BELOW
    </p>
  </div>
);

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="absolute top-0 left-0 right-0 h-1 bg-black/30">
    <div
      className="h-full bg-emerald-400 transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const Ticker: React.FC = () => (
  <div className="relative overflow-hidden border-b border-white/10 bg-black/40">
    <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400/70 animate-pulse" />
    <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0a0f12] to-transparent z-10" />
    <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0f12] to-transparent z-10" />
    <div className="relative py-2">
      <div className="flex w-max will-change-transform animate-marquee">
        {[...Array(2)].map((_, groupIndex) => (
          <div
            key={groupIndex}
            className="flex whitespace-nowrap"
            aria-hidden={groupIndex > 0}
          >
            {TICKER_ITEMS.map((item, i) => (
              <span key={`${groupIndex}-${i}`} className="mx-8 text-white/80">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SelectionButtons: React.FC<{
  tempSelection: number | null;
  multiSelections: number[];
  onSelect: (index: number) => void;
  onToggleMulti: (index: number) => void;
  disabled: boolean;
  isMultiSelect: boolean;
}> = ({ tempSelection, multiSelections, onSelect, onToggleMulti, disabled, isMultiSelect }) => (
  <div className="flex-1 space-y-4">
    {DOMAINS.map((domain, index) => {
      const buttonValue = index + 1;
      const isSelected = isMultiSelect 
        ? multiSelections.includes(buttonValue)
        : tempSelection === buttonValue;
      
      return (
        <button
          key={domain}
          onClick={() => isMultiSelect ? onToggleMulti(buttonValue) : onSelect(buttonValue)}
          disabled={disabled}
          aria-pressed={isSelected}
          className={`
            w-full rounded-2xl py-6 px-5 grid place-items-center border transition shadow-lg
            focus:outline-none focus:ring-2 focus:ring-cyan-400/60
            active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed
            ${
              isSelected
                ? 'bg-slate-800/90 border-emerald-400/30 ring-2 ring-emerald-400/70 shadow-inner'
                : 'bg-slate-800/60 border-white/10 hover:bg-slate-800/80 hover:border-white/20'
            }
          `}
        >
          <span
            className={`uppercase text-xs tracking-widest ${
              isSelected ? 'text-emerald-300' : 'text-yellow-300'
            }`}
            style={{
              textShadow:
                isSelected
                  ? '0 0 10px rgba(16,185,129,0.9), 0 0 18px rgba(16,185,129,0.5)'
                  : '0 0 8px rgba(253,224,71,0.8), 0 0 14px rgba(253,224,71,0.4)',
            }}
          >
            {domain}
          </span>
        </button>
      );
    })}
    {isMultiSelect && (
      <p className="text-xs text-center text-white/60 mt-2">
        {multiSelections.length}/5 selected
      </p>
    )}
  </div>
);

const ControlButtons: React.FC<{
  onReset: () => void;
  onBack: () => void;
  onConfirm: () => void;
  canConfirm: boolean;
  isLoading: boolean;
}> = ({ onReset, onBack, onConfirm, canConfirm, isLoading }) => (
  <div className="mt-4 grid grid-cols-3 gap-3 items-end">
    <div className="flex items-center justify-center">
      <button
        aria-label="Reset Assessment"
        title="Start Over"
        className="w-12 h-12 rounded-full bg-yellow-800/50 shadow-[0_0_10px_rgba(250,204,21,0.4)] border border-yellow-400/30 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-400/70 hover:bg-yellow-800/80 active:translate-y-px transition-all"
        onClick={onReset}
        disabled={isLoading}
      >
        <RefreshCcw className="h-5 w-5 text-yellow-300" />
      </button>
    </div>
    <button
      aria-label="Go Back"
      title="Previous Step"
      className="w-16 h-16 rounded-full bg-red-600/80 shadow-[0_0_30px_rgba(220,38,38,0.7)] border border-red-300/20 focus:outline-none focus:ring-2 focus:ring-red-400/70 active:translate-y-px transition-all"
      onClick={onBack}
      disabled={isLoading}
    />
    <button
      aria-label="Continue"
      title={canConfirm ? 'Next Step' : 'Select an option first'}
      disabled={!canConfirm || isLoading}
      className={`
        w-16 h-16 rounded-full border focus:outline-none focus:ring-2 focus:ring-emerald-400/70
        transition-all active:translate-y-px
        ${
          canConfirm && !isLoading
            ? 'bg-emerald-500 shadow-[0_0_34px_rgba(16,185,129,0.8)] border-emerald-200/40 cursor-pointer'
            : 'bg-emerald-900/30 border-white/10 opacity-50 cursor-not-allowed'
        }
      `}
      onClick={onConfirm}
    />
  </div>
);

export default function ConversionTool() {
  const screenFlow = useScreenFlow();
  const selectionState = useSelectionState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentScreen, currentIndex, progress, flowState, setFlowState } = screenFlow;
  const {
    tempSelection,
    setTempSelection,
    recordSelection,
    clearSelection,
    resetSelections,
    multiSelections, 
    toggleMultiSelection, 
    clearMultiSelections, 
  } = selectionState;

  const isMultiSelectScreen = currentScreen.id === 'PRELIM_B';

  useEffect(() => {
    if (!isLoading && currentScreen.type === 'LOADING') {
      const timer = setTimeout(() => screenFlow.goToNext(), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, currentScreen.type, screenFlow]);

  const handleConfirm = async () => {
    if (!currentScreen) return;
    
    if (currentScreen.type === 'REPORT') {
      try {
        await navigator.clipboard.writeText(currentScreen.content);
        alert('Report copied to clipboard!');
      } catch (err) {
        console.warn('Clipboard access denied');
      }
      return;
    }
    
    if (currentScreen.type === 'QUESTION') {
      if (isMultiSelectScreen && multiSelections.length === 0) return;
      if (!isMultiSelectScreen && tempSelection === null) return;
    }
    if (isMultiSelectScreen && multiSelections.length > 0) {
      recordSelection(currentIndex, multiSelections[0]); // Store first selection for compatibility
    } else if (tempSelection !== null) {
      recordSelection(currentIndex, tempSelection);
    }
    
    setError(null);
    
    if (currentScreen.apiCall && tempSelection !== null) {
      setIsLoading(true);
      setFlowState('generating');
      screenFlow.goToNext();
      
      try {
        const result = await submitSelection(tempSelection, `Screen: ${currentScreen.id}`);
        
        if (result?.success) {
          if (result.data.questions) {
            screenFlow.updateQuestionsFromAPI(result.data.questions);
            setFlowState('collecting');
          }
          if (currentScreen.id === 'Q5') {
            screenFlow.updateScreenContent('REPORT', result.data.response);
            setFlowState('complete');
          }
        } else {
          throw new Error(result?.error || 'API call failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setFlowState('error');
        screenFlow.goToPrevious();
      } finally {
        setIsLoading(false);
        setTempSelection(null);
      }
    } else {
      setTempSelection(null);
      screenFlow.goToNext();
      if (currentIndex < 3) setFlowState('collecting');
    }
  };

  const handleBack = () => {
    setError(null);
    if (tempSelection !== null) {
      setTempSelection(null);
      return;
    }
    clearSelection(currentIndex);
    screenFlow.goToPrevious();
    if (currentIndex <= 1) {
      setFlowState('initial');
    } else {
      setFlowState('collecting');
    }
  };

  const handleReset = () => {
    screenFlow.reset();
    resetSelections();
    setError(null);
    setIsLoading(false);
    setFlowState('initial');
  };

  const renderContent = () => {
    if (currentScreen.type === 'LOADING') {
      return <LoadingDisplay message={currentScreen.content} />;
    }
    if (error) {
      return <ErrorDisplay error={error} />;
    }
    if (currentScreen.type === 'REPORT') {
      return <ReportDisplay content={currentScreen.content} />;
    }
    return <QuestionDisplay content={currentScreen.content} />;
  };

  const canConfirm =
    currentScreen.type === 'REPORT' ||
    (currentScreen.type === 'QUESTION' && tempSelection !== null);

  return (
    <div className="min-h-screen w-full bg-[#0a0f12] text-slate-100 flex flex-col font-sans iframe-safe">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent relative">
        <ProgressBar progress={progress} />
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_18px_2px_rgba(250,204,21,0.8)]" />
          <h1 className="text-lg tracking-[0.25em] font-semibold">ASSESSMENT TOOL</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-full text-xs tracking-widest border border-emerald-300/30 bg-emerald-900/30 text-emerald-300">
            STEP {currentIndex + 1}
          </div>
        </div>
      </header>
      
      <Ticker />
      
      <main className="flex-1 grid grid-cols-12 gap-6 p-6">
        <section className="col-span-9 rounded-2xl bg-[#0b1114] border border-white/10 shadow-2xl relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.35) 2px, rgba(255,255,255,0.35) 3px)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />
          <div className="relative h-full grid place-items-center p-10">
            {renderContent()}
          </div>
        </section>
        
        <aside className="col-span-3 flex flex-col">
          <SelectionButtons
            tempSelection={tempSelection}
            onSelect={setTempSelection}
            disabled={isLoading || currentScreen.type !== 'QUESTION'}
          />
          <ControlButtons
            onReset={handleReset}
            onBack={handleBack}
            onConfirm={handleConfirm}
            canConfirm={canConfirm}
            isLoading={isLoading}
          />
        </aside>
      </main>
      
      <footer className="px-6 py-3 text-[11px] text-white/40 border-t border-white/10">
        <div className="flex items-center gap-4">
          <span>© DeVOTE Control Systems</span>
          <span>Conversion • Assessment • Analysis</span>
        </div>
      </footer>
    </div>
  );
}