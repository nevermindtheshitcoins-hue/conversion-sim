import { ScreenPresenterProps } from './types';

export function MultiChoicePresenter({
  title,
  subtitle,
  helpText,
  hoveredOptionLabel,
}: ScreenPresenterProps) {
  return (
    <div className="flex h-full flex-col justify-center space-y-6">
      <header className="space-y-2">
        <h2 className="text-4xl font-bold uppercase tracking-tight text-cyan-200">
          {title}
        </h2>
        {subtitle && <p className="text-base text-zinc-400">{subtitle}</p>}
      </header>

      <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
        {helpText}
      </p>

      {hoveredOptionLabel && (
        <aside className="rounded-lg border border-cyan-500/40 bg-cyan-900/40 px-4 py-3 text-xs uppercase tracking-[0.3em] text-cyan-100 shadow-inner">
          {hoveredOptionLabel}
        </aside>
      )}
    </div>
  );
}
