import type { ReactNode } from 'react';
import { OrbitalSystem } from './OrbitalSystem';

interface CRTShellProps {
  headerZone: ReactNode;
  screenZone: ReactNode;
  keypadZone: ReactNode;
  footerZone: ReactNode;
  disableMotion?: boolean;
  scanlines?: boolean;
  vignette?: boolean;
  questionsAnswered?: number;
}

export default function CRTShell({
  headerZone,
  screenZone,
  keypadZone,
  footerZone,
  disableMotion = false,
  scanlines = true,
  vignette = true,
  questionsAnswered = 0,
}: CRTShellProps) {
  const hasHeader = Boolean(headerZone);
  const layoutRowClasses = hasHeader
    ? '[grid-template-rows:auto_minmax(0,3fr)_auto] md:[grid-template-rows:auto_minmax(0,3fr)_auto]'
    : '[grid-template-rows:minmax(0,3fr)_auto] md:[grid-template-rows:minmax(0,3fr)_auto]';
  const screenRowClass = hasHeader ? 'md:row-start-2' : '';
  const keypadRowClass = hasHeader ? 'md:row-start-2' : '';
  const footerRowClass = hasHeader ? 'md:row-start-3' : 'md:row-start-2';

  return (
    <div className="crt-shell relative h-full w-full overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-[#0a0f16] via-[#050812] to-[#02040a] shadow-[0_32px_80px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.05)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-t before:from-transparent before:via-transparent before:to-white/[0.02] before:pointer-events-none">
      <div
        className={`crt-shell__layout relative grid h-full w-full grid-cols-1 gap-1 p-1 md:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)] md:gap-1 md:p-2 ${layoutRowClasses}`}
      >
        {hasHeader ? (
          <header className="crt-shell__header col-span-1 rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-zinc-800/70 via-zinc-900/80 to-zinc-950/90 px-5 py-1 shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.03)] md:col-span-2 md:px-6 md:py-1" style={{width: '100%'}}>
            {headerZone}
          </header>
        ) : null}
        <section
          className={`crt-shell__screen col-span-1 overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-zinc-900/80 via-zinc-950/90 to-black shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.03)] ${screenRowClass}`}
          aria-label="Simulation content"
        >
          <div className="crt-shell__screen-surface h-full">
            <div className="crt-shell__screen-content h-full p-3 md:p-4">{screenZone}</div>
          </div>
        </section>
        <aside
          className={`crt-shell__keypad col-span-1 flex flex-col gap-4 rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-zinc-800/70 via-zinc-900/80 to-zinc-950/90 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.03)] ${keypadRowClass}`}
          style={{ minHeight: '420px' }}
        >
          {!disableMotion && (
            <OrbitalSystem
              questionsAnswered={questionsAnswered}
              disableAnimations={disableMotion}
            />
          )}
          {keypadZone}
        </aside>
        <footer
          className={`crt-shell__footer col-span-1 rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-zinc-800/70 via-zinc-900/80 to-zinc-950/90 px-2 py-1 shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.03)] md:col-span-2 ${footerRowClass}`}
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
