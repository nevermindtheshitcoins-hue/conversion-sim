'use client';

import type { ReactNode } from 'react';

interface VotingBoothShellProps {
  displayZone: ReactNode;
  keypadZone: ReactNode;
  footerZone: ReactNode;
  disableMotion?: boolean;
  scanlines?: boolean;
}

/**
 * VotingBoothShell - Retro-futuristic voting booth interface
 * 
 * Layout matches red outline design:
 * - Top: Nixie tube progress display (9 tubes)
 * - Main: Large display screen (left) + 7-button keypad (right)
 * - Bottom: Control buttons (green confirm, red back, white reset)
 */
export default function VotingBoothShell({
  displayZone,
  keypadZone,
  footerZone,
  disableMotion = false,
  scanlines = true,
}: VotingBoothShellProps) {
  return (
    <div className="voting-booth-shell relative h-full w-full overflow-hidden rounded-lg border-2 border-gray-800 bg-black">
      {/* Main Content Area - Display + Keypad */}
      <div className="flex flex-1 flex-col lg:flex-row gap-0">
        {/* Display Screen (Left) */}
        <section
          className="flex-1 bg-black shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] min-h-[400px] lg:min-h-[500px]"
          aria-label="Display screen"
        >
          <div className="h-full overflow-hidden p-3 sm:p-4 md:p-6">
            {displayZone}
          </div>
          {scanlines && !disableMotion && (
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,255,0,0.02) 0px, rgba(0,255,0,0.02) 1px, transparent 1px, transparent 2px)',
                animation: 'scanline-drift 8s linear infinite',
              }}
            />
          )}
        </section>

        {/* Keypad (Right) - 7 Buttons */}
        <aside
          className="flex flex-col gap-2 sm:gap-3 bg-black border-t lg:border-t-0 lg:border-l border-gray-800 p-3 sm:p-4 w-full lg:w-48 xl:w-56 2xl:w-64"
          aria-label="Selection buttons"
        >
          <div className="flex justify-center lg:justify-start">
            {keypadZone}
          </div>
        </aside>
      </div>

      {/* Control Buttons - Bottom */}
      <footer className="border-t border-gray-800 bg-black p-4 md:p-6">
        {footerZone}
      </footer>
    </div>
  );
}
