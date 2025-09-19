import React, { useMemo, useState } from "react";

// Variant B — Console layout with 5 pill buttons, unlabeled R/G, smooth marquee ticker with edges.

const domains = [
  "Sneetch",
  "Thneed",
  "Zax",
  "Yop",
  "Glunk",
];

export default function ConsoleInit() {
  const [selected, setSelected] = useState<string | null>(null);

  const ticker = useMemo(
    () => [
      "ZIZZ ZAZZ",
      "WHO HOO",
      "FLEEP FLOOP",
      "BAR BALLOO",
      "YOPPITY YOP",
      "GLUNK GO",
    ],
    []
  );

  return (
    <div className="min-h-screen w-full bg-[#0a0f12] text-slate-100 flex flex-col">
      {/* 1. Header */}
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

      {/* 2. Ticker — smooth marquee with duplicated content and left/right edges */}
      <div className="relative overflow-hidden border-b border-white/10 bg-black/40">
        {/* top pulse line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400/70 animate-[pulse_3s_ease-in-out_infinite]" />
        {/* left/right borders */}
        <div className="absolute inset-y-0 left-0 w-px bg-white/15" />
        <div className="absolute inset-y-0 right-0 w-px bg-white/15" />
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0a0f12] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0f12] to-transparent" />

        <div className="relative py-2">
          <div className="flex w-max will-change-transform animate-[marquee_24s_linear_infinite]">
            {/* copy A */}
            <div className="flex whitespace-nowrap">
              {ticker.map((t, i) => (
                <span key={"a-" + i} className="mx-8 text-white/80">{t}</span>
              ))}
            </div>
            {/* copy B (duplicate) */}
            <div className="flex whitespace-nowrap" aria-hidden="true">
              {ticker.map((t, i) => (
                <span key={"b-" + i} className="mx-8 text-white/80">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Body */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6">
        {/* Machine display area */}
        <section className="col-span-9 rounded-2xl bg-[#0b1114] border border-white/10 shadow-2xl relative overflow-hidden">
          {/* scanlines */}
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.35) 2px, rgba(255,255,255,0.35) 3px)",
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />
          <div className="relative h-full grid place-items-center p-10">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow">SNEETCH SCREEN</h2>
              <p className="mt-4 text-sm tracking-[0.35em] text-emerald-300">GREEN MEANS GO GO</p>
            </div>
          </div>
        </section>

        {/* Sidebar with selections and R/G */}
        <aside className="col-span-3 flex flex-col">
          {/* spacing +20% */}
          <div className="flex-1 space-y-[0.9rem]">
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setSelected(d)}
                className={`w-full rounded-2xl py-[1.2rem] px-5 grid place-items-center border transition shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
                  selected === d
                    ? "bg-slate-800/90 border-emerald-400/30 ring-2 ring-emerald-400/70"
                    : "bg-slate-800/60 border-white/10 hover:bg-slate-800/80 hover:border-white/20"
                }`}
              >
                <span
                  className={`uppercase text-xs tracking-widest ${
                    selected === d ? "text-emerald-300" : "text-yellow-300"
                  }`}
                  style={{
                    textShadow:
                      selected === d
                        ? "0 0 10px rgba(16,185,129,0.9), 0 0 18px rgba(16,185,129,0.5)"
                        : "0 0 8px rgba(253,224,71,0.8), 0 0 14px rgba(253,224,71,0.4)",
                  }}
                >
                  {d}
                </span>
              </button>
            ))}
          </div>

          {/* Bottom-right R/G cluster */}
          <div className="mt-4 grid grid-cols-2 gap-3 items-end">
            <button
              aria-label="Abort"
              className="rounded-full aspect-square bg-red-600/80 shadow-[0_0_30px_rgba(220,38,38,0.7)] border border-red-300/20 focus:outline-none focus:ring-2 focus:ring-red-400/70"
              onClick={() => alert("Abort pressed")}
            />
            <button
              aria-label="Confirm"
              disabled={!selected}
              className={`rounded-full aspect-square border focus:outline-none focus:ring-2 focus:ring-emerald-400/70 transition ${
                selected
                  ? "bg-emerald-500 shadow-[0_0_34px_rgba(16,185,129,0.8)] border-emerald-200/40"
                  : "bg-emerald-900/30 border-white/10 opacity-50 cursor-not-allowed"
              }`}
              onClick={() => alert(`Confirmed: ${selected}`)}
            />
          </div>
        </aside>
      </main>

      {/* 4. Footer */}
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

function BadgeOK() {
  return (
    <div className="px-2 py-1 rounded-full text-xs tracking-widest border border-emerald-300/30 bg-emerald-900/30 text-emerald-300">BIM BAM</div>
  );
}
