import { RefreshCcw } from "lucide-react";
import { BUTTON_STYLES, FOCUS_STYLES } from '../lib/ui-constants';

interface ButtonsProps {
  /** Whether the current screen requires text input */
  isTextInput: boolean;
  /** Whether the current screen allows multiple selections */
  isMultiSelect: boolean;
  textValue: string;
  onTextChange: (value: string) => void;
  options: string[];
  tempSelection: number | null;
  multiSelections: number[];
  onSelect: (value: number, isMulti: boolean) => void;
  onConfirm: () => void;
  onBack: () => void;
  onReset: () => void;
  canConfirm: boolean;
  error: string | null;
  isReport: boolean;
  onCopyReport: () => void;
  isFirstScreen: boolean;
  onHover: (value: number | null) => void;
  hoveredOption: number | null;
  progress: number;
  currentStep: number;
  totalSteps: number;
  buttonClickSound?: 'click' | 'beep' | 'buzz';
  buttonPressEffect?: 'depress' | 'light-up';
}

export function Buttons({
  isTextInput,
  isMultiSelect,
  textValue,
  onTextChange,
  options,
  tempSelection,
  multiSelections,
  onSelect,
  onConfirm,
  onBack,
  onReset,
  canConfirm,
  error,
  isReport,
  onCopyReport,
  isFirstScreen,
  onHover,
  hoveredOption,
  progress,
  currentStep,
  totalSteps,
  buttonClickSound = 'click',
  buttonPressEffect = 'depress',
}: ButtonsProps) {
  void hoveredOption;

  const total = Math.max(totalSteps, 1);
  const clampedStep = Math.min(Math.max(currentStep, 1), total);
  const normalizedProgress =
    Number.isFinite(progress) && progress >= 0 && progress <= 100
      ? progress
      : ((clampedStep - 1) / Math.max(total - 1, 1)) * 100;

  return (
    <aside className="col-span-full lg:col-span-5 flex flex-col">
      <div className="flex-1 border border-norad-steel bg-norad-black p-6 flex flex-col gap-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
        <div>
          <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-norad-cyan">
            <span>
              Step {clampedStep} of {total}
            </span>
            <span>Progress</span>
          </div>
          <div className="h-2 bg-norad-dark overflow-hidden border border-norad-steel">
            <div
              className="h-full bg-norad-amber transition-all duration-300"
              style={{ width: `${normalizedProgress}%` }}
            />
          </div>
        </div>

        {isTextInput && (
          <div className="space-y-3">
            <textarea
              value={textValue}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Describe your scenario where DeVOTE technology could be used..."
              className="w-full h-48 border border-norad-steel bg-norad-black px-4 py-3 font-mono text-sm text-norad-amber placeholder-text-disabled resize-none focus:outline-none focus:border-norad-amber transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
              maxLength={500}
              autoFocus
            />
            <p className="font-mono text-xs text-norad-cyan">{textValue.length}/500 characters (minimum 5)</p>
          </div>
        )}

        <div className={`space-y-3 transition-opacity duration-200 ${isTextInput ? 'opacity-40 pointer-events-none' : ''}`}>
          {options && options.length > 0 ? (
            options.map((label, index) => {
              const value = index + 1;
              const active = isMultiSelect
                ? multiSelections.includes(value)
                : tempSelection === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSelect(value, isMultiSelect)}
                  onMouseEnter={() => onHover(value)}
                  onMouseLeave={() => onHover(null)}
                  className={`flex items-center justify-center gap-2 px-6 py-3 border font-mono font-bold uppercase tracking-wider text-sm transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] ${
                    active
                      ? 'border-norad-cyan bg-norad-dark text-norad-cyan hover:bg-norad-charcoal active:translate-y-px'
                      : 'border-norad-steel bg-norad-black text-text-disabled cursor-not-allowed opacity-50'
                  }`}
                  data-button-click-sound={buttonClickSound}
                  data-button-press-effect={buttonPressEffect}
                  disabled={isTextInput}
                >
                  <span className="text-sm font-medium leading-relaxed">{label}</span>
                </button>
              );
            })
          ) : (
            <p className="text-sm text-text-secondary">
              Options will appear once this step loads.
            </p>
          )}
        </div>

        {error && (
          <div
            className="border border-norad-amber bg-norad-dark px-4 py-3 font-mono text-sm text-norad-amber shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>

      <div className="mt-5 border border-norad-steel bg-norad-black px-6 py-4 flex items-center justify-between shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset assessment"
          className={`inline-flex h-12 w-12 items-center justify-center border ${BUTTON_STYLES.accent} ${FOCUS_STYLES.ring} shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]`}
          data-button-click-sound={buttonClickSound}
          data-button-press-effect={buttonPressEffect}
        >
          <RefreshCcw className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isFirstScreen}
            aria-label="Go back to previous question"
            className={`inline-flex h-16 w-16 items-center justify-center border ${BUTTON_STYLES.secondary} ${FOCUS_STYLES.ring} disabled:opacity-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]`}
            data-button-click-sound={buttonClickSound}
            data-button-press-effect={buttonPressEffect}
          />
          <button
            type="button"
            onClick={isReport ? onCopyReport : onConfirm}
            disabled={!canConfirm && !isReport}
            aria-label={isReport ? 'Copy report to clipboard' : 'Confirm selection and continue'}
            className={`inline-flex h-16 w-16 items-center justify-center border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-norad-amber shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] ${
              canConfirm || isReport
                ? BUTTON_STYLES.primary
                : BUTTON_STYLES.primaryDisabled
            }`}
            data-button-click-sound={buttonClickSound}
            data-button-press-effect={buttonPressEffect}
          />
        </div>
      </div>
    </aside>
  );
}
