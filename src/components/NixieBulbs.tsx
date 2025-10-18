import React, { useMemo } from 'react';

interface NixieBulbsProps {
  currentStep?: number;
  disableMotion?: boolean;
}

export function NixieBulbs({
  currentStep = 0,
  disableMotion = false,
}: NixieBulbsProps) {
  const questionsAnswered = useMemo(() => {
    return Math.max(0, Math.min(currentStep - 3, 9));
  }, [currentStep]);

  const TOTAL_BULBS = 9;
  const bulbs = Array.from({ length: TOTAL_BULBS }, (_, i) => ({
    id: i,
    isActive: i < questionsAnswered,
  }));

  return (
    <div className="nixie-rack-wrapper flex justify-center gap-2 py-2">
      <div
        className="nixie-rack relative flex justify-center items-end gap-2"
        style={{
          border: '2px solid #333',
          backgroundColor: '#1a1a1a',
          padding: '12px 16px',
          borderRadius: '4px',
          minHeight: '100px',
        }}
      >
        {/* Horizontal rail */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            right: '16px',
            height: '2px',
            backgroundColor: '#444',
            zIndex: 0,
          }}
        />

        {/* Bulbs */}
        {bulbs.map((bulb) => (
          <div
            key={bulb.id}
            className="nixie-bulb"
            style={{
              position: 'relative',
              zIndex: 1,
              width: '48px',
              height: '72px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 48 72" width="48" height="72" style={{ overflow: 'visible' }}>
              {/* Glass Dome */}
              <path
                d="M 8 36 Q 8 12 24 8 Q 40 12 40 36 L 40 48 Q 40 52 36 52 L 12 52 Q 8 52 8 48 Z"
                fill="rgba(255, 255, 255, 0.1)"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              />

              {/* Filament and Glow */}
              {bulb.isActive ? (
                <g style={{ filter: 'drop-shadow(0 0 8px #ff8c00)' }}>
                  <text
                    x="24"
                    y="40"
                    fontFamily="monospace"
                    fontSize="32"
                    textAnchor="middle"
                    fill="#ff8c00"
                    style={{
                      animation: !disableMotion ? `nixie-flicker 0.1s infinite` : 'none',
                    }}
                  >
                    {(bulb.id + 1).toString()}
                  </text>
                </g>
              ) : (
                <text
                  x="24"
                  y="40"
                  fontFamily="monospace"
                  fontSize="32"
                  textAnchor="middle"
                  fill="#333"
                >
                  0
                </text>
              )}

              {/* Base */}
              <rect
                x="12"
                y="52"
                width="24"
                height="12"
                fill="#1a1a1a"
                stroke="#333"
                strokeWidth="1.5"
                rx="2"
              />
            </svg>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes nixie-flicker {
          0% { opacity: 0.9; }
          50% { opacity: 1; }
          100% { opacity: 0.9; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nixie-bulb svg * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
