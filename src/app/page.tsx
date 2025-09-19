'use client';

import React, {useState, useEffect} from 'react';
import {Loader2} from 'lucide-react';
import {submitSelection} from '@/app/actions';

const Pill = ({id, label, onClick, active = false}) => (
  <button
    id={id}
    onClick={onClick}
    className={`relative w-full select-none overflow-hidden rounded-full px-5 py-3 text-sm tracking-widest ${'cursor-pointer text-zinc-900 hover:brightness-110 active:translate-y-[1px]'}`}
    style={{
      background: active
        ? 'radial-gradient(120% 120% at 10% 10%, #fff, #9be7ff 35%, #58c5ff 60%, #007bff 100%)'
        : 'radial-gradient(120% 120% at 10% 10%, #ffffff, #d6d6d6 35%, #9aa1a9 36%, #616770 60%, #2d3137 100%)',
      boxShadow:
        'inset 0 1px 0 rgba(255,255,255,.6), inset 0 -3px 6px rgba(0,0,0,.45), 0 6px 18px rgba(0,0,0,.55)',
    }}
  >
    <span
      className={`block w-full rounded-full border border-white/10 px-6 py-[10px] text-center font-semibold bg-white/80`}
      style={{
        background:
          'radial-gradient(120% 120% at -10% -10%, #ffffff 0%, #f6f6f6 30%, #dfe6ea 60%, #b5c6d2 100%), linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.2))',
        WebkitMask: 'radial-gradient(80% 100% at 50% -40%, rgba(0,0,0,.6), transparent 60%)',
        color: '#0a0a0a',
        textShadow: '0 1px 0 #fff',
      }}
    >
      <span
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background: active ? 'radial-gradient(60% 120% at 50% 10%, #9be7ff, transparent 70%)' : 'none',
          filter: 'blur(10px)',
          opacity: 0.8,
        }}
      />
      {label}
    </span>
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-full"
      style={{
        background:
          'radial-gradient(90% 90% at 20% 10%, rgba(255,255,255,.75), transparent 40%), radial-gradient(50% 80% at 70% 120%, rgba(0,0,0,.2), transparent 60%)',
        mixBlendMode: 'overlay',
      }}
    />
  </button>
);

