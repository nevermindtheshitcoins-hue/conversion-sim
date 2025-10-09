import { useMemo, useState } from 'react';

export function useProgressService(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1);
  const progress = useMemo(
    () => ((currentStep - 1) / Math.max(totalSteps - 1, 1)) * 100,
    [currentStep, totalSteps]
  );

  return { currentStep, setCurrentStep, progress };
}
