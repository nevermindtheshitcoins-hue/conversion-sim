import { ScreenPresenterProps } from './types';

export function TextInputPresenter({
  title,
  subtitle,
  helpText,
  textValue,
  showTextPreview,
}: ScreenPresenterProps) {
  return (
    <div className="flex h-full flex-col justify-center space-y-6">
      <header className="space-y-2">
        <h2 className="text-4xl font-bold uppercase tracking-tight text-emerald-200">
          {title}
        </h2>
        {subtitle && <p className="text-base text-zinc-400">{subtitle}</p>}
      </header>

      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
        {helpText}
      </p>

      {showTextPreview && (
        <section className="rounded-xl border border-emerald-500/30 bg-emerald-900/20 p-4 shadow-inner">
          <h3 className="text-xs uppercase tracking-[0.3em] text-emerald-300 mb-2">
            Draft Input
          </h3>
          <p className="text-sm text-emerald-100 whitespace-pre-wrap leading-relaxed">
            {textValue}
          </p>
        </section>
      )}
    </div>
  );
}
