'use client';

import React from 'react';
import {StaticInterface} from '@/app/components/StaticInterface';
import {Console} from '@/app/components/Console';
import {Keypad} from '@/app/components/Keypad';
import {useConsole} from '@/app/hooks/useConsole';

export default function ConsolePage() {
  const {
    currentScreen,
    domains,
    tempSelection,
    isLoading,
    error,
    handleSelection,
    handleConfirm,
    handleBack,
  } = useConsole();

  return (
    <div className="min-h-screen w-full bg-[#0a0f12] text-slate-100 flex flex-col font-sans">
      <StaticInterface />
      <main className="flex-1 grid grid-cols-12 gap-6 p-6">
        <Console currentScreen={currentScreen} isLoading={isLoading} error={error} />
        <Keypad
          domains={domains}
          tempSelection={tempSelection}
          currentScreen={currentScreen}
          isLoading={isLoading}
          onSelection={handleSelection}
          onConfirm={handleConfirm}
          onBack={handleBack}
        />
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
