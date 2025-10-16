import type { ReactNode } from 'react';
import CRTShell from './CRTShell';

export type AppContainerProps = {
  headerZone: ReactNode;
  screenZone: ReactNode;
  keypadZone: ReactNode;
  footerZone: ReactNode;
  disableMotion?: boolean;
  scanlines?: boolean;
  vignette?: boolean;
  questionsAnswered?: number;
};

export function AppContainer({
  headerZone,
  screenZone,
  keypadZone,
  footerZone,
  disableMotion = false,
  scanlines = true,
  vignette = true,
  questionsAnswered = 0,
}: AppContainerProps) {
  return (
    <div className="app-container min-h-dvh bg-gradient-to-b from-[#090d12] via-[#070b0f] to-[#05070a] text-zinc-100">
      <div className="app-container__inner mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-1 p-1 md:p-2">
        <section
          className="app-container__display flex-1 rounded-[2.25rem] border border-emerald-500/15 bg-black/70 p-1 md:p-2"
          role="region"
          aria-label="Pilot scenario simulator"
        >
          <CRTShell
            headerZone={headerZone}
            screenZone={screenZone}
            keypadZone={keypadZone}
            footerZone={footerZone}
            disableMotion={disableMotion}
            scanlines={scanlines}
            vignette={vignette}
            questionsAnswered={questionsAnswered}
          />
        </section>

      </div>
    </div>
  );
}
