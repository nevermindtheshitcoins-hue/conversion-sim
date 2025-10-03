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
  "Technology & Software",
  "Healthcare & Medical",
  "Financial Services",
  "E-commerce & Retail",
  "Manufacturing",
  "Professional Services",
  "Real Estate",
  "Education",
  "Non-profit"
];

export const INDUSTRY_BASED_SCREENS: Record<string, Record<string, ScreenConfig>> = {
  "Technology & Software": {
    PRELIM_2: {
      title: "What's your primary tech focus?",
      options: [
        "SaaS product development",
        "Mobile app development", 
        "Enterprise software solutions",
        "AI/ML implementation",
        "Cloud infrastructure"
      ],
      context: "Technology specialization identification"
    },
    PRELIM_3: {
      title: "What's your biggest tech challenge?",
      options: [
        "Scaling development team",
        "User acquisition and retention",
        "Technical debt management",
        "Security and compliance",
        "Product-market fit"
      ],
      context: "Technology pain point identification"
    }
  },
  "Healthcare & Medical": {
    PRELIM_2: {
      title: "What's your healthcare focus?",
      options: [
        "Patient care delivery",
        "Medical practice management",
        "Healthcare technology",
        "Pharmaceutical services",
        "Medical research"
      ],
      context: "Healthcare specialization identification"
    },
    PRELIM_3: {
      title: "What's your biggest healthcare challenge?",
      options: [
        "Patient engagement and satisfaction",
        "Regulatory compliance",
        "Cost management",
        "Staff retention",
        "Technology integration"
      ],
      context: "Healthcare pain point identification"
    }
  },
  "Financial Services": {
    PRELIM_2: {
      title: "What's your financial services focus?",
      options: [
        "Investment management",
        "Banking and lending",
        "Insurance services",
        "Financial planning",
        "Fintech solutions"
      ],
      context: "Financial services specialization"
    },
    PRELIM_3: {
      title: "What's your biggest financial challenge?",
      options: [
        "Regulatory compliance",
        "Customer acquisition",
        "Risk management",
        "Digital transformation",
        "Market volatility"
      ],
      context: "Financial services pain points"
    }
  },
  "E-commerce & Retail": {
    PRELIM_2: {
      title: "What's your e-commerce focus?",
      options: [
        "Online store optimization",
        "Inventory management",
        "Customer experience",
        "Marketing and advertising",
        "Supply chain logistics"
      ],
      context: "E-commerce specialization identification"
    },
    PRELIM_3: {
      title: "What's your biggest retail challenge?",
      options: [
        "Customer acquisition costs",
        "Inventory turnover",
        "Competition and pricing",
        "Seasonal fluctuations",
        "Technology integration"
      ],
      context: "E-commerce pain point identification"
    }
  },
  "Manufacturing": {
    PRELIM_2: {
      title: "What's your manufacturing focus?",
      options: [
        "Production efficiency",
        "Quality control",
        "Supply chain management",
        "Equipment maintenance",
        "Workforce management"
      ],
      context: "Manufacturing specialization identification"
    },
    PRELIM_3: {
      title: "What's your biggest manufacturing challenge?",
      options: [
        "Production costs",
        "Quality consistency",
        "Equipment downtime",
        "Regulatory compliance",
        "Skilled labor shortage"
      ],
      context: "Manufacturing pain point identification"
    }
  },
  "Professional Services": {
    PRELIM_2: {
      title: "What's your service focus?",
      options: [
        "Client acquisition",
        "Service delivery",
        "Team productivity",
        "Business development",
        "Operational systems"
      ],
      context: "Professional services specialization"
    },
    PRELIM_3: {
      title: "What's your biggest service challenge?",
      options: [
        "Client retention",
        "Project management",
        "Pricing strategy",
        "Resource allocation",
        "Market differentiation"
      ],
      context: "Professional services pain points"
    }
  }
};

export const BASE_SCREENS: Record<string, ScreenConfig> = {
  PRELIM_1: {
    title: "What industry are you in?",
    options: INDUSTRIES,
    context: "Industry identification for customized assessment"
  },
  Q4: {
    title: "AI Generated Question 4",
    options: ["Placeholder"],
    context: "AI generated based on preliminary responses",
    aiGenerated: true
  },
  Q5: {
    title: "AI Generated Question 5", 
    options: ["Placeholder"],
    context: "AI generated based on preliminary responses",
    aiGenerated: true
  },
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
  }
};

export function getScreenConfig(screenName: string, industry?: string): ScreenConfig {
  if (screenName === 'PRELIM_2' || screenName === 'PRELIM_3') {
    if (!industry) throw new Error(`Industry required for ${screenName}`);
    const industryScreens = INDUSTRY_BASED_SCREENS[industry];
    if (!industryScreens) {
      // Fallback to generic
      return {
        title: screenName === 'PRELIM_2' ? "What's your primary focus?" : "What's your biggest challenge?",
        options: [
          "Growth and scaling",
          "Operational efficiency", 
          "Customer acquisition",
          "Team management",
          "Technology adoption"
        ],
        context: "Generic business assessment"
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