export type ControlPanelProps = {
  options: string[];
  tempSelection: number | null;
  multiSelections: number[];
  isMultiSelect: boolean;
  isTextInput: boolean;
  onSelect: (value: number, isMulti: boolean) => void;
  onHover: (value: number | null) => void;
};

export function ControlPanel({
  options,
  tempSelection,
  multiSelections,
  isMultiSelect,
  isTextInput,
  onSelect,
  onHover,
}: ControlPanelProps) {
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
        type="button"
        onClick={() => !disabled && onSelect(value, isMultiSelect)}
        onMouseEnter={() => !disabled && onHover(value)}
        onMouseLeave={() => onHover(null)}
        disabled={disabled}
        className={`w-full h-14 rounded-lg border-2 px-4 text-left transition-all overflow-hidden ${
          active
            ? 'border-yellow-400 bg-yellow-900/40 text-yellow-100 shadow-lg'
            : disabled
            ? 'border-zinc-800 bg-zinc-900/50 text-zinc-700 cursor-not-allowed'
            : 'border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:border-yellow-500/60 hover:bg-zinc-700'
        }`}
      >
        <span className="text-sm font-medium truncate block">{label || '—'}</span>
      </button>
    );
  });

  return <div className="space-y-2">{buttons}</div>;
}
