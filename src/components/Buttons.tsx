import { RefreshCcw } from 'lucide-react';

interface ButtonsProps {
  isTextInput: boolean;
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
}

export function Buttons({
  isTextInput,
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
}: ButtonsProps) {
  return (
    <aside className="col-span-4 flex flex-col">
      <div className="flex-1 space-y-3">
        {isTextInput ? (
          <div className="space-y-3">
            <textarea
              value={textValue}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Describe your scenario where DeVOTE technology could be used..."
              aria-label="Text input for your response"
              aria-describedby="char-count"
              className="w-full h-64 p-4 bg-slate-800/60 border border-white/10 rounded-2xl text-yellow-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400/30 resize-none"
              maxLength={100}
            />
            <div id="char-count" className="text-xs text-slate-400 text-center" aria-live="polite">
              {textValue.length}/100 characters (minimum 5)
            </div>
          </div>
        ) : (
          <>
            {Array.from({ length: 7 }).map((_, index) => {
              const option = options[index] || '';
              const isBlank = !option;
              const buttonValue = index + 1;

              if (isBlank) {
                return (
                  <button
                    key={index}
                    disabled
                    className="w-full rounded-2xl py-4 px-2 bg-slate-700/30 border border-white/5 cursor-not-allowed"
                  />
                );
              }

              const isMultiSelect = multiSelections.length > 0 || options.length > 5;
              const isSelected = isMultiSelect 
                ? multiSelections.includes(buttonValue)
                : tempSelection === buttonValue;

              return (
                <button
                  key={index}
                  onClick={() => onSelect(buttonValue, isMultiSelect)}
                  aria-pressed={isSelected}
                  aria-label={`Option ${buttonValue}: ${option}`}
                  role={isMultiSelect ? 'checkbox' : 'radio'}
                  tabIndex={0}
                  className={`
                    w-full rounded-2xl py-4 px-2 grid place-items-center border transition shadow-lg relative
                    focus:outline-none focus:ring-2 focus:ring-cyan-400/60
                    active:translate-y-px
                    ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-400/30 ring-2 ring-emerald-400/70 shadow-inner'
                        : 'bg-slate-800/60 border-white/10 hover:bg-slate-800/80 hover:border-white/20'
                    }
                  `}
                >
                  {isMultiSelect && isSelected && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-400 rounded-full" />
                  )}
                  <span
                    className={`uppercase text-xs tracking-widest text-center leading-tight ${
                      isSelected ? 'text-emerald-300' : 'text-yellow-300'
                    }`}
                    style={{
                      textShadow:
                        isSelected
                          ? '0 0 10px rgba(16,185,129,0.9), 0 0 18px rgba(16,185,129,0.5)'
                          : '0 0 8px rgba(253,224,71,0.8), 0 0 14px rgba(253,224,71,0.4)',
                    }}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </>
        )}
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-900/30 border border-red-400/30 rounded-lg" role="alert">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
      
      <div className="mt-4 grid grid-cols-3 gap-3 items-end">
        <div className="flex items-center justify-center">
          <button
            onClick={onReset}
            aria-label="Reset assessment"
            className="w-12 h-12 rounded-full bg-yellow-800/50 shadow-[0_0_10px_rgba(250,204,21,0.4)] border border-yellow-400/30 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-400/70 hover:bg-yellow-800/80 active:translate-y-px transition-all"
          >
            <RefreshCcw className="h-5 w-5 text-yellow-300" />
          </button>
        </div>
        <button
          onClick={onBack}
          disabled={isFirstScreen}
          aria-label="Go back to previous question"
          className="w-16 h-16 rounded-full bg-red-600/80 shadow-[0_0_30px_rgba(220,38,38,0.7)] border border-red-300/20 focus:outline-none focus:ring-2 focus:ring-red-400/70 active:translate-y-px transition-all disabled:opacity-50"
        />
        <button
          onClick={isReport ? onCopyReport : onConfirm}
          disabled={!canConfirm && !isReport}
          aria-label={isReport ? 'Copy report to clipboard' : 'Confirm selection and continue'}
          className={`
            w-16 h-16 rounded-full border focus:outline-none focus:ring-2 focus:ring-emerald-400/70
            transition-all active:translate-y-px
            ${
              canConfirm || isReport
                ? 'bg-emerald-500 shadow-[0_0_34px_rgba(16,185,129,0.8)] border-emerald-200/40 cursor-pointer'
                : 'bg-emerald-900/30 border-white/10 opacity-50 cursor-not-allowed'
            }
          `}
        />
      </div>
    </aside>
  );
}
