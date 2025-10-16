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
        className={`h-3 w-3 rounded-full border transition-all ${
          isComplete
            ? 'border-emerald-400 bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
            : 'border-zinc-700 bg-zinc-900 shadow-none'
        } ${!disableAnimations ? 'duration-500 ease-out' : ''}`}
        style={
          isCurrent && !disableAnimations
            ? { boxShadow: '0 0 10px rgba(252, 211, 77, 0.55)', backgroundColor: '#fcd34d' }
            : undefined
        }
      />
    );
  });

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="sr-only" role="status" aria-live="polite">
        Step {safeCurrentStep} of {Math.max(TOTAL_LIGHTS, safeTotalSteps)}. Status: {status}.
      </div>
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
