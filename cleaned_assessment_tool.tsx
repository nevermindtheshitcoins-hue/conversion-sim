'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { submitSelection } from '@/app/actions';

const DOMAINS = ['SNEETCH', 'THNEED', 'ZAX', 'YOP', 'GLUNK'] as const;
const TICKER_ITEMS = ['ZIZZ ZAZZ', 'WHO HOO', 'FLEEP FLOOP', 'BAR BALLOO', 'YOPPITY YOP', 'GLUNK GO'] as const;

type ScreenType = 'QUESTION' | 'LOADING' | 'REPORT';

interface QuestionOption {
  label: string;
  value: string;
}

interface Screen {
  id: string;
  content: string;
  type: ScreenType;
  apiCall?: boolean;
  options?: QuestionOption[];
  multiSelect?: boolean;
  maxSelections?: number;
}

type FlowState = 'initial' | 'collecting' | 'generating' | 'complete' | 'error';

const INITIAL_SCREENS: Screen[] = [
  { id: 'INIT', content: 'Select Domain', type: 'QUESTION', options: DOMAINS.map(d => ({ label: d, value: d })) },
  { id: 'PRELIM_A', content: 'Select Use Case', type: 'QUESTION', options: DOMAINS.map(d => ({ label: d, value: d })) },
  { id: 'PRELIM_B', content: 'Select Pain Points', type: 'QUESTION', apiCall: true, options: DOMAINS.map(d => ({ label: d, value: d })) },
  { id: 'LOADING_QUESTIONS', content: 'Generating Questions...', type: 'LOADING' },
  { id: 'Q1', content: 'Question 1', type: 'QUESTION', options: [] },
  { id: 'Q2', content: 'Question 2', type: 'QUESTION', options: [] },
  { id: 'Q3', content: 'Question 3', type: 'QUESTION', options: [], multiSelect: true, maxSelections: 3 },
  { id: 'Q4', content: 'Question 4', type: 'QUESTION', options: [] },
  { id: 'Q5', content: 'Question 5', type: 'QUESTION', apiCall: true, options: [] },
  { id: 'LOADING_REPORT', content: 'Generating Report...', type: 'LOADING' },
  { id: 'REPORT', content: '', type: 'REPORT' },
];

const useScreenFlow = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flowState, setFlowState] = useState<FlowState>('initial');
  const [dynamicScreens, setDynamicScreens] = useState<Screen[]>(INITIAL_SCREENS);

  const currentScreen = dynamicScreens[currentIndex];
  const progress = Math.round((currentIndex / (dynamicScreens.length - 1)) * 100);

  const updateScreenContent = useCallback((screenId: string, content: string, options?: QuestionOption[], multiSelect?: boolean, maxSelections?: number) => {
    setDynamicScreens(prev =>
      prev.map(screen => 
        screen.id === screenId 
          ? { 
              ...screen, 
              content, 
              ...(options && { options }),
              ...(multiSelect !== undefined && { multiSelect }),
              ...(maxSelections !== undefined && { maxSelections })
            } 
          : screen
      )
    );
  }, []);

  const updateQuestionsFromAPI = useCallback((questions: Array<{ question: string; options: QuestionOption[]; multiSelect?: boolean; maxSelections?: number }>) => {
    questions.forEach((q, index) => {
      updateScreenContent(`Q${index + 1}`, q.question, q.options, q.multiSelect, q.maxSelections);
    });
  }, [updateScreenContent]);

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
    setDynamicScreens(INITIAL_SCREENS);
  }, []);

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
  const [selections, setSelections] = useState<(number | number[] | null)[]>([]);
  const [tempSelection, setTempSelection] = useState<number | number[] | null>(null);

  const recordSelection = useCallback((index: number, selection: number | number[]) => {
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
  }, []);

  return {
    selections,
    tempSelection,
    setTempSelection,
    recordSelection,
    clearSelection,
    resetSelections,
  };
};

const LoadingDisplay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center gap-4 text-center animate-fade-in">
    <Loader2 className="h-12 w-12 md:h-16 md:w-16 animate-spin text-emerald-400" />
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow px-4">
      {message}
    </h2>
  </div>
);

const ErrorDisplay = ({ error }: { error: string }) => (
  <div className="text-center animate-fade-in px-4">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-widest text-red-400 drop-shadow">
      ERROR
    </h2>
    <p className="mt-4 text-xs md:text-sm tracking-[0.35em] text-white">{error}</p>
  </div>
);

