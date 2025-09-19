'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { submitSelection, ActionResult } from '@/app/actions';
import type { DiagnosePlantOutput } from '@/ai/flows/green-eggs-flow';

const initialScreenFlow = [
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
];

const domains = ['SNEETCH', 'THNEED', 'ZAX', 'YOP', 'GLUNK'];

function BadgeOK() {
  return (
    <div className="px-2 py-1 rounded-full text-xs tracking-widest border border-emerald-300/30 bg-emerald-900/30 text-emerald-300">
      BIM BAM
    </div>
  );
}

export default function MinimalPage() {
  const [screenFlow, setScreenFlow] = useState(initialScreenFlow);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [selections, setSelections] = useState<(number | null)[]>(new Array(initialScreenFlow.length).fill(null));
  const [tempSelection, setTempSelection] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentScreen = screenFlow[currentScreenIndex];
  
  const ticker = useMemo(
    () => [
      "ZIZZ ZAZZ",
      "WHO HOO",
      "FLEEP FLOOP",
      "BAR BALLOO",
      "YOPPITY YOP",
      "GLUNK GO",
    ],
    []
  );

  useEffect(() => {
    // This effect runs when `isLoading` changes.
    // When an API call completes (isLoading becomes false), we check if the current screen is a loading screen.
    // If it is, we automatically advance to the next screen.
    if (!isLoading && screenFlow[currentScreenIndex].type === 'LOADING') {
      setCurrentScreenIndex((prevIndex) => prevIndex + 1);
    }
  }, [isLoading, screenFlow, currentScreenIndex]);

  const handleConfirm = async () => {
    if (tempSelection === null && currentScreen.type === 'QUESTION') return;

    const newSelections = [...selections];
    newSelections[currentScreenIndex] = tempSelection;
    setSelections(newSelections);
    
    setError(null);

    if (currentScreen.apiCall) {
      setIsLoading(true);
      setCurrentScreenIndex(currentScreenIndex + 1); // Move to loading screen immediately

      const result = await submitSelection(tempSelection!, `Screen: ${currentScreen.id}`);

      if (result?.success) {
        const newFlow = [...screenFlow];
        if (result.data.questions) {
          result.data.questions.forEach((q, i) => {
            const screenIndex = newFlow.findIndex((s) => s.id === `Q${i + 1}`);
            if (screenIndex !== -1) {
              newFlow[screenIndex].content = q;
            }
          });
        }

        const reportScreenIndex = newFlow.findIndex((s) => s.id === 'REPORT');
        if (currentScreen.id === 'Q5' && reportScreenIndex !== -1) {
          newFlow[reportScreenIndex].content = result.data.response;
        }

        setScreenFlow(newFlow);
      } else {
        setError(result?.error || 'An unexpected error occurred.');
        setCurrentScreenIndex(currentScreenIndex); // Go back to the question screen on error
      }

      setIsLoading(false);
      setTempSelection(null);
      return;
    }
    
    setTempSelection(null);

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

  const handleReset = () => {
    setScreenFlow(initialScreenFlow);
    setCurrentScreenIndex(0);
    setSelections(new Array(initialScreenFlow.length).fill(null));
    setTempSelection(null);
    setError(null);
    setIsLoading(false);
  };
  
  const getScreenContent = () => {
    if (currentScreen.type === 'LOADING') {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-emerald-400" />
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow">
            {currentScreen.content}
          </h2>
        </div>
      );
    }

    if (error) {
       return (
        <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-red-400 drop-shadow">ERROR</h2>
            <p className="mt-4 text-sm tracking-[0.35em] text-white">{error}</p>
        </div>
       )
    }
    
    if (currentScreen.type === 'REPORT') {
        return (
             <div className="text-center h-full flex flex-col justify-center">
                <h2 className="text-2xl font-extrabold tracking-widest text-yellow-300 drop-shadow">REPORT</h2>
                <p className="mt-2 text-sm tracking-[0.2em] text-emerald-300">Report Generated. Press Green Button to copy.</p>
                <div className="mt-4 text-left text-sm bg-black/20 p-4 rounded-lg overflow-y-auto max-h-80">
                    <pre className="whitespace-pre-wrap font-sans">{currentScreen.content}</pre>
                </div>
            </div>
        )
    }

    return (
        <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow">{currentScreen.content}</h2>
            <p className="mt-4 text-sm tracking-[0.35em] text-emerald-300">GREEN MEANS GO GO</p>
        </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0f12] text-slate-100 flex flex-col font-sans">
      {/* 1. Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_18px_2px_rgba(250,204,21,0.8)]" />
          <h1 className="text-lg tracking-[0.25em] font-semibold">ZIZZLE ZAZZLE CONSOLE</h1>
        </div>
        <div className="flex items-center gap-2">
          <BadgeOK />
          <span className="text-xs text-white/60">SN: ZAZ-0042</span>
        </div>
      </header>

      {/* 2. Ticker */}
      <div className="relative overflow-hidden border-b border-white/10 bg-black/40">
        <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400/70 animate-pulse-slow" />
        <div className="absolute inset-y-0 left-0 w-px bg-white/15" />
        <div className="absolute inset-y-0 right-0 w-px bg-white/15" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0a0f12] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0f12] to-transparent" />

        <div className="relative py-2">
          <div className="flex w-max will-change-transform animate-marquee">
            <div className="flex whitespace-nowrap">
              {ticker.map((t, i) => (
                <span key={"a-" + i} className="mx-8 text-white/80">{t}</span>
              ))}
            </div>
            <div className="flex whitespace-nowrap" aria-hidden="true">
              {ticker.map((t, i) => (
                <span key={"b-" + i} className="mx-8 text-white/80">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Body */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6">
        {/* Machine display area */}
        <section className="col-span-9 rounded-2xl bg-[#0b1114] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-scanlines" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />
          <div className="relative h-full grid place-items-center p-10">
            {getScreenContent()}
          </div>
        </section>

        {/* Sidebar with selections and R/G */}
        <aside className="col-span-3 flex flex-col">
          <div className="flex-1 space-y-[0.9rem]">
             {domains.map((d, i) => (
              <button
                key={d}
                onClick={() => setTempSelection(i + 1)}
                disabled={isLoading || currentScreen.type === 'REPORT'}
                className={`w-full rounded-2xl py-[1.2rem] px-5 grid place-items-center border transition shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/60 disabled:opacity-50 disabled:cursor-not-allowed ${
                  tempSelection === i + 1
                    ? "bg-slate-800/90 border-emerald-400/30 ring-2 ring-emerald-400/70"
                    : "bg-slate-800/60 border-white/10 hover:bg-slate-800/80 hover:border-white/20"
                }`}
              >
                <span
                  className={`uppercase text-xs tracking-widest ${
                    tempSelection === i + 1 ? "text-emerald-300" : "text-yellow-300"
                  }`}
                  style={{
                    textShadow:
                      tempSelection === i + 1
                        ? "0 0 10px rgba(16,185,129,0.9), 0 0 18px rgba(16,185,129,0.5)"
                        : "0 0 8px rgba(253,224,71,0.8), 0 0 14px rgba(253,224,71,0.4)",
                  }}
                >
                  {d}
                </span>
              </button>
            ))}
          </div>

          {/* Bottom-right button cluster */}
          <div className="mt-4 grid grid-cols-3 gap-3 items-end">
            <button
              aria-label="Reset"
              className="rounded-full aspect-square bg-gray-600/50 shadow-[0_0_20px_rgba(200,200,200,0.4)] border border-gray-400/30 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400/70 hover:bg-gray-600/80"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RefreshCcw className="h-1/2 w-1/2 text-gray-300" />
            </button>
            <button
              aria-label="Back/Abort"
              className="rounded-full aspect-square bg-red-600/80 shadow-[0_0_30px_rgba(220,38,38,0.7)] border border-red-300/20 focus:outline-none focus:ring-2 focus:ring-red-400/70"
              onClick={handleBack}
              disabled={isLoading}
            />
            <button
              aria-label="Confirm"
              disabled={isLoading || (currentScreen.type === 'QUESTION' && tempSelection === null)}
              className={`rounded-full aspect-square border focus:outline-none focus:ring-2 focus:ring-emerald-400/70 transition ${
                (tempSelection !== null || currentScreen.type === 'REPORT') && !isLoading
                  ? "bg-emerald-500 shadow-[0_0_34px_rgba(16,185,129,0.8)] border-emerald-200/40"
                  : "bg-emerald-900/30 border-white/10 opacity-50 cursor-not-allowed"
              }`}
              onClick={handleConfirm}
            />
          </div>
        </aside>
      </main>

      {/* 4. Footer */}
      <footer className="px-6 py-3 text-[11px] text-white/40 border-t border-white/10">
        <div className="flex items-center gap-4">
          <span>© Zizzle Zazzle</span>
          <span>Whiffling • Waffling • Wonk</span>
        </div>
      </footer>
    </div>
  );
}
