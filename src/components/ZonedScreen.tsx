import React from 'react';
import { HeaderZone } from './zones/HeaderZone';
import { MainZone } from './zones/MainZone';
import { FooterZone, createFooterMessage, type FooterMessage } from './zones/FooterZone';
import { ContentType } from '../types/app-state';
import type { ReportData } from '../types/report';
import { SCREEN_TEXTS } from '../config/screen-text';
import { PRESENTERS, type ScreenPresenterProps } from './presenters';

export interface ZonedScreenProps {
  // Header props
  currentStep: number;
  totalSteps: number;
  progress: number;
  status?: 'active' | 'loading' | 'complete' | undefined;
  
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
  
  // Footer props
  error?: string | null | undefined;
  hoveredText?: string | undefined;
  
  // Global
  disableAnimations?: boolean | undefined;
}

export function ZonedScreen({
  currentStep,
  totalSteps,
  progress,
  status = 'active',
  contentType,
  title,
  subtitle,
  industry,
  options,
  isLoading,
  reportData,
  textValue,
  error,
  hoveredText,
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

  // Build footer messages with priority system
  const messages: FooterMessage[] = [];
  
  if (error) {
    messages.push(createFooterMessage('error', error, 100));
  }
  
  if (hoveredText && !error) {
    messages.push(createFooterMessage('hover', hoveredText, 30));
  }
  
  if (!error && !hoveredText && helpText) {
    messages.push(createFooterMessage('help', helpText, 10));
  }

  if (messages.length === 0) {
    messages.push(createFooterMessage('help', SCREEN_TEXTS.footerFallback, 0));
  }

  const PresenterComponent =
    PRESENTERS[contentType] ?? PRESENTERS[ContentType.SINGLE_CHOICE];

  const presenterProps: ScreenPresenterProps = {
    title,
    subtitle: subtitle ?? undefined,
    helpText,
    hoveredOptionLabel: hoveredText ?? undefined,
    textValue,
    showTextPreview: contentType === ContentType.TEXT_INPUT && textValue.trim().length > 0,
    onTextChange,
    reportData,
    isLoading,
    options,
    industry,
  };

  return (
    <div className="zoned-screen-container space-y-6 h-full flex flex-col">
      <HeaderZone
        currentStep={currentStep}
        totalSteps={totalSteps}
        progress={progress}
        status={status}
        disableAnimations={disableAnimations}
      />
      
      <MainZone
        contentType={contentType}
        disableAnimations={disableAnimations}
      >
        <PresenterComponent {...presenterProps} />
      </MainZone>
      
      {messages.length > 0 && (
        <FooterZone
          messages={messages}
          disableAnimations={disableAnimations}
        />
      )}
    </div>
  );
}
