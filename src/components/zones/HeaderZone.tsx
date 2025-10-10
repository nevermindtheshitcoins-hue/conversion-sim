import React from 'react';

export interface HeaderZoneProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  status?: 'active' | 'loading' | 'complete';
  disableAnimations?: boolean;
}

export function HeaderZone({
  currentStep,
  totalSteps,
  progress,
  status = 'active',
  disableAnimations = false,
}: HeaderZoneProps) {
  const safeTotalSteps = Number.isFinite(totalSteps) && totalSteps > 0 ? Math.round(totalSteps) : 1;
  const safeCurrentStep = Number.isFinite(currentStep)
    ? Math.min(Math.max(Math.round(currentStep), 1), safeTotalSteps)
    : 1;
  const safeProgress = Number.isFinite(progress)
    ? Math.min(Math.max(progress, 0), 100)
    : 0;

  const statusStyles: Record<
    'active' | 'loading' | 'complete',
    { background: string; shadow: string }
  > = {
    active: {
      background: 'bg-yellow-300',
      shadow: 'shadow-[0_0_12px_rgba(252,211,77,0.5)]',
    },
    loading: {
      background: 'bg-blue-400',
      shadow: 'shadow-[0_0_12px_rgba(96,165,250,0.5)]',
    },
    complete: {
      background: 'bg-emerald-400',
      shadow: 'shadow-[0_0_12px_rgba(52,211,153,0.5)]',
    },
  };

  const statusLabels: Record<'active' | 'loading' | 'complete', string> = {
    active: 'In Progress',
    loading: 'Processing',
    complete: 'Complete',
  };
  const currentStatusStyle = statusStyles[status];

  return (
    <div className="space-y-4 p-2">
      {/* Status Bar with TV-style glow */}
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.45em] text-zinc-400 font-mono">
        <div className="flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 rounded-full shadow-lg ${currentStatusStyle.background} ${currentStatusStyle.shadow} ${
              !disableAnimations && status === 'loading' ? 'animate-pulse' : ''
            }`}
            aria-label={statusLabels[status]}
          />
          <span className="text-shadow-glow">Business Proof</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-medium tracking-normal border border-emerald-500/20">
          Step {safeCurrentStep}
        </span>
      </div>

      {/* Progress Bar with CRT scanline effect */}
      <div className="h-1 rounded-full bg-zinc-800 overflow-hidden relative">
        <div
          className={`h-full bg-gradient-to-r from-emerald-400 to-emerald-300 shadow-lg ${
            disableAnimations ? '' : 'transition-all duration-700 ease-in-out'
          }`}
          style={{ width: `${safeProgress}%` }}
          role="progressbar"
          aria-valuenow={safeProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${safeProgress}%`}
        />
        {/* Scanline effect overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-transparent via-zinc-100/5 to-transparent ${
            disableAnimations ? '' : 'animate-pulse'
          }`}
        />
      </div>

      {/* Step Counter with typewriter effect styling */}
      <div className="text-center text-sm text-zinc-400 font-mono">
        <span className="text-shadow-glow">
          [{String(safeCurrentStep).padStart(2, '0')}] / [{String(safeTotalSteps).padStart(2, '0')}]
        </span>
      </div>
    </div>
  );
}
