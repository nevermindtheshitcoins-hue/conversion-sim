import type { ReactNode } from 'react';
import { FilamentTubeClock } from './FilamentTubeClock';

interface CRTShellProps {
  headerZone: ReactNode;
  screenZone: ReactNode;
  keypadZone: ReactNode;
  footerZone: ReactNode;
  disableMotion?: boolean;
  scanlines?: boolean;
  vignette?: boolean;
  currentStep?: number;
  totalSteps?: number;
  status?: 'active' | 'loading' | 'complete';
}

export default function CRTShell({
  headerZone,
  screenZone,
  keypadZone,
  footerZone,
  disableMotion = false,
  scanlines = true,
  vignette = true,
  currentStep,
  totalSteps,
  status,
}: CRTShellProps) {
  // Debug logging to validate CRTShell props
  console.log('CRTShell received props:', {
    currentStep: typeof currentStep,
    totalSteps: typeof totalSteps,
    status: typeof status,
    completionCount: typeof arguments[0]?.completionCount
  });

  const hasHeader = Boolean(headerZone);
  const layoutRowClasses = hasHeader
    ? '[grid-template-rows:auto_minmax(0,3fr)_auto] md:[grid-template-rows:auto_minmax(0,3fr)_auto]'
    : '[grid-template-rows:minmax(0,3fr)_auto] md:[grid-template-rows:minmax(0,3fr)_auto]';
  const screenRowClass = hasHeader ? 'md:row-start-2' : '';
  const keypadRowClass = hasHeader ? 'md:row-start-2' : '';
  const footerRowClass = hasHeader ? 'md:row-start-3' : 'md:row-start-2';

  return (
    <div className="crt-shell relative h-full w-full overflow-hidden rounded-lg border-2 border-industrial-steel bg-industrial-dark shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
      {/* Filament Tube Clock positioned above CRT shell */}
      {currentStep !== undefined && totalSteps !== undefined && (
        <FilamentTubeClock
          currentStep={currentStep}
          totalSteps={totalSteps}
          status={status || 'active'}
        />
      )}
      <div
        className={`crt-shell__layout relative grid h-full w-full grid-cols-1 gap-1 p-1 md:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)] md:gap-1 md:p-2 ${layoutRowClasses}`}
      >
        {hasHeader ? (
          <header className="crt-shell__header col-span-1 rounded-lg border-2 border-industrial-steel bg-booth-panel px-5 py-1 md:col-span-2 md:px-6 md:py-1" style={{width: '100%'}}>
            {headerZone}
          </header>
        ) : null}
        <section
          className={`crt-shell__screen col-span-1 overflow-hidden rounded-lg border-2 border-industrial-steel bg-booth-screen shadow-[0_20px_50px_rgba(0,0,0,0.7)] ${screenRowClass}`}
          aria-label="Simulation content"
        >
          <div className="crt-shell__screen-surface h-full">
            <div className="crt-shell__screen-content h-full p-3 md:p-4">{screenZone}</div>
          </div>
        </section>
        <aside
          className={`crt-shell__keypad col-span-1 flex flex-col gap-4 rounded-lg border-2 border-industrial-steel bg-booth-panel p-2 shadow-[0_20px_50px_rgba(0,0,0,0.7)] ${keypadRowClass}`}
          style={{ minHeight: '420px' }}
        >
          {keypadZone}
        </aside>
        <footer
          className={`crt-shell__footer col-span-1 rounded-lg border-2 border-industrial-steel bg-booth-panel px-2 py-1 md:col-span-2 ${footerRowClass}`}
        >
          {footerZone}
        </footer>
      </div>
      {scanlines && !disableMotion ? <div className="crt-shell__overlay crt-shell__overlay--scanlines" aria-hidden="true" /> : null}
      {vignette ? (
        <div
          className="crt-shell__overlay pointer-events-none rounded-[inherit]"
          aria-hidden="true"
          style={{ boxShadow: 'inset 0 0 180px rgba(0, 0, 0, 0.65)' }}
        />
      ) : null}
    </div>
  );
}
