import React from 'react';

export interface KeypadZoneProps {
  children: React.ReactNode;
  disableAnimations?: boolean;
  label?: string;
}

export function KeypadZone({
  children,
  disableAnimations = false,
  label,
}: KeypadZoneProps) {
  return (
    <div
      className={`keypad-zone flex w-full flex-1 flex-col gap-3 ${
        disableAnimations ? '' : 'animate-in fade-in duration-200'
      }`}
      aria-label={label}
    >
      {children}
    </div>
  );
}
