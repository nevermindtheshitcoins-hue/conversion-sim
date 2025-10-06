import React from 'react';

interface AppContainerProps {
  children: React.ReactNode;
}

export function AppContainer({ children }: AppContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090d12] via-[#070b0f] to-[#05070a] text-zinc-100">
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
