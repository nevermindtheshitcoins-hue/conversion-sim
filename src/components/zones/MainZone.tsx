import React from 'react';
import { ContentType } from '../../types/app-state';

export interface MainZoneProps {
  contentType: ContentType;
  children: React.ReactNode;
  disableAnimations?: boolean;
}

export function MainZone({
  contentType,
  children,
  disableAnimations = false,
}: MainZoneProps) {
  const hasContent = React.Children.count(children) > 0;

  // Content type specific styling and heights
  const contentStyles: Record<ContentType, string> = {
    [ContentType.INDUSTRY_PICKER]: 'min-h-[400px] justify-start',
    [ContentType.SINGLE_CHOICE]: 'min-h-[300px] justify-start',
    [ContentType.MULTI_CHOICE]: 'min-h-[300px] justify-start',
    [ContentType.TEXT_INPUT]: 'min-h-[350px] justify-start',
    [ContentType.AI_LOADING]: 'min-h-[400px] items-center justify-center',
    [ContentType.REPORT_VIEW]:
      'min-h-[500px] max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700',
    [ContentType.ERROR_DISPLAY]: 'min-h-[400px] items-center justify-center',
  };

  const contentTypeClasses: Record<ContentType, string> = {
    [ContentType.INDUSTRY_PICKER]: 'main-zone--industry-picker',
    [ContentType.SINGLE_CHOICE]: 'main-zone--single-choice',
    [ContentType.MULTI_CHOICE]: 'main-zone--multi-choice',
    [ContentType.TEXT_INPUT]: 'main-zone--text-input',
    [ContentType.AI_LOADING]: 'main-zone--ai-loading',
    [ContentType.REPORT_VIEW]: 'main-zone--report-view',
    [ContentType.ERROR_DISPLAY]: 'main-zone--error-display',
  };

  return (
    <div
      className={`main-zone flex flex-1 flex-col ${contentStyles[contentType]} ${contentTypeClasses[contentType]} ${
        disableAnimations ? '' : 'transition-all duration-300 ease-in-out'
      }`}
      data-content-type={contentType}
    >
      <div
        className={`${disableAnimations ? '' : 'animate-in fade-in slide-in-from-bottom-4 duration-300'} flex-1`}
        key={contentType} // Force re-animate on content type change
      >
        {hasContent ? (
          children
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-[0.35em] text-zinc-500">
            Loading zone content…
          </div>
        )}
      </div>
    </div>
  );
}
