export interface ScreenConfig {
  title: string;
  subtitle?: string;
  options: string[];
  context: string;
  multiSelect?: boolean;
  maxSelections?: number;
}

export const SCREEN_CONFIGS: Record<string, ScreenConfig> = {
  PRELIM_A: {
    title: "What brings you here today?",
    subtitle: "Select all that apply",
    options: [
      "Looking to improve conversion rates",
      "Need help with lead generation", 
      "Want to optimize user experience",
      "Seeking growth strategies",
      "Exploring new opportunities"
    ],
    context: "Initial visitor intent identification",
    multiSelect: true,
    maxSelections: 3
  },
  PRELIM_B: {
    title: "What's your biggest challenge right now?",
    options: [
      "Lead generation and conversion optimization",
      "Customer retention and engagement issues", 
      "Operational efficiency and workflow problems",
      "Market positioning and competitive challenges",
      "Revenue growth and business scaling"
    ],
    context: "Primary pain point identification",
    multiSelect: true,
    maxSelections: 5
  },
  Q1: {
    title: "How would you describe your current situation?",
    options: [
      "Just getting started, need foundational help",
      "Have some systems but they're not working well",
      "Doing okay but want to optimize and improve", 
      "Successful but looking to scale significantly",
      "Facing specific challenges that need solutions"
    ],
    context: "Business maturity and readiness assessment"
  },
  Q2: {
    title: "What's your primary goal for the next 6 months?",
    options: [
      "Increase revenue by 25% or more",
      "Improve operational efficiency and reduce costs",
      "Launch new products or enter new markets",
      "Build stronger customer relationships and retention",
      "Establish better systems and processes"
    ],
    context: "Short-term objective prioritization"
  },
  Q3: {
    title: "What's been your biggest obstacle to achieving this goal?",
    options: [
      "Limited resources or budget constraints",
      "Lack of expertise or knowledge in key areas",
      "Poor systems or outdated processes",
      "Market competition or external factors",
      "Team capacity or organizational challenges"
    ],
    context: "Barrier identification and constraint analysis",
    multiSelect: true,
    maxSelections: 3
  },
  Q4: {
    title: "How do you typically make decisions about new initiatives?",
    options: [
      "Quick decisions based on gut instinct and experience",
      "Thorough research and analysis before committing",
      "Collaborative team discussions and consensus building",
      "Data-driven approach with metrics and testing",
      "Cautious approach with small pilots and gradual scaling"
    ],
    context: "Decision-making style and process preferences"
  },
  Q5: {
    title: "What would success look like for you?",
    options: [
      "Measurable ROI and clear financial returns",
      "Improved efficiency and streamlined operations",
      "Better customer satisfaction and retention rates",
      "Competitive advantage and market leadership",
      "Sustainable growth and long-term stability"
    ],
    context: "Success criteria and outcome expectations"
  }
};

export function getScreenConfig(screenName: string): ScreenConfig {
  const config = SCREEN_CONFIGS[screenName];
  if (!config) {
    throw new Error(`Screen configuration not found: ${screenName}`);
  }
  return config;
}