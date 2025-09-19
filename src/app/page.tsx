'use client';

import React, {useState} from 'react';
import {Loader2} from 'lucide-react';
import {submitSelection} from '@/app/actions';
import type {ActionResult} from '@/app/actions';
import type {GreenEggsFlowOutput} from '@/ai/flows/green-eggs-flow';

/* ----------------- Small atoms ----------------- */
const Pill = ({label, onClick, active = false}) => (
  <button
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

const RoundButton = ({tone = 'green', onClick, disabled = false, children}) => {
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
      {children}
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

/* ----------------- Engraved placard title bar ----------------- */
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

/* ----------------- Main component ----------------- */
export default function MinimalPage() {
  const [screen, setScreen] = useState(1);
  const [selection, setSelection] = useState<number | null>(null);
  const [response, setResponse] = useState<ActionResult<GreenEggsFlowOutput>>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (selection === null) return;

    if (screen === 1) {
      setScreen(2);
      setSelection(null);
      setResponse(null);
    } else if (screen === 2) {
      setIsLoading(true);
      setResponse(null);
      const question = 'I do not like green eggs and ham, said who ?';
      const result = await submitSelection(selection, question);
      setResponse(result);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelection(null);
    setResponse(null);
    if (screen === 2) {
      setScreen(1);
    }
  };

  const pills = [1, 2, 3, 4, 5];

  const getScreenContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-emerald-400" />
        </div>
      );
    }
    if (response?.success) {
      return <p className="whitespace-pre-wrap text-lg font-medium">{response.data.response}</p>;
    }
    if (response?.error) {
      return <p className="text-red-400">{response.error}</p>;
    }
    if (screen === 1) {
      return <p className="text-zinc-500">Awaiting selection...</p>;
    }
    if (screen === 2) {
      return <p className="text-lg font-medium text-emerald-300">I do not like green eggs and ham, said who ?</p>;
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-700 bg-[radial-gradient(150%_120%_at_30%_10%,#3b434b,#181b1f)] p-4 shadow-[inset_0_0_20px_rgba(0,0,0,.7),_0_40px_120px_rgba(0,0,0,.8)]">
        <TitleBar />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4">
          {/* Screen */}
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

          {/* Right column: pills + big buttons */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              {pills.map(p => (
                <Pill key={p} label={`BUTTON ${p}`} onClick={() => setSelection(p)} active={selection === p} />
              ))}
            </div>
            <div className="flex items-center justify-around">
              <RoundButton tone="red" onClick={handleBack} />
              <RoundButton tone="green" onClick={handleConfirm} disabled={selection === null || isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
