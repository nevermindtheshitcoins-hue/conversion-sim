import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { ScreenPresenterProps } from './types';

export const AiLoadingPresenter = memo(function AiLoadingPresenter({ title }: ScreenPresenterProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-emerald-300" aria-hidden="true" />
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
          Running analysis…
        </p>
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">
          {title}
        </p>
      </div>
    </div>
  );
});
