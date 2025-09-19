import React from 'react';
import {Loader2} from 'lucide-react';
import type {Screen} from '@/app/hooks/useConsole';

interface ConsoleProps {
  currentScreen: Screen;
  isLoading: boolean;
  error: string | null;
}

export function Console({currentScreen, isLoading, error}: ConsoleProps) {
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
  );
}
