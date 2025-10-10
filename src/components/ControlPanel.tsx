import { memo, useCallback, useRef } from 'react';
import { CONTROL_PANEL_STYLES, FOCUS_STYLES } from '../lib/ui-constants';

export type ControlPanelProps = {
  options: string[];
  tempSelection: number | null;
  multiSelections: number[];
  isMultiSelect: boolean;
  isTextInput: boolean;
  onSelect: (value: number, isMulti: boolean) => void;
  onHover: (value: number | null) => void;
};

export const ControlPanel = memo(function ControlPanel({
  options,
  tempSelection,
  multiSelections,
  isMultiSelect,
  isTextInput,
  onSelect,
  onHover,
}: ControlPanelProps) {
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
        aria-label={label ? `Option ${value}: ${label}` : `Option ${value} unavailable`}
        aria-pressed={active}
        aria-disabled={disabled}
        className={`${CONTROL_PANEL_STYLES.button.base} ${FOCUS_STYLES.ring} ${
          active
            ? CONTROL_PANEL_STYLES.button.active
            : disabled
            ? CONTROL_PANEL_STYLES.button.disabled
            : CONTROL_PANEL_STYLES.button.default
        }`}
      >
        <span className="text-sm font-medium truncate block">{label || '—'}</span>
      </button>
    );
  });

  return (
    <div 
      role="group" 
      aria-label="Answer options"
      className="space-y-2"
    >
      {buttons}
    </div>
  );
});
