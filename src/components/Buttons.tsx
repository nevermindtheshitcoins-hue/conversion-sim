import { RefreshCcw } from "lucide-react";

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
      <div className="flex-1 rounded-3xl border border-zinc-800 bg-black/30 p-6 flex flex-col gap-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-zinc-500">
            <span>
              Step {clampedStep} of {total}
            </span>
            <span>Progress</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300"
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
              className="w-full h-48 rounded-xl border border-zinc-800 bg-[#0f141c] px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              maxLength={500}
              autoFocus
            />
            <div className="text-xs text-zinc-500 text-center">
              {textValue.length}/500 characters (minimum 5)
            </div>
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
                  className={`w-full rounded-xl border px-5 py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d12] ${
                    active
                      ? 'border-yellow-300 bg-[#151d29] text-yellow-200'
                      : 'border-zinc-800 bg-[#10151c] text-zinc-100 hover:border-yellow-300/60 hover:bg-[#131a24]'
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
            <p className="text-sm text-zinc-500">
              Options will appear once this step loads.
            </p>
          )}
        </div>

        {error && (
          <div
            className="rounded-xl border border-red-500/30 bg-red-900/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-zinc-800 bg-black/30 px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset assessment"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-yellow-400/40 bg-yellow-800/40 text-yellow-200 transition-colors hover:bg-yellow-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/70"
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
            className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-red-500/40 bg-red-700/70 text-red-200 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 disabled:opacity-40"
            data-button-click-sound={buttonClickSound}
            data-button-press-effect={buttonPressEffect}
          />
          <button
            type="button"
            onClick={isReport ? onCopyReport : onConfirm}
            disabled={!canConfirm && !isReport}
            aria-label={isReport ? 'Copy report to clipboard' : 'Confirm selection and continue'}
            className={`inline-flex h-16 w-16 items-center justify-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 ${
              canConfirm || isReport
                ? 'border-emerald-300/50 bg-emerald-600 text-emerald-50'
                : 'border-emerald-900/40 bg-emerald-900/30 text-emerald-800 cursor-not-allowed'
            }`}
            data-button-click-sound={buttonClickSound}
            data-button-press-effect={buttonPressEffect}
          />
        </div>
      </div>
    </aside>
  );
}
