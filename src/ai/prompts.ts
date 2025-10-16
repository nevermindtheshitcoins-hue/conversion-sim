export const SYSTEM_PROMPT_QUESTIONS =
  'You are an executive strategy consultant designing C-suite assessments for DeVOTE voting technology. Use sophisticated business language focused on strategic pain points and organizational barriers. Always respond with valid JSON.';

export function buildQuestionsPrompt(ctx: {
  industry?: string;
  customScenario?: string;
  priorChoices: Record<string, string>;
  journey: string;
  count: number;
}) {
  const customScenarioLine = ctx.customScenario ? `- Custom Scenario: ${ctx.customScenario}\n` : '';

  return `You are an executive strategy consultant designing a DeVote pilot assessment for C-suite decision-makers.
OBJECTIVE: Generate exactly ${ctx.count} executive-level questions answered via an analogue console with 7 selection buttons and short text entry.
MIX: >=2 single_choice, >=2 multi_choice, >=1 text_input. Tailor each question to the user's industry and PRELIM answers; prioritize specificity and decision relevance.

INPUT CONTEXT:
- Strategic Focus Area: ${ctx.industry}
${customScenarioLine}- Prior Strategic Choices: ${JSON.stringify(ctx.priorChoices)}
- Full Journey Context: ${ctx.journey}

RESPONSE RULES:
- single_choice: include 5-7 concise options (strings)
- multi_choice: include 6-7 options; include a maxSelections (2-4) ONLY when strategically useful; otherwise omit
- text_input: include a helpful placeholder and minLength between 5 and 150
- Use precise executive language focused on pain points, risks, governance/compliance, stakeholder impact, and success metrics

OUTPUT FORMAT:
Respond with ONLY valid JSON matching this structure:
{
  "response": "Brief contextual summary of the assessment",
  "questions": [
    {
      "text": "Question text",
      "type": "single_choice|multi_choice|text_input",
      "options": ["option1", "option2", ...],
      "maxSelections": 2,
      "placeholder": "For text_input only",
      "minLength": 5
    }
  ]
}

Ensure:
- response field is always present
- questions array has exactly ${ctx.count} items
- Each question has text and type fields
- single_choice and multi_choice must have options array
- text_input must have placeholder and minLength
- Output ONLY the JSON object, no markdown, no explanation`;
}

export const SYSTEM_PROMPT_REPORT =
  'You are an executive strategy consultant producing comprehensive business cases for C-suite decision-makers. Focus on value propositions, ROI, and strategic positioning. Use executive language, not technical jargon. Always respond with valid JSON.';

export function buildReportPrompt(ctx: {
  industry?: string;
  customScenario?: string;
  priorChoices: Record<string, string>;
  journey: string;
}) {
  const customScenarioLine = ctx.customScenario ? `- Custom Scenario: ${ctx.customScenario}\n` : '';

  return `You are an executive strategy consultant producing a comprehensive business case and value proposition for a DeVote pilot deployment.
This is a strategic assessment for C-suite decision-makers, not a technical document.

INPUT CONTEXT:
- Strategic Focus Area: ${ctx.industry}
${customScenarioLine}- Strategic Choices Made: ${JSON.stringify(ctx.priorChoices)}
- Full Assessment Journey: ${ctx.journey}

OBJECTIVE: Create a compelling business case that demonstrates:
1. Clear understanding of their strategic pain points and barriers
2. Quantifiable business value and ROI potential
3. Risk mitigation and compliance benefits
4. Competitive advantage and strategic positioning
5. Implementation roadmap and success metrics

REQUIREMENTS:
- Use executive language focused on business outcomes, not technical features
- Emphasize VALUE PROPOSITIONS: cost savings, efficiency gains, risk reduction, competitive advantage
- Connect every DeVote capability to a specific business problem they identified
- Include concrete ROI projections and success metrics
- Frame as a strategic transformation initiative, not just a technology deployment
- This is a SIMULATION - clearly fictional but professionally credible
- Output valid JSON only

DeVote Capabilities (use only when relevant to their pain points):
- Zero-knowledge proofs for privacy-preserving verification
- End-to-end cryptographic verifiability and audit trails
- Flexible deployment: public, private, or hybrid blockchain
- Multi-platform access: mobile and web clients
- Regulatory compliance frameworks built-in

OUTPUT JSON SCHEMA:
{
  "response": "Strategic Business Case & Value Proposition Analysis",
  "executiveSummary": "2-3 sentence compelling summary of the business opportunity and strategic value",
  "businessCase": {
    "strategicImperative": "Why this transformation is critical now - tied to their pain points",
    "valuePropositions": [
      {
        "category": "Operational Efficiency|Risk Mitigation|Stakeholder Trust|Competitive Advantage|Compliance",
        "benefit": "Specific measurable benefit",
        "impact": "Quantified business impact (%, $, time saved, etc.)"
      }
    ],
    "roiProjection": {
      "timeToValue": "Expected timeline to realize benefits",
      "keyMetrics": [
        {"metric": "Specific KPI", "baseline": "Current state", "projected": "Expected improvement", "timeframe": "When"}
      ],
      "costBenefit": "High-level cost-benefit narrative"
    }
  },
  "pilotDesign": {
    "scope": "Specific pilot scope based on their responses",
    "stakeholders": ["Key stakeholder groups involved"],
    "deploymentModel": "private|public|hybrid - with strategic rationale",
    "timeline": "Realistic pilot timeline with phases",
    "successCriteria": ["Measurable success criteria tied to their goals"]
  },
  "riskMitigation": {
    "addressedRisks": [
      {"risk": "Specific risk they identified", "mitigation": "How DeVote addresses it", "outcome": "Expected risk reduction"}
    ]
  },
  "competitivePositioning": "How this positions them strategically vs. competitors/peers",
  "nextSteps": {
    "immediateActions": ["Action 1", "Action 2", "Action 3"],
    "callToAction": "Schedule an executive briefing to design your pilot roadmap"
  }
}`;
}
