import React from 'react';

export type AppContainerProps = {
  screen: React.ReactNode;
};

export function AppContainer({ screen }: AppContainerProps) {
  const header = (
    <h1 className="engraved-title text-xl md:text-4xl">
      DeVOTE PILOT SCENARIO SIMULATOR
    </h1>
  );

  return (
    <div className="arcade-wrapper min-h-dvh bg-gradient-to-b from-[#090d12] via-[#070b0f] to-[#05070a] text-zinc-100">
      <div className="arcade-cabinet mx-auto w-full max-w-4xl p-4 md:p-8 flex flex-col min-h-dvh gap-6">
        <header className="flex items-center justify-center py-4" role="banner">
          {header}
        </header>
        <section className="flex-1 relative rounded-lg bg-black/70" role="region" aria-label="Screen">
          {screen}
        </section>
        <div className="h-12 rounded-b-xl" />
      </div>
    </div>
  );
}
