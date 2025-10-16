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
    <div className="flex h-full flex-col items-center text-center space-y-6" style={{paddingTop: '15%'}}>
      <header className="space-y-4">
        <h2 className="text-4xl font-bold uppercase tracking-tight text-yellow-300 md:text-5xl">
          {title}
        </h2>
        {subtitle && <p className="text-lg text-zinc-300 max-w-2xl mx-auto md:text-xl">{subtitle}</p>}
      </header>
      <p className="text-sm uppercase tracking-[0.35em] text-emerald-400 animate-slow-blink md:text-base">
        {helpText}
      </p>


      <section className="space-y-2 w-full max-w-2xl">
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
        <section className="rounded-xl border border-emerald-500/30 bg-emerald-900/20 p-4 shadow-inner w-full max-w-2xl">
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
