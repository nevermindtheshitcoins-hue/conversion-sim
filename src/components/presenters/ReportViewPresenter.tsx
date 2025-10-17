import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { ReportDisplay } from '../ReportDisplay';
import { ScreenPresenterProps } from './types';

export const ReportViewPresenter = memo(function ReportViewPresenter({
  title,
  reportData,
  isLoading,
  helpText,
}: ScreenPresenterProps) {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-industrial-orange" aria-hidden="true" />
        <p className="text-sm uppercase tracking-[0.4em] text-text-secondary">
          Preparing executive report…
        </p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-display font-black uppercase tracking-wider text-text-primary">
          {title}
        </h2>
        <p className="text-sm text-text-secondary max-w-2xl">{helpText}</p>
        <p className="text-xs uppercase tracking-[0.4em] text-text-disabled">
          Report will appear here when ready.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-display font-black uppercase tracking-wider text-text-primary">
          {title}
        </h2>
        <p className="text-xs uppercase tracking-[0.35em] text-industrial-orange">
          {helpText}
        </p>
      </header>
      <ReportDisplay reportData={reportData} />
    </div>
  );
});
