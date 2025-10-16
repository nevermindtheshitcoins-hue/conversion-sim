import { memo } from 'react';
import { ScreenPresenterProps } from './types';

export const MultiChoicePresenter = memo(function MultiChoicePresenter({
  title,
  subtitle,
  helpText,
}: ScreenPresenterProps) {
  return (
    <div className="flex h-full flex-col items-center text-center space-y-6" style={{paddingTop: '20%'}}>
      <header className="space-y-4">
        <h2 className="text-4xl font-bold uppercase tracking-tight text-yellow-300 md:text-5xl">
          {title}
        </h2>
        {subtitle && <p className="text-lg text-zinc-300 max-w-2xl mx-auto md:text-xl">{subtitle}</p>}
      </header>
      <p className="text-sm uppercase tracking-[0.35em] text-emerald-400 animate-slow-blink md:text-base">
        {helpText}
      </p>
    </div>
  );
});
