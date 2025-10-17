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
  const safeProgress = Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 100) : 0;

  const TOTAL_LIGHTS = 9;
  const estimatedFromProgress = Math.round((safeProgress / 100) * TOTAL_LIGHTS);
  const completedLights = Math.min(
    TOTAL_LIGHTS,
    Math.max(estimatedFromProgress, safeCurrentStep)
  );

  const lights = Array.from({ length: TOTAL_LIGHTS }, (_, index) => {
    const position = index + 1;
    const isComplete = position <= completedLights;
    const isCurrent = position === completedLights && completedLights < TOTAL_LIGHTS && status !== 'complete';

    return (
      <span
        key={position}
        aria-hidden="true"
        className={`h-3 w-3 border transition-all ${
          isComplete
            ? 'border-norad-amber bg-norad-amber shadow-[0_0_12px_rgba(255,191,0,0.6)]'
            : 'border-norad-steel bg-norad-black shadow-none'
        } ${!disableAnimations ? 'duration-500 ease-out' : ''}`}
        style={
          isCurrent && !disableAnimations
            ? { boxShadow: '0 0 10px rgba(255, 191, 0, 0.55)', backgroundColor: '#ffd700' }
            : undefined
        }
      />
    );
  });

  return (
    <div className="border border-norad-steel bg-norad-black px-6 py-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
      <h1 className="text-2xl font-mono font-bold uppercase tracking-[0.2em] text-norad-amber">
        Step {safeCurrentStep} of {Math.max(TOTAL_LIGHTS, safeTotalSteps)}. Status: {status}.
      </h1>
      <div
        className="grid grid-cols-9 items-center gap-3"
        role="progressbar"
        aria-valuenow={safeCurrentStep}
        aria-valuemin={0}
        aria-valuemax={TOTAL_LIGHTS}
        aria-label="Assessment progress"
      >
        {lights}
      </div>
    </div>
  );
}