const RoundButton = ({tone = 'green', onClick, disabled = false}) => {
  const colors = {
    green: {base: '#1fd270', dark: '#0f8c49', glow: '#36ff98'},
    red: {base: '#ff4b4b', dark: '#a61b1b', glow: '#ff7777'},
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative grid h-20 w-20 place-items-center rounded-full text-white shadow-[inset_0_-8px_12px_rgba(0,0,0,.45),_0_12px_24px_rgba(0,0,0,.6)] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50`}
      style={{
        background: `radial-gradient(100% 100% at 30% 30%, ${colors[tone].base}, ${colors[tone].dark})`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-full"
        style={{
          background:
            'radial-gradient(100% 100% at 30% 30%, #e6eaee, #b3bcc6 40%, #6b7580 60%, #2c3238 100%)',
          zIndex: -1,
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,.7), inset 0 -6px 10px rgba(0,0,0,.5), 0 2px 8px rgba(0,0,0,.6)',
        }}
      />
      <span
        aria-hidden
        className="absolute -inset-1 rounded-full blur-md"
        style={{background: `radial-gradient(60% 60% at 50% 50%, ${colors[tone].glow}, transparent)`}}
      />
    </button>
  );
};

const TitleBar = () => (
  <div className="rounded-xl border border-zinc-700 bg-[radial-gradient(140%_180%_at_30%_-40%,#b8bec6,#6f7984_45%,#2b3239_70%,#171a1e)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.35),inset_0_-8px_16px_rgba(0,0,0,.35)]">
    <div className="flex items-center justify-center gap-3">
      <div
        className="text-lg font-extrabold"
        style={{
          color: '#dfe6ee',
          textShadow:
            '0 1px 0 rgba(255,255,255,.7), 0 -1px 0 rgba(0,0,0,.35), 0 2px 2px rgba(0,0,0,.35), inset 0 -1px 0 rgba(0,0,0,.5)',
          letterSpacing: '.18em',
        }}
      >
        DeVOTE
      </div>
    </div>
  </div>
);

const initialScreenFlow = [
  {id: 'INIT', content: 'Select Domain', type: 'QUESTION'},
  {id: 'PRELIM_A', content: 'Select Use Case', type: 'QUESTION'},
  {id: 'PRELIM_B', content: 'Select Pain Points', type: 'QUESTION', apiCall: true},
  {id: 'LOADING_QUESTIONS', content: 'Generating Questions...', type: 'LOADING'},
  {id: 'Q1', content: 'Question 1', type: 'QUESTION'},
  {id: 'Q2', content: 'Question 2', type: 'QUESTION'},
  {id: 'Q3', content: 'Question 3', type: 'QUESTION'},
  {id: 'Q4', content: 'Question 4', type: 'QUESTION'},
  {id: 'Q5', content: 'Question 5', type: 'QUESTION', apiCall: true},
  {id: 'LOADING_REPORT', content: 'Generating Report...', type: 'LOADING'},
  {id: 'REPORT', content: '', type: 'REPORT'},
];

export default function MinimalPage() {
  const [screenFlow, setScreenFlow] = useState(initialScreenFlow);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [selections, setSelections] = useState<(number | null)[]>(new Array(screenFlow.length).fill(null));
  const [tempSelection, setTempSelection] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentScreen = screenFlow[currentScreenIndex];
  const wasLoading = React.useRef<boolean>(false);

  useEffect(() => {
    if (wasLoading.current && !isLoading) {
      if (currentScreen.type === 'LOADING') {
        setCurrentScreenIndex(prevIndex => prevIndex + 1);
      }
    }
    wasLoading.current = isLoading;
  }, [isLoading, currentScreen.type]);

  
  const handleConfirm = async () => {
    if (tempSelection === null && currentScreen.type === 'QUESTION') return;
  
    const newSelections = [...selections];
    newSelections[currentScreenIndex] = tempSelection;
    setSelections(newSelections);
    setTempSelection(null);
    setError(null);
  
    if (currentScreen.apiCall) {
      setIsLoading(true);
      setCurrentScreenIndex(currentScreenIndex + 1); 
  
      const result = await submitSelection(
        tempSelection!,
        `Screen: ${currentScreen.id}`
      );
      
      if (result?.success) {
        const newFlow = [...screenFlow];
        if (result.data.questions) {
          result.data.questions.forEach((q, i) => {
            const screenIndex = newFlow.findIndex(s => s.id === `Q${i + 1}`);
            if (screenIndex !== -1) {
              newFlow[screenIndex].content = q;
            }
          });
        }
        
        const reportScreenIndex = newFlow.findIndex(s => s.id === 'REPORT');
        if(currentScreen.id === 'Q5' && reportScreenIndex !== -1) {
          newFlow[reportScreenIndex].content = result.data.response;
        }

        setScreenFlow(newFlow);
      } else {
        setError(result?.error || 'An unexpected error occurred.');
        setCurrentScreenIndex(currentScreenIndex); 
      }

      setIsLoading(false);
      return;
    }
  
    if (currentScreen.type === 'REPORT') {
      const reportContent = currentScreen.content;
      navigator.clipboard.writeText(reportContent);
      alert('Report copied to clipboard!');
      return;
    }
  
    if (currentScreenIndex < screenFlow.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (tempSelection !== null) {
      setTempSelection(null);
      return;
    }
    if (currentScreenIndex > 0) {
      const newSelections = [...selections];
      newSelections[currentScreenIndex] = null;
      setSelections(newSelections);

      let backScreenIndex = currentScreenIndex - 1;
      if (screenFlow[backScreenIndex]?.type === 'LOADING') {
        backScreenIndex = currentScreenIndex - 2;
      }
      setCurrentScreenIndex(Math.max(0, backScreenIndex));
    }
  };

  const pills = [1, 2, 3, 4, 5];

  const getScreenContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-16 w-16 animate-spin text-emerald-400" />
          <p className="text-lg font-medium text-emerald-300">{currentScreen.content}</p>
        </div>
      );
    }
    
    if (error) {
      return <p className="text-red-400">{error}</p>;
    }
    
    return (
      <p className="whitespace-pre-wrap text-lg font-medium text-emerald-300">
        {currentScreen.content}
      </p>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-700 bg-[radial-gradient(150%_120%_at_30%_10%,#3b434b,#181b1f)] p-4 shadow-[inset_0_0_20px_rgba(0,0,0,.7),_0_40px_120px_rgba(0,0,0,.8)]">
        <TitleBar />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4">
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black p-10 shadow-[inset_0_0_50px_rgba(0,255,150,.07),_0_0_30px_rgba(0,255,150,.06)]">
            <div
              className="pointer-events-none absolute inset-0 rounded-xl opacity-35"
              style={{
                background:
                  'repeating-linear-gradient(180deg, rgba(255,255,255,.03) 0 2px, transparent 2px 4px)',
              }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_120px_rgba(0,0,0,.9)]" />

            <div className="z-10 h-full w-full text-center text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,.6)]">
              {getScreenContent()}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              {pills.map(p => (
                <Pill
                  key={p}
                  id={`pill-button-${p}`}
                  label={`BUTTON ${p}`}
                  onClick={() => setTempSelection(p)}
                  active={tempSelection === p}
                />
              ))}
            </div>
            <div className="flex items-center justify-around">
              <RoundButton tone="red" onClick={handleBack} />
              <RoundButton
                tone="green"
                onClick={handleConfirm}
                disabled={(currentScreen.type === 'QUESTION' && tempSelection === null) || isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
