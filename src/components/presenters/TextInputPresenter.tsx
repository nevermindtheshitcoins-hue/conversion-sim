import { memo } from 'react';
import { MatrixDisplay } from '../MatrixDisplay';
import { ScreenPresenterProps } from './types';

export const TextInputPresenter = memo(function TextInputPresenter({
  title,
  subtitle,
  helpText,
  textValue,
  showTextPreview,
  onTextChange,
  isLoading,
}: ScreenPresenterProps) {
  return (
    <div className="flex h-full flex-col justify-center space-y-6">
      <MatrixDisplay
        title={title}
        subtitle={subtitle}
        content={helpText}
        isLoading={isLoading}
        isTyping={!isLoading}
        disableAnimations={false}
      />

      <section className="space-y-2 w-full">
        <textarea
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Describe your scenario where DeVOTE technology could be used..."
          className="w-full h-32 rounded-lg border-2 border-booth-red bg-booth-panel px-4 py-3 text-sm text-booth-green placeholder-booth-red/50 focus:outline-none focus:ring-2 focus:ring-booth-red font-mono"
          maxLength={500}
          autoFocus
        />
        <div className="text-xs text-booth-red/70 text-right font-mono">
          {textValue.length}/500 characters (minimum 5)
        </div>
      </section>

      {showTextPreview && (
        <section className="rounded-lg border-2 border-booth-red bg-booth-panel p-4 w-full">
          <h3 className="text-xs uppercase tracking-[0.3em] text-booth-green mb-2 font-mono">
            Draft Input
          </h3>
          <p className="text-sm text-booth-green whitespace-pre-wrap leading-relaxed font-mono">
            {textValue}
          </p>
        </section>
      )}
    </div>
  );
});
