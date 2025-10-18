import React, { ReactNode } from 'react';
import { NixieBulbs } from './NixieBulbs';

interface VotingBoothCasingProps {
  children: ReactNode;
  currentStep?: number;
  disableMotion?: boolean;
}

export function VotingBoothCasing({
  children,
  currentStep = 0,
  disableMotion = false,
}: VotingBoothCasingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {/* Top bezel with nixie tubes */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-300">
          <div className="flex justify-center">
            <NixieBulbs currentStep={currentStep} disableMotion={disableMotion} />
          </div>
        </div>

        {/* Main display area */}
        <div className="bg-black p-6 min-h-[400px]">
          {children}
        </div>

        {/* Bottom bezel */}
        <div className="h-3 bg-gray-100 border-t border-gray-300" />
      </div>
    </div>
  );
}
