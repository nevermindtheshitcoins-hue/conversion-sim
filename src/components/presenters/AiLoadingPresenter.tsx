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
        <AlertTriangle className="h-12 w-12 text-red-300" aria-hidden="true" />
      ) : (
        <Loader2 className="h-12 w-12 animate-spin text-emerald-300" aria-hidden="true" />
      )}
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
          {statusLabel}
        </p>
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">
          {detailText}
        </p>
      </div>
      {hasError && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isLoading}
          className="rounded-full border border-emerald-400/50 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200 transition-colors hover:bg-emerald-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Retry
        </button>
      )}
    </div>
  );
});
