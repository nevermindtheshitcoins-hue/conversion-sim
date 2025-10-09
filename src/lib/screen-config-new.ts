// src/lib/screen-config-new.ts
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

export const INDUSTRIES = [
  'Custom Strategic Initiative',
  'Governance & Public Sector',
  'Healthcare & Clinical Research',
  'Supply Chain & Regulatory Compliance',
  'Corporate Governance & Board Decisions',
  'Education & Academic Institutions',
  'Market Research & Stakeholder Polling',
] as const;

export const INDUSTRY_BASED_SCREENS: Record<string, Record<string, ScreenConfig>> = {
  'Governance & Public Sector': {
    PRELIM_2: {
      title: "Which governance domain drives your strategic priorities?",
      options: [
        'Public elections & civic engagement',
        'Union & labor organization governance',
        'Corporate board & shareholder decisions',
        'Community & HOA governance',
        'Referendums & policy initiatives',
      ],
      context: 'Identify the governance domain for strategic tailoring.',
      industryBased: true,
    },
    PRELIM_3: {
      title: "What's your primary strategic barrier to success?",
      options: [
        'Stakeholder participation & engagement rates',
        'Trust, fraud prevention & integrity assurance',
        'Regulatory compliance & audit readiness',
        'Digital transformation & adoption barriers',
        'Privacy protection & data sovereignty',
      ],
      context: 'Surface strategic pain points to guide executive recommendations.',
      industryBased: true,
    },
  },
  'Custom Strategic Initiative': {
    PRELIM_2: {
      title: 'Describe your strategic initiative or use case',
      subtitle: 'Be specific about the business problem you\'re solving',
      options: [],
      context: 'Custom strategic scenario for DeVOTE pilot simulation.',
      industryBased: true,
      textInput: true,
    },
    PRELIM_3: {
      title: 'What type of decision-making process requires transformation?',
      options: [
        'Strategic governance & board resolutions',
        'Stakeholder consent & approval workflows',
        'Market research & stakeholder polling',
        'Resource allocation & budget prioritization',
        'Risk assessment & compliance attestation',
        'Other strategic process',
      ],
      context: 'Identify the strategic process archetype for tailored recommendations.',
      industryBased: true,
    },
  },
};

export const BASE_SCREENS: Record<string, ScreenConfig> = {
  PRELIM_1: {
    title: 'Select Your Strategic Focus Area',
    subtitle: 'Choose the domain that best aligns with your organization\'s priorities',
    options: [...INDUSTRIES],
    context: 'Strategic focus area identification for executive-level assessment',
  },
  Q4: {
    title: 'AI Generated Question 4',
    options: ['Placeholder'],
    context: 'AI generated based on preliminary responses',
    aiGenerated: true,
  },
  Q5: {
    title: 'AI Generated Question 5',
    options: ['Placeholder'],
    context: 'AI generated based on preliminary responses',
    aiGenerated: true,
  },
  Q6: {
    title: 'AI Generated Question 6',
    options: ['Placeholder'],
    context: 'AI generated based on preliminary responses',
    aiGenerated: true,
  },
  Q7: {
    title: 'AI Generated Question 7',
    options: ['Placeholder'],
    context: 'AI generated based on preliminary responses',
    aiGenerated: true,
  },
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