const ReportDisplay = ({ content }: { content: string }) => (
  <div className="text-center h-full flex flex-col justify-center animate-fade-in px-4">
    <h2 className="text-xl md:text-2xl font-extrabold tracking-widest text-yellow-300 drop-shadow">
      YOUR ASSESSMENT
    </h2>
    <p className="mt-2 text-xs md:text-sm tracking-[0.2em] text-emerald-300">
      Report Generated. Press Green Button to copy and share.
    </p>
    <div className="mt-4 text-left text-xs md:text-sm bg-black/20 p-3 md:p-4 rounded-lg overflow-y-auto max-h-60 md:max-h-80">
      <pre className="whitespace-pre-wrap font-sans">{content}</pre>
    </div>
  </div>
);

const QuestionDisplay = ({ content, multiSelect, maxSelections, selectedCount }: { content: string; multiSelect?: boolean; maxSelections?: number; selectedCount: number }) => (
  <div className="text-center animate-slide-in px-4">
    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow">
      {content}
    </h2>
    <p className="mt-3 md:mt-4 text-xs md:text-sm tracking-[0.25em] md:tracking-[0.35em] text-emerald-300">
      {multiSelect ? `SELECT UP TO ${maxSelections} OPTIONS (${selectedCount}/${maxSelections})` : 'SELECT YOUR OPTION BELOW'}
    </p>
  </div>
);

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="absolute top-0 left-0 right-0 h-1 bg-black/30">
    <div
      className="h-full bg-emerald-400 transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const Ticker = () => (
  <div className="relative overflow-hidden border-b border-white/10 bg-black/40">
    <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400/70 animate-pulse" />
    <div className="pointer-events-none absolute inset-y-0 left-0 w-6 md:w-10 bg-gradient-to-r from-[#0a0f12] to-transparent z-10" />
    <div className="pointer-events-none absolute inset-y-0 right-0 w-6 md:w-10 bg-gradient-to-l from-[#0a0f12] to-transparent z-10" />
    <div className="relative py-1.5 md:py-2">
      <div className="flex w-max animate-[marquee_20s_linear_infinite]">
        {[...Array(2)].map((_, groupIndex) => (
          <div key={groupIndex} className="flex whitespace-nowrap">
            {TICKER_ITEMS.map((item, i) => (
              <span key={`${groupIndex}-${i}`} className="mx-4 md:mx-8 text-xs md:text-sm text-white/80">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SelectionButtons = ({
  options,
  tempSelection,
  onSelect,
  disabled,
  multiSelect,
  maxSelections,
}: {
  options: QuestionOption[];
  tempSelection: number | number[] | null;
  onSelect: (index: number) => void;
  disabled: boolean;
  multiSelect?: boolean;
  maxSelections?: number;
}) => {
  const isSelected = (index: number) => {
    if (Array.isArray(tempSelection)) {
      return tempSelection.includes(index);
    }
    return tempSelection === index;
  };

  return (
    <div className="flex-1 space-y-3 md:space-y-4">
      {options.map((option, index) => {
        const selected = isSelected(index + 1);
        const selectionCount = Array.isArray(tempSelection) ? tempSelection.length : (tempSelection ? 1 : 0);
        const isMaxed = Boolean(multiSelect && maxSelections && selectionCount >= maxSelections && !selected);
        
        return (
          <button
            key={`${option.value}-${index}`}
            onClick={() => onSelect(index + 1)}
            disabled={disabled || isMaxed}
            className={`w-full rounded-xl md:rounded-2xl py-4 md:py-6 px-4 md:px-5 grid place-items-center border transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/60 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] ${
              selected
                ? 'bg-slate-800/90 border-emerald-400/30 ring-2 ring-emerald-400/70 shadow-inner'
                : 'bg-slate-800/60 border-white/10 hover:bg-slate-800/80 hover:border-white/20'
            }`}
          >
            <span
              className={`uppercase text-[10px] md:text-xs tracking-widest ${
                selected ? 'text-emerald-300' : 'text-yellow-300'
              }`}
              style={{
                textShadow:
                  selected
                    ? '0 0 10px rgba(16,185,129,0.9), 0 0 18px rgba(16,185,129,0.5)'
                    : '0 0 8px rgba(253,224,71,0.8), 0 0 14px rgba(253,224,71,0.4)',
              }}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const ControlButtons = ({
  onReset,
  onBack,
  onConfirm,
  canConfirm,
  isLoading,
}: {
  onReset: () => void;
  onBack: () => void;
  onConfirm: () => void;
  canConfirm: boolean;
  isLoading: boolean;
}) => (
  <div className="mt-3 md:mt-4 grid grid-cols-3 gap-2 md:gap-3 items-end">
    <div className="flex items-center justify-center">
      <button
        aria-label="Reset Assessment"
        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-800/50 shadow-[0_0_10px_rgba(250,204,21,0.4)] border border-yellow-400/30 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-400/70 hover:bg-yellow-800/80 active:translate-y-px transition-all disabled:opacity-50"
        onClick={onReset}
        disabled={isLoading}
      >
        <RefreshCcw className="h-4 w-4 md:h-5 md:w-5 text-yellow-300" />
      </button>
    </div>
    <button
      aria-label="Go Back"
      className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-600/80 shadow-[0_0_30px_rgba(220,38,38,0.7)] border border-red-300/20 focus:outline-none focus:ring-2 focus:ring-red-400/70 active:translate-y-px transition-all disabled:opacity-50 mx-auto"
      onClick={onBack}
      disabled={isLoading}
    />
    <button
      aria-label="Continue"
      disabled={!canConfirm || isLoading}
      className={`w-12 h-12 md:w-16 md:h-16 rounded-full border focus:outline-none focus:ring-2 focus:ring-emerald-400/70 transition-all active:translate-y-px mx-auto ${
        canConfirm && !isLoading
          ? 'bg-emerald-500 shadow-[0_0_34px_rgba(16,185,129,0.8)] border-emerald-200/40 cursor-pointer'
          : 'bg-emerald-900/30 border-white/10 opacity-50 cursor-not-allowed'
      }`}
      onClick={onConfirm}
    />
  </div>
);

const useConversionLogic = () => {
  const screenFlow = useScreenFlow();
  const selectionState = useSelectionState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentScreen, currentIndex, progress, flowState, setFlowState } = screenFlow;
  const { tempSelection, setTempSelection, recordSelection, clearSelection, resetSelections } = selectionState;

  useEffect(() => {
    if (!isLoading && currentScreen.type === 'LOADING') {
      const timer = setTimeout(() => screenFlow.goToNext(), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, currentScreen.type, screenFlow]);

  useEffect(() => {
    setTempSelection(null);
  }, [currentScreen.id, setTempSelection]);

  const handleSelection = (index: number) => {
    if (currentScreen.multiSelect) {
      const currentSelections = Array.isArray(tempSelection) ? tempSelection : [];
      const maxSelections = currentScreen.maxSelections || 5;
      
      if (currentSelections.includes(index)) {
        setTempSelection(currentSelections.filter(i => i !== index));
      } else if (currentSelections.length < maxSelections) {
        setTempSelection([...currentSelections, index]);
      }
    } else {
      setTempSelection(index);
    }
  };

  const handleConfirm = async () => {
    if (!currentScreen) return;

    if (currentScreen.type === 'REPORT') {
      try {
        await navigator.clipboard.writeText(currentScreen.content);
        window.parent?.postMessage({ type: 'CONVERSION_COMPLETE', data: currentScreen.content }, '*');
        setFlowState('complete');
      } catch {
        console.warn('Clipboard access denied');
      }
      return;
    }

    if (currentScreen.type === 'QUESTION' && tempSelection === null) return;
    if (currentScreen.multiSelect && Array.isArray(tempSelection) && tempSelection.length === 0) return;

    if (tempSelection !== null) {
      recordSelection(currentIndex, tempSelection);
    }

    setError(null);

    if (currentScreen.apiCall && tempSelection !== null) {
      setIsLoading(true);
      setFlowState('generating');
      screenFlow.goToNext();

      try {
        const selectionValue = Array.isArray(tempSelection) ? tempSelection[0] : tempSelection;
        const result = await submitSelection(selectionValue, `Screen: ${currentScreen.id}`);
        
        if (result?.success) {
          if (currentScreen.id === 'PRELIM_B' && result.data.questions) {
            const questions = result.data.questions.map((q: any) => ({
              question: q.question || q.text || '',
              options: q.options?.map((opt: any) => ({
                label: opt.label || opt.text || opt,
                value: opt.value || opt
              })) || [],
              multiSelect: q.multiSelect || false,
              maxSelections: q.maxSelections || 1
            }));
            screenFlow.updateQuestionsFromAPI(questions);
            setFlowState('collecting');
          }
          
          if (currentScreen.id === 'Q5' && result.data.response) {
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
    setFlowState(currentIndex <= 1 ? 'initial' : 'collecting');
  };

  const handleReset = () => {
    screenFlow.reset();
    resetSelections();
    setError(null);
    setIsLoading(false);
    setFlowState('initial');
    window.parent?.postMessage({ type: 'ASSESSMENT_RESET' }, '*');
  };

  const isValidSelection = () => {
    if (currentScreen.type === 'REPORT') return true;
    if (currentScreen.type !== 'QUESTION') return false;
    
    if (currentScreen.multiSelect) {
      return Array.isArray(tempSelection) && tempSelection.length > 0;
    }
    return tempSelection !== null;
  };

  return {
    currentScreen,
    currentIndex,
    progress,
    tempSelection,
    isLoading,
    error,
    canConfirm: isValidSelection(),
    handleSelection,
    handleConfirm,
    handleBack,
    handleReset,
  };
};

const ContentRenderer = ({ currentScreen, tempSelection, error }: { currentScreen: Screen; tempSelection: number | number[] | null; error: string | null }) => {
  if (currentScreen.type === 'LOADING') {
    return <LoadingDisplay message={currentScreen.content} />;
  }
  if (error) {
    return <ErrorDisplay error={error} />;
  }
  if (currentScreen.type === 'REPORT') {
    return <ReportDisplay content={currentScreen.content} />;
  }
  const selectedCount = Array.isArray(tempSelection) ? tempSelection.length : (tempSelection ? 1 : 0);
  return <QuestionDisplay content={currentScreen.content} multiSelect={currentScreen.multiSelect} maxSelections={currentScreen.maxSelections} selectedCount={selectedCount} />;
};

export default function ConversionTool() {
  const {
    currentScreen,
    currentIndex,
    progress,
    tempSelection,
    isLoading,
    error,
    canConfirm,
    handleSelection,
    handleConfirm,
    handleBack,
    handleReset,
  } = useConversionLogic();

  const currentOptions = currentScreen.options || [];

  return (
    <div className="min-h-screen w-full bg-[#0a0f12] text-slate-100 flex flex-col font-sans">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }
      `}</style>
      
      <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent relative">
        <ProgressBar progress={progress} />
        <div className="flex items-center gap-2 md:gap-3">
          <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-yellow-400 shadow-[0_0_18px_2px_rgba(250,204,21,0.8)]" />
          <h1 className="text-sm md:text-lg tracking-[0.2em] md:tracking-[0.25em] font-semibold">ASSESSMENT TOOL</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-full text-[10px] md:text-xs tracking-widest border border-emerald-300/30 bg-emerald-900/30 text-emerald-300">
            STEP {currentIndex + 1}
          </div>
        </div>
      </header>

      <Ticker />

      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-6 p-4 md:p-6">
        <section className="lg:col-span-9 rounded-xl md:rounded-2xl bg-[#0b1114] border border-white/10 shadow-2xl relative overflow-hidden min-h-[300px] md:min-h-0">
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.35) 2px, rgba(255,255,255,0.35) 3px)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />
          <div className="relative h-full grid place-items-center p-6 md:p-10">
            <ContentRenderer currentScreen={currentScreen} tempSelection={tempSelection} error={error} />
          </div>
        </section>

        <aside className="lg:col-span-3 flex flex-col">
          <SelectionButtons
            options={currentOptions}
            tempSelection={tempSelection}
            onSelect={handleSelection}
            disabled={isLoading || currentScreen.type !== 'QUESTION'}
            multiSelect={currentScreen.multiSelect}
            maxSelections={currentScreen.maxSelections}
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

      <footer className="px-4 md:px-6 py-2 md:py-3 text-[10px] md:text-[11px] text-white/40 border-t border-white/10">
        <div className="flex items-center gap-3 md:gap-4">
          <span>© DeVOTE Control Systems</span>
          <span className="hidden sm:inline">Conversion • Assessment • Analysis</span>
        </div>
      </footer>
    </div>
  );
}