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
  'Custom Use Case',
  'Governance',
  'Healthcare & Medical Trials',
  'Supply Chain & Compliance',
  'Corporate Decision-Making',
  'Education & Academia',
  'Surveys & Instant Polling',
] as const;

export const INDUSTRY_BASED_SCREENS: Record<string, Record<string, ScreenConfig>> = {
  Governance: {
    PRELIM_2: {
      title: "What's your governance focus?",
      options: [
        'Public elections (government/municipal)',
        'Union or labor-organization elections',
        'Corporate/board & shareholder voting',
        'Community, student or HOA elections',
        'Referendums and ballot initiatives',
      ],
      context: 'Identify the governance domain for tailoring.',
      industryBased: true,
    },
    PRELIM_3: {
      title: "What's your biggest governance challenge?",
      options: [
        'Voter accessibility & turnout',
        'Preventing fraud & ensuring integrity',
        'Regulatory/audit compliance',
        'Technology adoption & digital literacy',
        'Protecting voter privacy',
      ],
      context: 'Surface primary pain points to guide the follow-ups.',
      industryBased: true,
    },
  },
  'Custom Use Case': {
    PRELIM_2: {
      title: 'Describe your scenario',
      options: [],
      context: 'Custom scenario description for DeVOTE pilot simulation.',
      industryBased: true,
      textInput: true,
    },
    PRELIM_3: {
      title: 'What kind of decision/process do you want to simulate?',
      options: [
        'Governance vote / resolution',
        'Consent or approval flow',
        'Survey / poll',
        'Resource allocation / prioritization',
        'Risk or compliance attestation',
        'Other (type in)',
      ],
      context: 'Identify the process archetype to tailor logic.',
      industryBased: true,
    },
  },
};

export const BASE_SCREENS: Record<string, ScreenConfig> = {
  PRELIM_1: {
    title: 'What industry are you in?',
    options: [...INDUSTRIES],
    context: 'Industry identification for customized assessment',
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
        title: screenName === 'PRELIM_2' ? "What's your primary focus?" : "What's your biggest challenge?",
        options: [
          'Growth and scaling',
          'Operational efficiency',
          'Customer/participant acquisition',
          'Team/committee management',
          'Technology adoption',
        ],
        context: 'Generic decision-making assessment',
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