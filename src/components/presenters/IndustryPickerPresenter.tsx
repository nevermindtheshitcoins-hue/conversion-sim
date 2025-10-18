import { memo } from 'react';
import { MatrixDisplay } from '../MatrixDisplay';
import { ScreenPresenterProps } from './types';

export const IndustryPickerPresenter = memo(function IndustryPickerPresenter({
  title,
  subtitle,
  helpText,
  isLoading,
}: ScreenPresenterProps) {
  return (
    <div className="flex h-full flex-col justify-center space-y-8">
      <MatrixDisplay
        title={title}
        subtitle={subtitle}
        content={helpText}
        isLoading={isLoading}
        isTyping={!isLoading}
        disableAnimations={false}
      />
    </div>
  );
});
