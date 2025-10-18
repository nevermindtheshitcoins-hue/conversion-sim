export const microcopyOptions = {
  options: [
    {
      main_header: "Define Your Challenge",
      subline: "DeVOTE has triggered your interest. Specify the problem domain you need to address.",
      prompt_line: "SELECT INDUSTRY OR CUSTOM INPUT > CONFIRM",
      rationale: "Directly states purpose with problem-solving focus while maintaining terminal brevity."
    },
    {
      main_header: "Select Industry Origin",
      subline: "DeVOTE has triggered your interest. Choose your operational domain or define a new use case.",
      prompt_line: "CHOOSE INDUSTRY > CONFIRM",
      rationale: "Prioritizes industry selection with clear system terminology for B2B users."
    },
    {
      main_header: "Start Your Exploration",
      subline: "DeVOTE has triggered your interest. Select an industry or define your unique application.",
      prompt_line: "SELECT STARTING POINT > CONFIRM",
      rationale: "Curiosity-driven language invites engagement while maintaining professional tone."
    },
    {
      main_header: "INPUT SPECIFICATION REQUIRED",
      subline: "DeVOTE has triggered your interest. Designate industry classification or custom parameters.",
      prompt_line: "DEFINE DOMAIN > EXECUTE CONFIRM",
      rationale: "Pure system voice with machine terminology for technical users."
    },
    {
      main_header: "Begin Your Use Case",
      subline: "DeVOTE has triggered your interest. Choose an industry or describe your specific need.",
      prompt_line: "SELECT OR DESCRIBE > CONFIRM INPUT",
      rationale: "Hybrid approach balances human guidance with system precision."
    }
  ],
  notes: [
    "Proposed alternative prompt symbol: '>' (greater than) for stronger terminal aesthetic",
    "Ambiguity risk in 'domain' term offset by UI tooltip explaining industry vs custom options"
  ]
} as const;
