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
    <div className="flex h-full flex-col items-center space-y-6 text-center" style={{ paddingTop: '15%' }}>
      <header className="space-y-4 w-full max-w-2xl">
        <h2 className="text-3xl font-display font-black uppercase tracking-wider text-text-primary mb-4 text-center">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-text-secondary font-sans text-center mb-6">
            {subtitle}
          </p>
        )}
      </header>
      <p className="text-sm uppercase tracking-[0.35em] text-industrial-orange font-sans animate-pulse-slow md:text-base text-center">
        {helpText}
      </p>

      <section className="space-y-2 w-full max-w-2xl">
        <textarea
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Describe your scenario where DeVOTE technology could be used..."
          className="w-full h-40 rounded-lg border-2 border-industrial-steel bg-booth-panel px-4 py-3 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-industrial-orange"
          maxLength={500}
          autoFocus
        />
        <div className="text-xs text-text-secondary text-right">
          {textValue.length}/500 characters (minimum 5)
        </div>
      </section>

      {showTextPreview && (
        <section className="rounded-lg border-2 border-industrial-orange bg-industrial-charcoal p-4 w-full max-w-2xl">
          <h3 className="text-xs uppercase tracking-[0.3em] text-industrial-orange mb-2">
            Draft Input
          </h3>
          <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
            {textValue}
          </p>
        </section>
      )}
    </div>
  );
});
