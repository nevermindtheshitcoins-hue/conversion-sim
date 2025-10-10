import { memo } from 'react';
import { ScreenPresenterProps } from './types';

export const IndustryPickerPresenter = memo(function IndustryPickerPresenter({
  title,
  subtitle,
  helpText,
  hoveredOptionLabel,
}: ScreenPresenterProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold uppercase tracking-tight text-yellow-300">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
        {helpText}
      </p>

      {hoveredOptionLabel && (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300 shadow-lg">
          {hoveredOptionLabel}
        </div>
      )}
    </div>
  );
});
