import { RefreshCcw } from 'lucide-react';

/** Props for the Buttons sidebar component */
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
              className="w-full h-64 p-4 bg-slate-800/60 border border-white/10 rounded-2xl text-yellow-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400/30 resize-none"
              maxLength={100}
            />
            <div className="text-xs text-slate-400 text-center">{textValue.length}/100 characters (minimum 5)</div>
          </div>
        ) : (
          <>
            {Array.from({ length: 7 }).map((_, i) => {
              const label = options[i] || '';
              if (!label) {
                return <button key={i} disabled className="w-full rounded-2xl py-4 px-2 bg-slate-700/30 border border-white/5 cursor-not-allowed" />;
              }
              const value = i + 1;
              const active = isMultiSelect ? multiSelections.includes(value) : tempSelection === value;

              return (
                <button
                  key={i}
                  onClick={() => onSelect(value, isMultiSelect)}
                  className={`w-full rounded-2xl py-4 px-3 border transition ${active ? "border-emerald-400 bg-emerald-900/30" : "border-white/10 bg-slate-800/60"}`}
                >
                  <span className="text-sm">{label}</span>
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
