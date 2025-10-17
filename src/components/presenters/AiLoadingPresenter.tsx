import { memo, useMemo } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { ScreenPresenterProps } from './types';

export const AiLoadingPresenter = memo(function AiLoadingPresenter({
  title,
  error,
  isLoading,
  onRetry,
}: ScreenPresenterProps) {
  const hasError = useMemo(() => Boolean(error) && !isLoading, [error, isLoading]);
  const statusLabel = hasError ? 'Generation failed' : 'Generating questions...';
  const detailText = hasError ? error ?? title : title;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
      {hasError ? (
        <AlertTriangle className="h-12 w-12 text-industrial-orange" aria-hidden="true" />
      ) : (
        <Loader2 className="h-12 w-12 animate-spin text-industrial-orange" aria-hidden="true" />
      )}
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-text-secondary">
          {statusLabel}
        </p>
        <p className="text-xs uppercase tracking-[0.35em] text-text-disabled">
          {detailText}
        </p>
      </div>
      {hasError && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isLoading}
          className="rounded-lg border-2 border-industrial-orange bg-booth-panel px-6 py-3 text-xs font-display font-black uppercase tracking-wider text-text-primary transition-colors hover:bg-industrial-orange hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Retry
        </button>
      )}
    </div>
  );
});
