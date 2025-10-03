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
}

export const INDUSTRIES = [
  "Elections & Governance",
  "Healthcare & Medical Trials",
  "Supply Chain & Compliance",
  "Corporate Decision-Making",
  "Education & Academia",
  "Surveys & Instant Polling",
  "CUSTOM"
] as const;

const DECISION_STYLE_OPTIONS = [
  "Anonymous majority vote",
  "Open majority vote",
  "Consensus / supermajority",
  "Delegated / proxy voting",
  "Weighted voting (e.g., shares/roles)",
  "Advisory poll (non-binding)"
];

const PRIORITY_OUTCOME_OPTIONS = [
  "Trust & transparency (auditability)",
  "Privacy & anonymity",
  "Participation & accessibility",
  "Speed to result",
  "Cost efficiency",
  "Regulatory compliance"
];

export const INDUSTRY_BASED_SCREENS: Record<string, Record<string, ScreenConfig>> = {
  // 1) Elections & Governance
  "Elections & Governance": {
    PRELIM_2: {
      title: "What’s your elections & governance focus?",
      options: [
        "Public elections (government/municipal)",
        "Union or labor-organization elections",
        "Corporate/board & shareholder voting",
        "Community, student or HOA elections",
        "Referendums and ballot initiatives"
      ],
      context: "Identify the election/governance domain for tailoring.",
      industryBased: true
    },
    PRELIM_3: {
      title: "What’s your biggest elections/governance challenge?",
      options: [
        "Voter accessibility & turnout",
        "Preventing fraud & ensuring integrity",
        "Regulatory/audit compliance",
        "Technology adoption & digital literacy",
        "Protecting voter privacy"
      ],
      context: "Surface primary pain points to guide the follow-ups.",
      industryBased: true
    },
    PRELIM_4: {
      title: "How do you prefer to run decisions?",
      options: DECISION_STYLE_OPTIONS,
      context: "Capture decision style to shape workflow assumptions.",
      industryBased: true
    },
    PRELIM_5: {
      title: "What outcome matters most right now?",
      options: PRIORITY_OUTCOME_OPTIONS,
      context: "Prioritize the optimization target for AI generation.",
      industryBased: true
    }
  },

  // 2) Healthcare & Medical Trials
  "Healthcare & Medical Trials": {
    PRELIM_2: {
      title: "What’s your healthcare & trials focus?",
      options: [
        "Clinical-trial data collection",
        "Vaccine tracking / pharmacovigilance",
        "Patient consent & identity",
        "Patient-reported outcomes & surveys",
        "Research data collaboration"
      ],
      context: "Narrow the healthcare workflow being simulated.",
      industryBased: true
    },
    PRELIM_3: {
      title: "What’s your biggest healthcare challenge?",
      options: [
        "Regulatory compliance (HIPAA/GDPR)",
        "Patient recruitment & retention",
        "Data integrity & anonymization",
        "Multi-site coordination",
        "EHR / system integration"
      ],
      context: "Expose constraints for compliant, private processes.",
      industryBased: true
    },
    PRELIM_4: {
      title: "How do you prefer to run decisions?",
      options: DECISION_STYLE_OPTIONS,
      context: "Decision style influences consent & review patterns.",
      industryBased: true
    },
    PRELIM_5: {
      title: "What outcome matters most right now?",
      options: PRIORITY_OUTCOME_OPTIONS,
      context: "Prioritize privacy, auditability, speed, cost or UX.",
      industryBased: true
    }
  },

  // 3) Supply Chain & Compliance
  "Supply Chain & Compliance": {
    PRELIM_2: {
      title: "What’s your supply chain & compliance focus?",
      options: [
        "Product provenance & origin",
        "Chain-of-custody verification",
        "Supplier credential & audit management",
        "Regulatory/ESG reporting",
        "Inventory & logistics monitoring"
      ],
      context: "Determine the traceability/compliance scope.",
      industryBased: true
    },
    PRELIM_3: {
      title: "What’s your biggest supply chain challenge?",
      options: [
        "End-to-end traceability across tiers",
        "Fraud/counterfeiting prevention",
        "ERP/Logistics integration",
        "Meeting import/export & ESG rules",
        "Private data-sharing between partners"
      ],
      context: "Guide zk-proof and audit trail generation needs.",
      industryBased: true
    },
    PRELIM_4: {
      title: "How do you prefer to run decisions?",
      options: DECISION_STYLE_OPTIONS,
      context: "Affects approvals, attestations and dispute flows.",
      industryBased: true
    },
    PRELIM_5: {
      title: "What outcome matters most right now?",
      options: PRIORITY_OUTCOME_OPTIONS,
      context: "Balance privacy, auditability, speed and cost.",
      industryBased: true
    }
  },

  // 4) Corporate Decision-Making
  "Corporate Decision-Making": {
    PRELIM_2: {
      title: "What’s your corporate decision-making focus?",
      options: [
        "Board resolutions",
        "Shareholder meetings & proxy voting",
        "Executive/management committees",
        "Compliance attestations & policies",
        "Stakeholder/ESG engagement"
      ],
      context: "Identify the governance process to simulate.",
      industryBased: true
    },
    PRELIM_3: {
      title: "What’s your biggest corporate challenge?",
      options: [
        "Ensuring transparency & auditability",
        "Secure remote participation",
        "Cross-jurisdiction compliance",
        "Stakeholder engagement & turnout",
        "Integrating with existing systems"
      ],
      context: "Tune workflows for secure, tamper-proof outcomes.",
      industryBased: true
    },
    PRELIM_4: {
      title: "How do you prefer to run decisions?",
      options: DECISION_STYLE_OPTIONS,
      context: "Determines ballot style, weights, and quorum logic.",
      industryBased: true
    },
    PRELIM_5: {
      title: "What outcome matters most right now?",
      options: PRIORITY_OUTCOME_OPTIONS,
      context: "Optimize AI prompts toward the primary objective.",
      industryBased: true
    }
  },

  // 5) Education & Academia
  "Education & Academia": {
    PRELIM_2: {
      title: "What’s your education & academia focus?",
      options: [
        "Course evaluations & feedback",
        "Faculty governance/committee votes",
        "Student government & org elections",
        "Admissions/enrollment decisions",
        "Research data & consent"
      ],
      context: "Clarify the academic decision or survey workflow.",
      industryBased: true
    },
    PRELIM_3: {
      title: "What’s your biggest education challenge?",
      options: [
        "Student privacy & FERPA compliance",
        "Participation & engagement",
        "Accreditation/regulatory requirements",
        "LMS/campus system integration",
        "Preventing duplicate/inauthentic responses"
      ],
      context: "Shape privacy and accessibility trade-offs.",
      industryBased: true
    },
    PRELIM_4: {
      title: "How do you prefer to run decisions?",
      options: DECISION_STYLE_OPTIONS,
      context: "Impacts evaluation anonymity and quorum rules.",
      industryBased: true
    },
    PRELIM_5: {
      title: "What outcome matters most right now?",
      options: PRIORITY_OUTCOME_OPTIONS,
      context: "Prioritize trust, privacy, participation or speed.",
      industryBased: true
    }
  },

  // 6) Surveys & Instant Polling
  "Surveys & Instant Polling": {
    PRELIM_2: {
      title: "What’s your surveys & instant polling focus?",
      options: [
        "Market research & consumer insights",
        "Employee engagement/HR surveys",
        "Event or conference live polling",
        "Community/social polling",
        "Public policy opinion polls"
      ],
      context: "Determine survey/poll type for follow-ups.",
      industryBased: true
    },
    PRELIM_3: {
      title: "What’s your biggest surveys challenge?",
      options: [
        "Reliable & representative responses",
        "Real-time result visibility",
        "Preventing duplicate/fraudulent entries",
        "Designing clear, engaging surveys",
        "Data privacy law compliance"
      ],
      context: "Guide identity, deduplication and UX choices.",
      industryBased: true
    },
    PRELIM_4: {
      title: "How do you prefer to run decisions?",
      options: DECISION_STYLE_OPTIONS,
      context: "Whether results are binding and how they count.",
      industryBased: true
    },
    PRELIM_5: {
      title: "What outcome matters most right now?",
      options: PRIORITY_OUTCOME_OPTIONS,
      context: "Help AI trade off speed vs. trust vs. cost.",
      industryBased: true
    }
  },

  // 7) CUSTOM (meta-path for unknown/novel use cases)
  CUSTOM: {
    PRELIM_2: {
      title: "Which industry best fits your use case?",
      options: [
        "Elections & Governance",
        "Healthcare & Medical Trials",
        "Supply Chain & Compliance",
        "Corporate Decision-Making",
        "Education & Academia",
        "Surveys & Instant Polling",
        "Other (type in)"
      ],
      context: "Establish a closest-fit industry for routing.",
      industryBased: true
    },
    PRELIM_3: {
      title: "What kind of decision/process do you want to simulate?",
      options: [
        "Governance vote / resolution",
        "Consent or approval flow",
        "Survey / poll",
        "Resource allocation / prioritization",
        "Risk or compliance attestation",
        "Other (type in)"
      ],
      context: "Identify the process archetype to tailor logic.",
      industryBased: true
    },
    PRELIM_4: {
      title: "How do you prefer to run decisions?",
      options: DECISION_STYLE_OPTIONS,
      context: "Capture decision style to inform prompts.",
      industryBased: true
    },
    PRELIM_5: {
      title: "What outcome matters most right now?",
      options: PRIORITY_OUTCOME_OPTIONS,
      context: "Set the optimization target for the AI.",
      industryBased: true
    }
  }
};

