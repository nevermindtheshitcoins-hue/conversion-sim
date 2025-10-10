import { Loader2 } from 'lucide-react';
import { ReportDisplay } from '../ReportDisplay';
import { ScreenPresenterProps } from './types';

export function ReportViewPresenter({
  title,
  reportData,
  isLoading,
  helpText,
}: ScreenPresenterProps) {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-300" aria-hidden="true" />
        <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
          Preparing executive report…
        </p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-semibold uppercase tracking-tight text-yellow-200">
          {title}
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl">{helpText}</p>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-600">
          Report will appear here when ready.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold uppercase tracking-[0.2em] text-emerald-200">
          {title}
        </h2>
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
          {helpText}
        </p>
      </header>
      <ReportDisplay reportData={reportData} />
    </div>
  );
}
