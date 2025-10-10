import { ContentType } from '../types/app-state';
import type { AppState } from '../types/app-state';

export function getContentType(state: AppState): ContentType {
  // Report takes precedence
  if (state.isReport) {
    return ContentType.REPORT_VIEW;
  }
  
  // Loading state
  if (state.isLoading && state.aiGenerated) {
    return ContentType.AI_LOADING;
  }
  
  // Text input mode
  if (state.isTextInput) {
    return ContentType.TEXT_INPUT;
  }
  
  // Multi-select mode
  if (state.isMultiSelect) {
    return ContentType.MULTI_CHOICE;
  }
  
  // Industry picker (first screen, single choice)
  if (state.currentScreenIndex === 0) {
    return ContentType.INDUSTRY_PICKER;
  }
  
  // Default to single choice for all other screens
  return ContentType.SINGLE_CHOICE;
}

export function getContentTypeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    [ContentType.INDUSTRY_PICKER]: 'Industry Selection',
    [ContentType.SINGLE_CHOICE]: 'Question',
    [ContentType.MULTI_CHOICE]: 'Multi-Select Question',
    [ContentType.TEXT_INPUT]: 'Text Input',
    [ContentType.AI_LOADING]: 'Generating Questions',
    [ContentType.REPORT_VIEW]: 'Assessment Report',
  };
  return labels[type];
}

export function getZoneAnimations(contentType: ContentType, useFpsBudget: boolean) {
  if (useFpsBudget) {
    return {
      header: { duration: 0, ease: 'linear' },
      main: { duration: 0, ease: 'linear' },
      footer: { duration: 0, ease: 'linear' },
    };
  }

  const animations = {
    [ContentType.INDUSTRY_PICKER]: {
      header: { duration: 300, ease: 'easeOut' },
      main: { duration: 400, ease: 'easeOut' },
      footer: { duration: 200, ease: 'easeIn' },
    },
    [ContentType.SINGLE_CHOICE]: {
      header: { duration: 250, ease: 'easeInOut' },
      main: { duration: 300, ease: 'easeInOut' },
      footer: { duration: 150, ease: 'easeOut' },
    },
    [ContentType.MULTI_CHOICE]: {
      header: { duration: 250, ease: 'easeInOut' },
      main: { duration: 350, ease: 'easeInOut' },
      footer: { duration: 200, ease: 'easeIn' },
    },
    [ContentType.TEXT_INPUT]: {
      header: { duration: 200, ease: 'easeOut' },
      main: { duration: 400, ease: 'easeOut' },
      footer: { duration: 150, ease: 'easeIn' },
    },
    [ContentType.AI_LOADING]: {
      header: { duration: 100, ease: 'linear' },
      main: { duration: 200, ease: 'linear' },
      footer: { duration: 100, ease: 'linear' },
    },
    [ContentType.REPORT_VIEW]: {
      header: { duration: 400, ease: 'easeInOut' },
      main: { duration: 600, ease: 'easeInOut' },
      footer: { duration: 300, ease: 'easeOut' },
    },
  };

  return animations[contentType];
}
