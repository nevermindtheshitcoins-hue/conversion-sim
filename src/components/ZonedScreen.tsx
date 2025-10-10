import React from 'react';
import { HeaderZone } from './zones/HeaderZone';
import { MainZone } from './zones/MainZone';
import { FooterZone, createFooterMessage, type FooterMessage } from './zones/FooterZone';
import { ContentType } from '../types/app-state';

export interface ZonedScreenProps {
  // Header props
  currentStep: number;
  totalSteps: number;
  progressPercent: number;
  status?: 'active' | 'loading' | 'complete';
  
  // Main props
  contentType: ContentType;
  children: React.ReactNode;
  
  // Footer props
  error?: string | null;
  hoveredText?: string;
  helpText?: string;
  
  // Global
  disableAnimations?: boolean;
}

export function ZonedScreen({
  currentStep,
  totalSteps,
  progressPercent,
  status = 'active',
  contentType,
  children,
  error,
  hoveredText,
  helpText,
  disableAnimations = false,
}: ZonedScreenProps) {
  // Build footer messages with priority system
  const messages: FooterMessage[] = [];
  
  if (error) {
    messages.push(createFooterMessage('error', error, 100));
  }
  
  if (hoveredText && !error) {
    messages.push(createFooterMessage('hover', hoveredText, 30));
  }
  
  if (helpText && !error && !hoveredText) {
    messages.push(createFooterMessage('help', helpText, 10));
  }

  return (
    <div className="zoned-screen-container space-y-6 h-full flex flex-col">
      <HeaderZone
        currentStep={currentStep}
        totalSteps={totalSteps}
        progressPercent={progressPercent}
        status={status}
        disableAnimations={disableAnimations}
      />
      
      <MainZone
        contentType={contentType}
        disableAnimations={disableAnimations}
      >
        {children}
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
