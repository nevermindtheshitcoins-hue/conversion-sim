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
    [ContentType.INDUSTRY_PICKER]: 'min-h-[400px] flex flex-col justify-center',
    [ContentType.SINGLE_CHOICE]: 'min-h-[300px] flex flex-col justify-center',
    [ContentType.MULTI_CHOICE]: 'min-h-[300px] flex flex-col justify-center',
    [ContentType.TEXT_INPUT]: 'min-h-[350px] flex flex-col justify-center',
    [ContentType.AI_LOADING]: 'min-h-[400px] flex items-center justify-center',
    [ContentType.REPORT_VIEW]: 'min-h-[500px] max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700',
  };

  const contentTypeClasses: Record<ContentType, string> = {
    [ContentType.INDUSTRY_PICKER]: 'industry-picker-content',
    [ContentType.SINGLE_CHOICE]: 'single-choice-content',
    [ContentType.MULTI_CHOICE]: 'multi-choice-content',
    [ContentType.TEXT_INPUT]: 'text-input-content',
    [ContentType.AI_LOADING]: 'ai-loading-content',
    [ContentType.REPORT_VIEW]: 'report-view-content',
  };

  return (
    <div
      className={`main-zone-content ${contentStyles[contentType]} ${contentTypeClasses[contentType]} ${
        disableAnimations ? '' : 'transition-all duration-300 ease-in-out'
      }`}
      data-content-type={contentType}
    >
      <div
        className={disableAnimations ? '' : 'animate-in fade-in slide-in-from-bottom-4 duration-300'}
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
