'use client';

import React, { useEffect, useState } from 'react';

type MarbleState = 'idle' | 'active' | 'rolling' | 'rolling-back' | 'docked';

interface MarbleRunProps {
  currentStep: number;
  hasSelection: boolean;
  isConfirming: boolean;
  disableAnimations?: boolean;
}

/**
 * MarbleRun creates a meditative marble interaction system.
 * The marble sits at the keypad, energizes on selection, and rolls to the progress bar on confirmation.
 */
export function MarbleRun({
  currentStep,
  hasSelection,
  isConfirming,
  disableAnimations = false,
}: MarbleRunProps) {
  const [marbleState, setMarbleState] = useState<MarbleState>('idle');

  // Manage marble state based on user interaction
  useEffect(() => {
    if (disableAnimations) return;

    if (isConfirming) {
      setMarbleState('rolling');
      // Reset after rolling animation completes
      const timer = setTimeout(() => {
        setMarbleState('docked');
      }, 1200); // Match rolling animation duration
      return () => clearTimeout(timer);
    } else if (hasSelection) {
      setMarbleState('active');
    } else {
      setMarbleState('idle');
    }
  }, [hasSelection, isConfirming, disableAnimations]);

  // Reset marble when moving to next step
  useEffect(() => {
    if (marbleState === 'docked') {
      setMarbleState('idle');
    }
  }, [currentStep, marbleState]);

  if (disableAnimations) {
    return null;
  }

  return (
    <div className="marble-run pointer-events-none">
      <Marble state={marbleState} />
    </div>
  );
}

interface MarbleProps {
  state: MarbleState;
}

/**
 * Individual marble that sits at keypad, energizes on selection, and rolls to progress bar.
 */
function Marble({ state }: MarbleProps) {
  const getAnimationClass = () => {
    switch (state) {
      case 'active':
        return 'marble-active';
      case 'rolling':
        return 'marble-rolling';
      case 'rolling-back':
        return 'marble-rolling-back';
      case 'docked':
        return 'marble-docked';
      default:
        return 'marble-idle';
    }
  };

  return (
    <div
      className={`marble absolute h-3 w-3 rounded-full bg-emerald-400/95 shadow-[0_0_16px_rgba(16,185,129,0.8),inset_-1px_-1px_3px_rgba(0,0,0,0.4)] ${getAnimationClass()}`}
      style={{
        animation:
          state === 'rolling'
            ? 'marble-roll 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            : state === 'rolling-back'
              ? 'marble-rollback 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              : state === 'active'
                ? 'marble-pulse 1.5s ease-in-out infinite'
                : 'none',
      }}
      aria-hidden="true"
    />
  );
}
