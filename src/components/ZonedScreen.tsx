import React from 'react';
import { ScreenZone } from './zones/ScreenZone';
import { ContentType } from '../types/app-state';
import type { ReportData } from '../types/report';
import { SCREEN_TEXTS } from '../config/screen-text';
import { PRESENTERS, type ScreenPresenterProps } from './presenters';

export interface ZonedScreenProps {
  // Main props
  contentType: ContentType;
  title: string;
  subtitle?: string | undefined;
  industry: string | null;
  options: string[];
  isLoading: boolean;
  reportData: ReportData | null;
  textValue: string;
  onTextChange: (value: string) => void;
  error: string | null;
  aiGenerated: boolean;
  onRetryAiQuestions?: () => void;
  disableAnimations?: boolean | undefined;
}

export function ZonedScreen({
  contentType,
  title,
  subtitle,
  industry,
  options,
  isLoading,
  reportData,
  textValue,
  error,
  aiGenerated,
  onRetryAiQuestions,
  disableAnimations = false,
  onTextChange,
}: ZonedScreenProps) {
  const helpText = (() => {
    switch (contentType) {
      case ContentType.REPORT_VIEW:
        return SCREEN_TEXTS.helpHints.report;
      case ContentType.TEXT_INPUT:
        return SCREEN_TEXTS.helpHints.textInput;
      case ContentType.MULTI_CHOICE:
        return SCREEN_TEXTS.helpHints.multiSelect;
      default:
        return SCREEN_TEXTS.helpHints.default;
    }
  })();

  const PresenterComponent =
    PRESENTERS[contentType] ?? PRESENTERS[ContentType.SINGLE_CHOICE];

  const presenterProps: ScreenPresenterProps = {
    title,
    subtitle: subtitle ?? undefined,
    helpText,
    textValue,
    showTextPreview: contentType === ContentType.TEXT_INPUT && textValue.trim().length > 0,
    onTextChange,
    reportData,
    isLoading,
    options,
    industry,
    error,
    onRetry: aiGenerated ? onRetryAiQuestions : undefined,
  };

  return (
    <div className="zoned-screen h-full flex flex-col space-y-6">
      <ScreenZone
        contentType={contentType}
        disableAnimations={disableAnimations}
      >
        <PresenterComponent {...presenterProps} />
      </ScreenZone>
    </div>
  );
}
