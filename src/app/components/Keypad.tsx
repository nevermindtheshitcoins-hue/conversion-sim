import React from 'react';
import type {Screen} from '@/app/hooks/useConsole';

interface KeypadProps {
  domains: string[];
  tempSelection: number | null;
  currentScreen: Screen;
  isLoading: boolean;
  onSelection: (selection: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export function Keypad({
  domains,
  tempSelection,
  currentScreen,
  isLoading,
  onSelection,
  onConfirm,
  onBack,
}: KeypadProps) {
  return (
    <aside className="col-span-3 flex flex-col">
      <div className="flex-1 space-y-[0.9rem]">
        {domains.map((d, i) => (
          <button
            key={d}
            onClick={() => onSelection(i + 1)}
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
          onClick={onBack}
        />
        <button
          aria-label="Confirm"
          disabled={(currentScreen.type === 'QUESTION' && tempSelection === null) || isLoading}
          className={`rounded-full aspect-square border focus:outline-none focus:ring-2 focus:ring-emerald-400/70 transition active:translate-y-px ${
            (currentScreen.type !== 'QUESTION' || tempSelection !== null) && !isLoading
              ? 'bg-emerald-500 shadow-[0_0_34px_rgba(16,185,129,0.8)] border-emerald-200/40'
              : 'bg-emerald-900/30 border-white/10 opacity-50 cursor-not-allowed'
          }`}
          onClick={onConfirm}
        />
      </div>
    </aside>
  );
}
