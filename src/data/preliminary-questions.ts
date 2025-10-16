// src/data/preliminary-questions.ts
// Centralized preliminary questions data separated from screen configuration

export interface PrelimQuestionOption {
  id: string;
  label: string;
  q3?: {
    id: string;
    question: string;
    multiSelect: boolean;
    maxSelections: number;
    options: Array<{
      id: string;
      label: string;
    }>;
  };
}

export interface IndustryPrelimData {
  [key: string]: {
    PRELIM_2: {
      title: string;
      subtitle?: string;
      options: string[];
      context: string;
      multiSelect?: boolean;
      maxSelections?: number;
      aiGenerated?: boolean;
      industryBased?: boolean;
      textInput?: boolean;
    };
    PRELIM_3: {
      title: string;
      subtitle?: string;
      options: string[];
      context: string;
      multiSelect?: boolean;
      maxSelections?: number;
      aiGenerated?: boolean;
      industryBased?: boolean;
      textInput?: boolean;
    };
    [key: string]: {
      title: string;
      subtitle?: string;
      options: string[];
      context: string;
      multiSelect?: boolean;
      maxSelections?: number;
      aiGenerated?: boolean;
      industryBased?: boolean;
      textInput?: boolean;
    };
  };
}

export interface BasePrelimData {
  PRELIM_1: {
    title: string;
    subtitle?: string;
    options: string[];
    context: string;
    multiSelect?: boolean;
    maxSelections?: number;
    aiGenerated?: boolean;
    industryBased?: boolean;
    textInput?: boolean;
  };
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

export const BASE_PRELIM_QUESTIONS: BasePrelimData = {
  PRELIM_1: {
    title: 'Select Your Strategic Focus Area',
    subtitle: 'Choose the domain that best aligns with your organization\'s priorities',
    options: [...INDUSTRIES],
    context: 'Strategic focus area identification for executive-level assessment',
  },
};

export const INDUSTRY_PRELIM_QUESTIONS: IndustryPrelimData = {
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
  'Healthcare & Clinical Research': {
    PRELIM_2: {
      title: "Which healthcare segment defines your primary focus?",
      options: [
        'Clinical research & trials',
        'Hospital & health system operations',
        'Pharmaceutical & life sciences',
        'Healthcare compliance & regulatory',
        'Medical device & diagnostics',
      ],
      context: 'Healthcare segment identification for specialized assessment.',
      industryBased: true,
    },
    PRELIM_3: {
      title: "What's your primary strategic barrier to success?",
      options: [
        'Patient recruitment & retention challenges',
        'Regulatory compliance & FDA requirements',
        'Clinical data management & quality',
        'Healthcare cost & reimbursement pressures',
        'Digital transformation & interoperability',
      ],
      context: 'Healthcare-specific strategic pain points for executive guidance.',
      industryBased: true,
    },
  },
  'Supply Chain & Regulatory Compliance': {
    PRELIM_2: {
      title: "Which role best describes your involvement?",
      options: [
        'Supply-chain manager / logistics coord',
        'Procurement / sourcing',
        'Quality / compliance',
        'Warehouse / operations',
        'Transportation / logistics',
        'Inventory / demand planning',
        'Regulatory / traceability',
      ],
      context: 'Role-based assessment for supply chain and regulatory compliance.',
      industryBased: true,
    },
    PRELIM_3: {
      title: "Select up to 3 pains in end-to-end flow",
      subtitle: "Multi-select up to 3 priority areas",
      options: [
        'Long lead times',
        'Supplier risk',
        'Low visibility',
        'Cost volatility',
        'Demand swings',
      ],
      context: 'Supply chain pain point identification for targeted improvements.',
      industryBased: true,
      multiSelect: true,
      maxSelections: 3,
    },
    // Additional role-specific PRELIM_3 questions
    'supply_chain_regcom_q2': {
      title: "Select up to 3 pains in end-to-end flow",
      options: [
        'Long lead times',
        'Supplier risk',
        'Low visibility',
        'Cost volatility',
        'Demand swings',
      ],
      context: 'Supply chain manager pain points.',
      industryBased: true,
      multiSelect: true,
      maxSelections: 3,
    },
    'sc_q3_procure': {
      title: "Select up to 3 pains in sourcing",
      options: [
        'Vendor discovery',
        'Contract cycle',
        'Price volatility',
        'ESG/compliance vetting',
        'Maverick spend',
      ],
      context: 'Procurement and sourcing pain points.',
      industryBased: true,
      multiSelect: true,
      maxSelections: 3,
    },
    'sc_q3_quality': {
      title: "Select up to 3 pains in QA/RA",
      options: [
        'Nonconformance',
        'CAPA backlog',
        'Audit ready',
        'Change control',
        'Doc gaps',
      ],
      context: 'Quality and compliance pain points.',
      industryBased: true,
      multiSelect: true,
      maxSelections: 3,
    },
    'sc_q3_wh': {
      title: "Select up to 3 pains in DC ops",
      options: [
        'Pick/pack errors',
        'Space/slotting',
        'Labor shortage',
        'WMS integrations',
        'Returns handling',
      ],
      context: 'Warehouse operations pain points.',
      industryBased: true,
      multiSelect: true,
      maxSelections: 3,
    },
    'sc_q3_transport': {
      title: "Select up to 3 pains in freight",
      options: [
        'Capacity constraints',
        'Rate spikes',
        'On-time perf',
        'Tracking gaps',
        'Customs/clearance',
      ],
      context: 'Transportation and logistics pain points.',
      industryBased: true,
      multiSelect: true,
      maxSelections: 3,
    },
    'sc_q3_planning': {
      title: "Select up to 3 pains in planning",
      options: [
        'Forecast error',
        'Stockouts',
        'Overstock',
        'Master data',
        'S&OP cadence',
      ],
      context: 'Inventory and demand planning pain points.',
      industryBased: true,
      multiSelect: true,
      maxSelections: 3,
    },
    'sc_q3_regtrace': {
      title: "Select up to 3 pains in compliance",
      options: [
        'Lot/batch tracking',
        'CoC/CoA capture',
        'Recall readiness',
        'Labeling rules',
        'Jurisdiction variance',
      ],
      context: 'Regulatory and traceability pain points.',
      industryBased: true,
      multiSelect: true,
      maxSelections: 3,
    },
  },
  'Corporate Governance & Board Decisions': {
    PRELIM_2: {
      title: "Which governance area requires strategic focus?",
      options: [
        'Board composition & diversity',
        'Executive compensation & incentives',
        'Risk oversight & management',
        'Shareholder engagement & activism',
        'ESG & sustainability governance',
      ],
      context: 'Corporate governance focus area identification.',
      industryBased: true,
    },
    PRELIM_3: {
      title: "What's your primary strategic barrier to success?",
      options: [
        'Board effectiveness & decision quality',
        'Regulatory compliance & reporting',
        'Stakeholder confidence & trust',
        'Strategic risk management',
        'Digital governance & cybersecurity',
      ],
      context: 'Corporate governance strategic challenges.',
      industryBased: true,
    },
  },
  'Education & Academic Institutions': {
    PRELIM_2: {
      title: "Which educational segment defines your primary focus?",
      options: [
        'K-12 public education',
        'Higher education & universities',
        'Professional development & training',
        'Educational technology & platforms',
        'Academic research & publishing',
      ],
      context: 'Educational segment identification for specialized assessment.',
      industryBased: true,
    },
    PRELIM_3: {
      title: "What's your primary strategic barrier to success?",
      options: [
        'Student enrollment & retention',
        'Educational quality & outcomes',
        'Regulatory compliance & accreditation',
        'Technology adoption & digital learning',
        'Financial sustainability & funding',
      ],
      context: 'Education-specific strategic challenges.',
      industryBased: true,
    },
  },
  'Market Research & Stakeholder Polling': {
    PRELIM_2: {
      title: "Which research methodology drives your strategic priorities?",
      options: [
        'Quantitative surveys & polling',
        'Qualitative research & interviews',
        'Digital analytics & behavioral data',
        'Social media & sentiment analysis',
        'Competitive intelligence & benchmarking',
      ],
      context: 'Research methodology focus for strategic assessment.',
      industryBased: true,
    },
    PRELIM_3: {
      title: "What's your primary strategic barrier to success?",
      options: [
        'Data quality & response rates',
        'Research speed & agility',
        'Stakeholder engagement & participation',
        'Regulatory compliance & privacy',
        'Technology integration & automation',
      ],
      context: 'Market research strategic challenges.',
      industryBased: true,
    },
  },
};