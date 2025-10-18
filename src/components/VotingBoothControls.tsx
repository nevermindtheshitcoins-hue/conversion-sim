'use client';

import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { DeVOTELogo } from './DeVOTELogo';

interface VotingBoothControlsProps {
  onReset: () => void;
  onBack: () => void;
  onConfirm: () => void;
  canGoBack: boolean;
  canConfirm: boolean;
  isReport: boolean;
}

/**
 * VotingBoothControls - Bottom control buttons
 * 
 * - White/Gray: Reset (left)
 * - Red: Back (center-left)
 * - Green: Confirm/Copy (center-right)
 */
export function VotingBoothControls({
  onReset,
  onBack,
  onConfirm,
  canGoBack,
  canConfirm,
  isReport,
}: VotingBoothControlsProps) {
  return (
    <>
      <style>{`
        .control-button {
          position: relative;
          height: 56px;
          border: 3px solid;
          border-radius: 8px;
          font-weight: bold;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Courier New', monospace;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .control-button:active:not(:disabled) {
          transform: scale(0.95);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
        }

        .control-button:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        /* Reset Button - Matte Black/Gray */
        .control-button.reset {
          border-color: #404040;
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
          color: #e0e0e0;
          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.7),
            inset 0 1px 2px rgba(255, 255, 255, 0.1);
        }

        .control-button.reset:hover:not(:disabled) {
          border-color: #606060;
          background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
          box-shadow:
            0 6px 16px rgba(0, 0, 0, 0.8),
            inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }

        /* Back Button - Subdued Error Color */
        .control-button.back {
          border-color: #cf6679;
          background: linear-gradient(135deg, #cf6679 0%, #b85566 100%);
          color: #ffffff;
          box-shadow:
            0 4px 12px rgba(207, 102, 121, 0.4),
            inset 0 1px 2px rgba(255, 150, 150, 0.3);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .control-button.back:hover:not(:disabled) {
          border-color: #e08099;
          background: linear-gradient(135deg, #e08099 0%, #cf6679 100%);
          box-shadow:
            0 6px 16px rgba(207, 102, 121, 0.6),
            inset 0 1px 2px rgba(255, 180, 180, 0.4);
        }

        /* Confirm Button - Matrix Green */
        .control-button.confirm {
          border-color: #00FF41;
          background: linear-gradient(135deg, #00FF41 0%, #00CC33 100%);
          color: #000;
          box-shadow:
            0 4px 12px rgba(0, 255, 65, 0.4),
            inset 0 1px 2px rgba(100, 255, 100, 0.3);
          font-weight: bold;
        }

        .control-button.confirm:hover:not(:disabled) {
          border-color: #33FF66;
          background: linear-gradient(135deg, #33FF66 0%, #00DD44 100%);
          box-shadow:
            0 6px 16px rgba(0, 255, 65, 0.6),
            inset 0 1px 2px rgba(150, 255, 150, 0.4);
        }

        .control-button.confirm:not(:disabled) {
          animation: pulse-button 2s ease-in-out infinite;
        }

        @keyframes pulse-button {
          0%, 100% {
            box-shadow:
              0 4px 12px rgba(0, 255, 65, 0.4),
              inset 0 1px 2px rgba(100, 255, 100, 0.3);
          }
          50% {
            box-shadow:
              0 6px 16px rgba(0, 255, 65, 0.7),
              inset 0 1px 2px rgba(100, 255, 100, 0.5);
          }
        }

        .controls-container {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .control-button {
            height: 48px;
            font-size: 12px;
            padding: 0 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .control-button.confirm:not(:disabled) {
            animation: none;
          }
        }
      `}</style>

      <div className="controls-container">
        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset assessment"
          className="control-button reset"
          style={{ flex: '0.5' }}
        >
          <RefreshCcw size={20} />
          RESET
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="Go back to previous step"
          className="control-button back"
          style={{ flex: '2' }}
        >
          <ArrowLeft size={20} />
          BACK
        </button>

        {/* Confirm Button */}
        <button
          type="button"
          onClick={onConfirm}
          disabled={!canConfirm && !isReport}
          aria-label={isReport ? 'Copy report to clipboard' : 'Confirm selection and continue'}
          className="control-button confirm"
          style={{ flex: '3' }}
        >
          <DeVOTELogo size={20} />
          {isReport ? 'COPY' : 'CONFIRM'}
        </button>
      </div>
    </>
  );
}
