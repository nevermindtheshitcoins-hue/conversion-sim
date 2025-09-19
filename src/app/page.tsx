'use client';

import React, {useState, useMemo} from 'react';
import {Loader2} from 'lucide-react';
import {submitSelection} from '@/app/actions';
import type {ActionResult} from '@/app/actions';
import type {GreenEggsFlowOutput} from '@/ai/flows/green-eggs-flow';

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

const domains = ['Sneetch', 'Thneed', 'Zax', 'Yop', 'Glunk'];

const BadgeOK = () => (
  <div className="px-2 py-1 rounded-full text-xs tracking-widest border border-emerald-300/30 bg-emerald-900/30 text-emerald-300">
    BIM BAM
  </div>
);

export default function ConsolePage() {
  const [screenFlow, setScreenFlow] = useState(initialScreenFlow);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [selections, setSelections] = useState<(number | null)[]>(new Array(screenFlow.length).fill(null));
  const [tempSelection, setTempSelection] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentScreen = screenFlow[currentScreenIndex];

  const ticker = useMemo(
    () => ['ZIZZ ZAZZ', 'WHO HOO', 'FLEEP FLOOP', 'BAR BALLOO', 'YOPPITY YOP', 'GLUNK GO'],
    []
  );

  const handleConfirm = async () => {
    if (tempSelection === null && currentScreen.type === 'QUESTION') return;

    const newSelections = [...selections];
    newSelections[currentScreenIndex] = tempSelection;
    setSelections(newSelections);
    setTempSelection(null);
    setError(null);

    if (currentScreen.apiCall) {
      setIsLoading(true);
      const nextScreenIndex = currentScreenIndex + 1;
      if (nextScreenIndex < screenFlow.length) {
        setCurrentScreenIndex(nextScreenIndex);
      }

      const result: ActionResult<GreenEggsFlowOutput> = await submitSelection(
        tempSelection!,
        `Screen: ${currentScreen.id}`
      );

      setIsLoading(false);

      if (result?.success) {
        const newFlow = [...screenFlow];
        if (result.data.questions && currentScreen.id === 'PRELIM_B') {
          result.data.questions.forEach((q, i) => {
            const screenIndex = newFlow.findIndex(s => s.id === `Q${i + 1}`);
            if (screenIndex !== -1) {
              newFlow[screenIndex].content = q;
            }
          });
        }

        const reportScreenIndex = newFlow.findIndex(s => s.id === 'REPORT');
        if (currentScreen.id === 'Q5' && reportScreenIndex !== -1) {
          newFlow[reportScreenIndex].content = result.data.response;
        }

        setScreenFlow(newFlow);

        const nextContentScreenIndex = currentScreenIndex + 2;
        if (nextContentScreenIndex < newFlow.length) {
          setCurrentScreenIndex(nextContentScreenIndex);
        }
      } else {
        setError(result?.error || 'An unexpected error occurred.');
        setCurrentScreenIndex(currentScreenIndex);
      }
      return;
    }

    if (currentScreen.type === 'REPORT') {
      navigator.clipboard.writeText(currentScreen.content);
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
        backScreenIndex = Math.max(0, currentScreenIndex - 2);
      }
      setCurrentScreenIndex(backScreenIndex);
    }
  };

  const getScreenContent = () => {
    if (isLoading || currentScreen.type === 'LOADING') {
      return (
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow">
            <Loader2 className="inline-block h-12 w-12 animate-spin" />
          </h2>
          <p className="mt-4 text-sm tracking-[0.35em] text-emerald-300">{currentScreen.content}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-red-400 drop-shadow">
            ERROR
          </h2>
          <p className="mt-4 text-sm tracking-widest text-red-300 whitespace-pre-wrap">{error}</p>
        </div>
      );
    }

    const title =
      currentScreen.type === 'REPORT' ? 'FINAL REPORT' : currentScreen.id.replace('_', ' ');
    const content =
      currentScreen.type === 'REPORT' ? currentScreen.content : currentScreen.content;

    return (
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow">
          {title}
        </h2>
        <p className="mt-4 text-sm tracking-[0.35em] text-emerald-300 whitespace-pre-wrap">
          {content}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0f12] text-slate-100 flex flex-col font-sans">
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

      <div className="relative overflow-hidden border-b border-white/10 bg-black/40">
        <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400/70 animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute inset-y-0 left-0 w-px bg-white/15" />
        <div className="absolute inset-y-0 right-0 w-px bg-white/15" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0a0f12] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0f12] to-transparent" />

        <div className="relative py-2">
          <div className="flex w-max will-change-transform animate-[marquee_24s_linear_infinite]">
            <div className="flex whitespace-nowrap">
              {ticker.map((t, i) => (
                <span key={'a-' + i} className="mx-8 text-white/80">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex whitespace-nowrap" aria-hidden="true">
              {ticker.map((t, i) => (
                <span key={'b-' + i} className="mx-8 text-white/80">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

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
          <div className="relative h-full grid place-items-center p-10">{getScreenContent()}</div>
        </section>

        <aside className="col-span-3 flex flex-col">
          <div className="flex-1 space-y-[0.9rem]">
            {domains.map((d, i) => (
              <button
                key={d}
                onClick={() => setTempSelection(i + 1)}
                className={`w-full rounded-2xl py-[1.2rem] px-5 grid place-items-center border transition shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
                  tempSelection === i + 1
                    ? 'bg-slate-800/90 border-emerald-400/30 ring-2 ring-emerald-400/70'
                    : 'bg-slate-800/60 border-white/10 hover:bg-slate-800/80 hover:border-white/20'
                }`}
              >
                <span
                  className={`uppercase text-xs tracking-widest ${
                    tempSelection === i + 1 ? 'text-emerald-300' : 'text-yellow-300'
                  }`}
                  style={{
                    textShadow:
                      tempSelection === i + 1
                        ? '0 0 10px rgba(16,185,129,0.9), 0 0 18px rgba(16,185,129,0.5)'
                        : '0 0 8px rgba(253,224,71,0.8), 0 0 14px rgba(253,224,71,0.4)',
                  }}
                >
                  {d}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 items-end">
            <button
              aria-label="Abort"
              className="rounded-full aspect-square bg-red-600/80 shadow-[0_0_30px_rgba(220,38,38,0.7)] border border-red-300/20 focus:outline-none focus:ring-2 focus:ring-red-400/70 active:translate-y-px"
              onClick={handleBack}
            />
            <button
              aria-label="Confirm"
              disabled={(currentScreen.type === 'QUESTION' && tempSelection === null) || isLoading}
              className={`rounded-full aspect-square border focus:outline-none focus:ring-2 focus:ring-emerald-400/70 transition active:translate-y-px ${
                (currentScreen.type !== 'QUESTION' || tempSelection !== null) && !isLoading
                  ? 'bg-emerald-500 shadow-[0_0_34px_rgba(16,185,129,0.8)] border-emerald-200/40'
                  : 'bg-emerald-900/30 border-white/10 opacity-50 cursor-not-allowed'
              }`}
              onClick={handleConfirm}
            />
          </div>
        </aside>
      </main>

      <footer className="px-6 py-3 text-[11px] text-white/40 border-t border-white/10">
        <div className="flex items-center gap-4">
          <span>© Zizzle Zazzle</span>
          <span>Whiffling • Waffling • Wonk</span>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse { 0%, 100% { opacity: 0.85; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
