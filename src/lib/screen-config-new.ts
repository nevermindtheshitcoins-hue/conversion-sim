// src/lib/screen-config-new.ts
// Screen configuration for assessment flow screens

import { BASE_PRELIM_QUESTIONS, INDUSTRY_PRELIM_QUESTIONS, type BasePrelimData, type IndustryPrelimData } from '../data/preliminary-questions';

export interface ScreenConfig {
  title: string;
  subtitle?: string;
  options: string[];
  context?: string;
  multiSelect?: boolean;
  maxSelections?: number;
  aiGenerated?: boolean;
  industryBased?: boolean;
  textInput?: boolean;
}

export function getScreenConfig(screen: string, industry?: string): ScreenConfig {
  // Handle PRELIM_1 (base question, no industry specific)
  if (screen === 'PRELIM_1') {
  // Debug logging for subtitle type issue
  console.log('getScreenConfig return object:', {
    title: typeof config.title,
    subtitle: typeof config.subtitle,
    subtitleValue: config.subtitle,
    optionsLength: config.options?.length || 0
  });
    const config = BASE_PRELIM_QUESTIONS.PRELIM_1;
    return {
      title: config.title,
      subtitle: config.subtitle,
      options: config.options,
      context: config.context,
      multiSelect: config.multiSelect ?? false,
      maxSelections: config.maxSelections ?? 1,
      aiGenerated: config.aiGenerated ?? false,
      industryBased: config.industryBased ?? false,
      textInput: config.textInput ?? false,
    };
  }

  // Handle PRELIM_2 and PRELIM_3 (industry specific questions)
  if ((screen === 'PRELIM_2' || screen === 'PRELIM_3') && industry) {
    const industryData = INDUSTRY_PRELIM_QUESTIONS[industry as keyof IndustryPrelimData];
    if (industryData && industryData[screen as keyof typeof industryData]) {
      const config = industryData[screen as keyof typeof industryData] as any;
      return {
        title: config.title,
        subtitle: config.subtitle,
        options: config.options,
        context: config.context,
        multiSelect: config.multiSelect ?? false,
        maxSelections: config.maxSelections ?? 1,
        aiGenerated: config.aiGenerated ?? false,
        industryBased: config.industryBased ?? false,
        textInput: config.textInput ?? false,
      };
    }
  }

  // Handle AI generated questions (AIQ1-AIQ5)
  if (screen.startsWith('AIQ')) {
    return {
      title: 'Loading question...',
      subtitle: '',
      options: [],
      multiSelect: false,
      maxSelections: 1,
      aiGenerated: true,
      industryBased: false,
      textInput: false,
    };
  }

  // Handle REPORT screen
  if (screen === 'REPORT') {
    return {
      title: 'Strategic Business Case & Value Proposition',
      subtitle: 'Executive Assessment Report',
      options: [],
      multiSelect: false,
      maxSelections: 1,
      aiGenerated: false,
      industryBased: false,
      textInput: false,
    };
  }

  // Default fallback configuration
  throw new Error(`Unknown screen configuration for: ${screen}${industry ? ` (industry: ${industry})` : ''}`);
}