export const BASE_SCREENS: Record<string, ScreenConfig> = {
  PRELIM_1: {
    title: "What industry are you in?",
    options: [...INDUSTRIES],
    context: "Industry identification for customized assessment"
  },

  // Keep generic AI-generated placeholders; they’ll be replaced by the
  // dynamic question generator using the prelim responses.
  Q6: {
    title: "AI Generated Question 6",
    options: ["Placeholder"],
    context: "AI generated based on preliminary responses",
    aiGenerated: true
  },
  Q7: {
    title: "AI Generated Question 7",
    options: ["Placeholder"],
    context: "AI generated based on preliminary responses",
    aiGenerated: true
  },
  Q8: {
    title: "AI Generated Question 8",
    options: ["Placeholder"],
    context: "AI generated based on preliminary responses",
    aiGenerated: true
  },
  Q9: {
    title: "AI Generated Question 9",
    options: ["Placeholder"],
    context: "AI generated based on preliminary responses",
    aiGenerated: true
  },
  Q10: {
    title: "AI Generated Question 10",
    options: ["Placeholder"],
    context: "AI generated based on preliminary responses",
    aiGenerated: true
  }
};

export function getScreenConfig(screenName: string, industry?: string): ScreenConfig {
  const isIndustryPrelim = screenName === "PRELIM_2" || screenName === "PRELIM_3" || screenName === "PRELIM_4" || screenName === "PRELIM_5";

  if (isIndustryPrelim) {
    if (!industry) throw new Error(`Industry required for ${screenName}`);
    const industryScreens = INDUSTRY_BASED_SCREENS[industry];
    if (!industryScreens) {
      // Fallback to generic
      return {
        title: screenName === "PRELIM_2"
          ? "What’s your primary focus?"
          : screenName === "PRELIM_3"
          ? "What’s your biggest challenge?"
          : screenName === "PRELIM_4"
          ? "How do you prefer to run decisions?"
          : "What outcome matters most right now?",
        options:
          screenName === "PRELIM_4"
            ? DECISION_STYLE_OPTIONS
            : screenName === "PRELIM_5"
            ? PRIORITY_OUTCOME_OPTIONS
            : [
                "Growth and scaling",
                "Operational efficiency",
                "Customer/participant acquisition",
                "Team/committee management",
                "Technology adoption"
              ],
        context: "Generic decision-making assessment"
      };
    }
    const screenConfig = industryScreens[screenName];
    if (!screenConfig) {
      throw new Error(`Screen configuration not found for ${screenName} in industry ${industry}`);
    }
    return screenConfig;
  }

  const config = BASE_SCREENS[screenName];
  if (!config) {
    throw new Error(`Screen configuration not found: ${screenName}`);
  }
  return config;
}
