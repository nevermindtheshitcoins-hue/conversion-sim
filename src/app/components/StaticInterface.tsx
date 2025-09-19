import React from 'react';

const BadgeOK = () => (
  <div className="px-2 py-1 rounded-full text-xs tracking-widest border border-emerald-300/30 bg-emerald-900/30 text-emerald-300">
    BIM BAM
  </div>
);

const ticker = ['ZIZZ ZAZZ', 'WHO HOO', 'FLEEP FLOOP', 'BAR BALLOO', 'YOPPITY YOP', 'GLUNK GO'];

export function StaticInterface() {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_18px_2px_rgba(250,204,21,0.8)]" />
          <h1 className="text-lg tracking-[0.25em] font-semibold">ZIZZLE ZAZZLE CONSOLE</h1>
        </div>
        <div className="flex items-center gap-2">
          <BadgeOK />
          <span className="text-xs text-white/60">SN: ZAZ-0042</span>
        </div>
      </header>

      <div className="relative overflow-hidden border-b border-white/10 bg-black/40">
        <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400/70 animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute inset-y-0 left-0 w-px bg-white/15" />
        <div className="absolute inset-y-0 right-0 w-px bg-white/15" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0a0f12] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0f12] to-transparent" />

        <div className="relative py-2">
          <div className="flex w-max will-change-transform animate-[marquee_24s_linear_infinite]">
            <div className="flex whitespace-nowrap">
              {ticker.map((t, i) => (
                <span key={'a-' + i} className="mx-8 text-white/80">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex whitespace-nowrap" aria-hidden="true">
              {ticker.map((t, i) => (
                <span key={'b-' + i} className="mx-8 text-white/80">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
