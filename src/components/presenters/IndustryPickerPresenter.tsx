import { memo } from 'react';
import { ScreenPresenterProps } from './types';

export const IndustryPickerPresenter = memo(function IndustryPickerPresenter({
  title,
  subtitle,
  helpText,
}: ScreenPresenterProps) {
  return (
    <div className="flex h-full flex-col items-center space-y-6 text-center" style={{ paddingTop: '20%' }}>
      <div className="space-y-4 w-full max-w-2xl">
        <h2 className="text-3xl font-display font-black uppercase tracking-wider text-text-primary mb-4 text-center">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-text-secondary font-sans text-center mb-6">
            {subtitle}
          </p>
        )}
      </div>
      <p className="text-sm uppercase tracking-[0.35em] text-industrial-orange font-sans animate-pulse-slow md:text-base text-center">
        {helpText}
      </p>
    </div>
  );
});
