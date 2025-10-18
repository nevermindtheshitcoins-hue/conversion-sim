'use client';

import React from 'react';

interface NixieTubeProgressProps {
  currentStep: number;
  totalSteps: number;
}

/**
 * NixieTubeProgress - 9-tube progress display
 * 
 * Displays progress as individual glowing nixie tubes.
 * Each tube represents one step. Filled tubes glow green,
 * empty tubes are dim red.
 */
export function NixieTubeProgress({
  currentStep,
  totalSteps,
}: NixieTubeProgressProps) {
  const maxTubes = 9;
  const filledTubes = Math.min(currentStep, maxTubes);
  const emptyTubes = maxTubes - filledTubes;

  return (
    <>
      <style>{`
        .nixie-tube-progress {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .nixie-tube {
          position: relative;
          width: 32px;
          height: 48px;
          background: linear-gradient(180deg,
            rgba(10, 15, 12, 0.95) 0%,
            rgba(5, 8, 6, 0.98) 50%,
            rgba(0, 2, 0, 1) 100%);
          border: 2px solid rgba(0, 255, 100, 0.3);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow:
            inset 0 0 12px rgba(0, 0, 0, 0.9),
            inset 0 1px 4px rgba(0, 255, 100, 0.08);
        }

        .nixie-tube::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg,
            rgba(0, 255, 100, 0.08) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0, 255, 100, 0.04) 100%);
          border-radius: inherit;
          pointer-events: none;
        }

        .nixie-tube.filled {
          border-color: rgba(0, 255, 100, 0.6);
          background: linear-gradient(180deg,
            rgba(10, 30, 15, 0.95) 0%,
            rgba(5, 15, 8, 0.98) 50%,
            rgba(0, 5, 0, 1) 100%);
          box-shadow:
            inset 0 0 12px rgba(0, 0, 0, 0.9),
            inset 0 1px 4px rgba(0, 255, 100, 0.15),
            0 0 12px rgba(0, 255, 100, 0.4);
          animation: tube-glow 2s ease-in-out infinite;
        }

        .nixie-tube.empty {
          border-color: rgba(255, 0, 0, 0.2);
          opacity: 0.5;
        }

        .nixie-digit {
          font-family: 'Courier New', 'Share Tech Mono', monospace;
          font-size: 18px;
          font-weight: bold;
          z-index: 1;
          position: relative;
          line-height: 1;
        }

        .nixie-tube.filled .nixie-digit {
          color: #00ff64;
          text-shadow:
            0 0 4px rgba(0, 255, 100, 0.8),
            0 0 8px rgba(0, 255, 100, 0.6);
        }

        .nixie-tube.empty .nixie-digit {
          color: rgba(255, 0, 0, 0.3);
          text-shadow: none;
        }

        @keyframes tube-glow {
          0%, 100% {
            box-shadow:
              inset 0 0 12px rgba(0, 0, 0, 0.9),
              inset 0 1px 4px rgba(0, 255, 100, 0.15),
              0 0 12px rgba(0, 255, 100, 0.4);
          }
          50% {
            box-shadow:
              inset 0 0 16px rgba(0, 0, 0, 0.95),
              inset 0 2px 6px rgba(0, 255, 100, 0.2),
              0 0 16px rgba(0, 255, 100, 0.6);
          }
        }

        .progress-label {
          font-family: 'Courier New', 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(0, 255, 100, 0.6);
          text-shadow: 0 0 4px rgba(0, 255, 100, 0.4);
          margin-left: 8px;
          padding: 2px 6px;
          background: rgba(0, 255, 100, 0.05);
          border: 1px solid rgba(0, 255, 100, 0.2);
          border-radius: 3px;
          white-space: nowrap;
        }

        @media (prefers-reduced-motion: reduce) {
          .nixie-tube.filled {
            animation: none;
          }
        }
      `}</style>

      <div className="nixie-tube-progress">
        {/* Filled tubes */}
        {Array.from({ length: filledTubes }).map((_, i) => (
          <div key={`filled-${i}`} className="nixie-tube filled">
            <span className="nixie-digit">●</span>
          </div>
        ))}

        {/* Empty tubes */}
        {Array.from({ length: emptyTubes }).map((_, i) => (
          <div key={`empty-${i}`} className="nixie-tube empty">
            <span className="nixie-digit">○</span>
          </div>
        ))}

        {/* Progress label */}
        <div className="progress-label">
          {currentStep}/{totalSteps}
        </div>
      </div>
    </>
  );
}
