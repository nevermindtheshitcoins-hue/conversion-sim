'use client';

import { memo, useCallback, useRef } from 'react';

export type VotingBoothKeypadProps = {
  options: string[];
  tempSelection: number | null;
  multiSelections: number[];
  isMultiSelect: boolean;
  isTextInput: boolean;
  onSelect: (value: number, isMulti: boolean) => void;
  onHover: (value: number | null) => void;
};

const BUTTON_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

/**
 * VotingBoothKeypad - 7 physical selection buttons (A-G)
 * 
 * Each button:
 * - Shows letter (A-G) prominently
 * - Has LED display showing answer text
 * - Animates with press effect on selection
 * - Glows when active/hovered
 */
export const VotingBoothKeypad = memo(function VotingBoothKeypad({
  options,
  tempSelection,
  multiSelections,
  isMultiSelect,
  isTextInput,
  onSelect,
  onHover,
}: VotingBoothKeypadProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, value: number, disabled: boolean) => {
    if (disabled) return;

    const currentIndex = value - 1;
    const enabledButtons = options.map((opt, i) => opt ? i : -1).filter(i => i >= 0);
    const currentEnabledIndex = enabledButtons.indexOf(currentIndex);

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        if (currentEnabledIndex < enabledButtons.length - 1) {
          const nextIndex = enabledButtons[currentEnabledIndex + 1];
          if (nextIndex !== undefined) {
            buttonRefs.current[nextIndex]?.focus();
          }
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        if (currentEnabledIndex > 0) {
          const prevIndex = enabledButtons[currentEnabledIndex - 1];
          if (prevIndex !== undefined) {
            buttonRefs.current[prevIndex]?.focus();
          }
        }
        break;
      case 'Home':
        e.preventDefault();
        if (enabledButtons[0] !== undefined) {
          buttonRefs.current[enabledButtons[0]]?.focus();
        }
        break;
      case 'End':
        e.preventDefault();
        const lastIndex = enabledButtons[enabledButtons.length - 1];
        if (lastIndex !== undefined) {
          buttonRefs.current[lastIndex]?.focus();
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(value, isMultiSelect);
        break;
    }
  }, [options, isMultiSelect, onSelect]);

  const buttons = Array.from({ length: 7 }, (_, i) => {
    const value = i + 1;
    const label = options[i] || '';
    const buttonLetter = BUTTON_LABELS[i];
    const active = isMultiSelect
      ? multiSelections.includes(value)
      : tempSelection === value;
    const disabled = !label || isTextInput;

    return (
      <button
        key={value}
        ref={el => { buttonRefs.current[i] = el; }}
        type="button"
        onClick={() => !disabled && onSelect(value, isMultiSelect)}
        onKeyDown={(e) => handleKeyDown(e, value, disabled)}
        onMouseEnter={() => !disabled && onHover(value)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => !disabled && onHover(value)}
        onBlur={() => onHover(null)}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        aria-label={label ? `Option ${buttonLetter}: ${label}` : `Option ${buttonLetter} unavailable`}
        aria-pressed={active}
        aria-disabled={disabled}
        className={`
          relative h-12 w-full rounded-md border-2 transition-all duration-150
          ${disabled
            ? 'border-gray-600 bg-gray-800 cursor-not-allowed opacity-40'
            : active
            ? 'border-green-400 bg-gray-900 shadow-[0_0_20px_rgba(0,255,65,0.8),inset_0_0_10px_rgba(0,255,65,0.4)]'
            : 'border-gray-600 bg-gray-900 hover:border-green-400/70 hover:shadow-[0_0_15px_rgba(0,255,65,0.4)]'
          }
          focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black
          active:scale-95
        `}
      >
        {/* Button letter label (A-G) - Matrix Green */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-lg" style={{ color: active ? '#00FF41' : '#00FF41' }}>
          {buttonLetter}
        </div>

        {/* LED text display (answer text) */}
        <div className="flex-1 flex items-center justify-center px-8">
          <span
            className="font-mono text-center font-bold text-base whitespace-nowrap"
            style={{ color: active ? '#00FF41' : '#00FF41' }}
          >
            {label || '—'}
          </span>
        </div>

        {/* Glow effect on active */}
        {active && (
          <div
            className="absolute inset-0 rounded-md pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,255,65,0.3) 0%, transparent 70%)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />
        )}
      </button>
    );
  });

  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
      <div
        role="group"
        aria-label="Selection buttons A through G"
        className="flex flex-col gap-2 h-full overflow-y-auto"
      >
        {buttons}
      </div>
    </>
  );
});
