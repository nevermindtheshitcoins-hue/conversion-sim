import { useMemo, useState } from 'react';

export type ZoneState = 'industry' | 'customInput' | 'question' | 'report';

export function useProgressService(totalSteps: number, currentZone?: ZoneState) {
  const [currentStep, setCurrentStep] = useState(1);
  const progress = useMemo(
    () => ((currentStep - 1) / Math.max(totalSteps - 1, 1)) * 100,
    [currentStep, totalSteps]
  );

  return { currentStep, setCurrentStep, progress, currentZone };
}
