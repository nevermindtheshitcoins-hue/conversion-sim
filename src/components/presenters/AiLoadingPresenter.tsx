import { memo, useMemo } from 'react';

import { MatrixDisplay } from '../MatrixDisplay';
import { ScreenPresenterProps } from './types';

export const AiLoadingPresenter = memo(function AiLoadingPresenter({
  title,
  error,
  isLoading,
  onRetry,
}: ScreenPresenterProps) {
  const hasError = useMemo(() => Boolean(error) && !isLoading, [error, isLoading]);
  const statusLabel = hasError ? 'GENERATION FAILED' : 'GENERATING QUESTIONS';
  const detailText = hasError ? error ?? title : title;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 text-center">
      <MatrixDisplay
        title={statusLabel}
        content={detailText}
        isLoading={isLoading}
        isTyping={false}
        disableAnimations={false}
      />
      {hasError && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isLoading}
          className="rounded-lg border-2 border-booth-red bg-booth-panel px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-booth-green transition-all hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] hover:border-booth-green disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⟳ RETRY
        </button>
      )}
    </div>
  );
});
