'use client';

import React from 'react';

interface FilamentTubeClockProps {
  currentStep: number;
  totalSteps: number;
  status?: 'active' | 'loading' | 'complete';
}

/**
 * FilamentTubeClock - A nixie tube style progress display component
 *
 * Displays current step and total steps in individual glass tube segments
 * with green neon glow effects, positioned above the CRT shell area.
 */
export function FilamentTubeClock({
  currentStep,
  totalSteps,
  status = 'active'
}: FilamentTubeClockProps) {
  // Format numbers as two-digit strings for consistent tube display
  const currentDisplay = currentStep.toString().padStart(2, '0');
  const totalDisplay = totalSteps.toString().padStart(2, '0');

  // Individual digit tubes for current step
  const currentTubes = currentDisplay.split('');
  // Individual digit tubes for total steps
  const totalTubes = totalDisplay.split('');

  return (
    <>
      <style>{`
        /* Filament Tube Clock Styles */
        .filament-tube-clock {
          position: absolute;
          top: -60px; /* Extend above CRT shell */
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 20px;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 20, 10, 0.8) 100%);
          border: 2px solid rgba(0, 255, 136, 0.3);
          border-radius: 15px;
          padding: 15px 25px;
          box-shadow:
            0 0 30px rgba(0, 255, 136, 0.2),
            inset 0 2px 6px rgba(0, 255, 136, 0.1);
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        /* Individual tube segment */
        .filament-tube {
          position: relative;
          width: 45px;
          height: 70px;
          background: linear-gradient(180deg,
            rgba(20, 30, 25, 0.9) 0%,
            rgba(5, 15, 10, 0.95) 50%,
            rgba(0, 5, 0, 1) 100%);
          border: 2px solid rgba(0, 255, 136, 0.4);
          border-radius: 8px;
          box-shadow:
            inset 0 0 20px rgba(0, 0, 0, 0.8),
            inset 0 2px 6px rgba(0, 255, 136, 0.1),
            0 0 15px rgba(0, 255, 136, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Tube glass effect */
        .filament-tube::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg,
            rgba(0, 255, 136, 0.1) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0, 255, 136, 0.05) 100%);
          border-radius: inherit;
          pointer-events: none;
        }

        /* Tube digit styling */
        .filament-digit {
          font-family: 'Courier New', 'Share Tech Mono', monospace;
          font-size: 28px;
          font-weight: bold;
          color: #00ff88;
          text-shadow:
            0 0 8px rgba(0, 255, 136, 0.8),
            0 0 16px rgba(0, 255, 136, 0.6),
            0 0 24px rgba(0, 255, 136, 0.4);
          z-index: 1;
          position: relative;
          line-height: 1;
        }

        /* Tube glow animation */
        @keyframes tube-flicker {
          0%, 100% {
            box-shadow:
              inset 0 0 20px rgba(0, 0, 0, 0.8),
              inset 0 2px 6px rgba(0, 255, 136, 0.1),
              0 0 15px rgba(0, 255, 136, 0.3);
            text-shadow:
              0 0 8px rgba(0, 255, 136, 0.8),
              0 0 16px rgba(0, 255, 136, 0.6),
              0 0 24px rgba(0, 255, 136, 0.4);
          }
          50% {
            box-shadow:
              inset 0 0 25px rgba(0, 0, 0, 0.9),
              inset 0 3px 8px rgba(0, 255, 136, 0.15),
              0 0 20px rgba(0, 255, 136, 0.5);
            text-shadow:
              0 0 6px rgba(0, 255, 136, 0.9),
              0 0 12px rgba(0, 255, 136, 0.7),
              0 0 18px rgba(0, 255, 136, 0.5);
          }
        }

        .filament-tube {
          animation: tube-flicker 3s ease-in-out infinite;
        }

        /* Status indicator */
        .clock-status {
          font-family: 'Courier New', 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #00ff88;
          text-shadow: 0 0 6px rgba(0, 255, 136, 0.6);
          margin-left: 10px;
          padding: 4px 8px;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 4px;
        }

        .clock-status.loading {
          color: #ffaa00;
          text-shadow: 0 0 6px rgba(255, 170, 0, 0.6);
          background: rgba(255, 170, 0, 0.1);
          border-color: rgba(255, 170, 0, 0.3);
        }

        .clock-status.complete {
          color: #00ff88;
          text-shadow: 0 0 8px rgba(0, 255, 136, 0.8);
          background: rgba(0, 255, 136, 0.15);
          border-color: rgba(0, 255, 136, 0.5);
        }

        /* Separator slash */
        .clock-separator {
          font-family: 'Courier New', 'Share Tech Mono', monospace;
          font-size: 20px;
          font-weight: bold;
          color: #00ff88;
          text-shadow:
            0 0 6px rgba(0, 255, 136, 0.6),
            0 0 12px rgba(0, 255, 136, 0.4);
          margin: 0 8px;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .filament-tube-clock {
            top: -45px;
            padding: 12px 20px;
            gap: 15px;
          }

          .filament-tube {
            width: 35px;
            height: 55px;
          }

          .filament-digit {
            font-size: 22px;
          }

          .clock-separator {
            font-size: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .filament-tube {
            animation: none;
          }
        }
      `}</style>

      <div className="filament-tube-clock">
        {/* Current step tubes */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentTubes.map((digit, index) => (
            <div key={`current-${index}`} className="filament-tube">
              <span className="filament-digit">{digit}</span>
            </div>
          ))}
        </div>

        {/* Separator */}
        <span className="clock-separator">/</span>

        {/* Total steps tubes */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {totalTubes.map((digit, index) => (
            <div key={`total-${index}`} className="filament-tube">
              <span className="filament-digit">{digit}</span>
            </div>
          ))}
        </div>

        {/* Status indicator */}
        <div className={`clock-status ${status}`}>
          {status === 'loading' ? 'PROCESSING' :
           status === 'complete' ? 'COMPLETE' : 'ACTIVE'}
        </div>
      </div>
    </>
  );
}