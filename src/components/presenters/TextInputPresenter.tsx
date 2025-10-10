import { memo } from 'react';
import { ScreenPresenterProps } from './types';

export const TextInputPresenter = memo(function TextInputPresenter({
  title,
  subtitle,
  helpText,
  textValue,
  showTextPreview,
  onTextChange,
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

      <section className="space-y-2">
        <textarea
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Describe your scenario where DeVOTE technology could be used..."
          className="w-full h-40 rounded-xl border border-zinc-800 bg-[#0f141c] px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          maxLength={500}
          autoFocus
        />
        <div className="text-xs text-zinc-500 text-right">
          {textValue.length}/500 characters (minimum 5)
        </div>
      </section>

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
});
