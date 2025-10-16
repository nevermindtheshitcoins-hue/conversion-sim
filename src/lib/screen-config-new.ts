// src/lib/screen-config-new.ts
import {
  BASE_PRELIM_QUESTIONS,
  INDUSTRY_PRELIM_QUESTIONS,
  INDUSTRIES,
  IndustryPrelimData,
  BasePrelimData
} from '../data/preliminary-questions';

export interface ScreenConfig {
  title: string;
  subtitle?: string;
  options: string[];
  context: string;
  multiSelect?: boolean;
  maxSelections?: number;
  aiGenerated?: boolean;
  industryBased?: boolean;
  textInput?: boolean;
}

export const INDUSTRY_BASED_SCREENS: IndustryPrelimData = INDUSTRY_PRELIM_QUESTIONS;

export const BASE_SCREENS: Record<string, ScreenConfig> = {
   PRELIM_1: BASE_PRELIM_QUESTIONS.PRELIM_1,
 };

export function getScreenConfig(screenName: string, industry?: string): ScreenConfig {
  const isIndustryPrelim = screenName === 'PRELIM_2' || screenName === 'PRELIM_3';
  if (isIndustryPrelim) {
    if (!industry) throw new Error(`Industry required for ${screenName}`);
    const industryScreens = INDUSTRY_BASED_SCREENS[industry];
    if (!industryScreens) {
      return {
        title: screenName === 'PRELIM_2' ? "What's your primary strategic objective?" : "What's your most critical organizational challenge?",
        subtitle: screenName === 'PRELIM_2' ? 'Select the area requiring immediate executive attention' : 'Identify the barrier preventing strategic success',
        options: [
          'Accelerated growth & market expansion',
          'Operational excellence & efficiency gains',
          'Stakeholder engagement & acquisition',
          'Organizational governance & management',
          'Digital transformation & technology adoption',
        ],
        context: 'Executive-level strategic assessment',
      };
    }
    const screenConfig = industryScreens[screenName];
    if (!screenConfig) throw new Error(`Screen configuration not found for ${screenName} in industry ${industry}`);
    return screenConfig;
  }
  const config = BASE_SCREENS[screenName];
  if (!config) throw new Error(`Screen configuration not found: ${screenName}`);
  return config;
}
