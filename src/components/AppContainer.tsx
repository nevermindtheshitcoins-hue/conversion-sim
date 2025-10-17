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
  completionCount?: number;
};

export function AppContainer({
  headerZone,
  screenZone,
  keypadZone,
  footerZone,
  disableMotion = false,
  scanlines = true,
  vignette = true,
  completionCount = 0,
}: AppContainerProps) {
  return (
    <div className="app-container min-h-dvh bg-industrial-dark text-text-primary">
      <div className="app-container__inner mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-1 p-1 md:p-2">
        <section
          className="app-container__display flex-1 rounded-lg border-2 border-industrial-steel bg-industrial-charcoal p-1 md:p-2"
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
            completionCount={completionCount}
          />
        </section>

      </div>
    </div>
  );
}
