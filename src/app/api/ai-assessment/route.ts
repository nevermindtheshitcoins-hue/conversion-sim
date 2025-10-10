import { NextRequest, NextResponse } from 'next/server';
import type { UserJourney } from '../../../lib/journey-tracker';
import { hmacSign, isRecentTimestamp, consumeNonce } from '../../../lib/security';
import { checkRateLimit } from '../../../lib/rate-limiter';

type AIRequestType = 'generate_questions' | 'generate_report';

interface RequestBody {
  userJourney: UserJourney;
  requestType: AIRequestType;
  industry?: string;
  customScenario?: string;
}

interface OpenAIChatCompletion {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

function isValidRequestType(value: unknown): value is AIRequestType {
  return value === 'generate_questions' || value === 'generate_report';
}

function validateRequestBody(body: unknown): body is RequestBody {
  if (!body || typeof body !== 'object') return false;
  const c = body as Partial<RequestBody>;
  const industryOk = c.industry === undefined || (typeof c.industry === 'string' && c.industry.length <= 120);
  const scenarioOk = c.customScenario === undefined || (typeof c.customScenario === 'string' && c.customScenario.length <= 500);
  return (
    isValidRequestType(c.requestType) &&
    typeof c.userJourney === 'object' && c.userJourney !== null &&
    industryOk && scenarioOk
  );
}

async function callOpenAI(prompt: string, requestType: AIRequestType, signal: AbortSignal): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    throw new Error('Invalid OpenAI API key');
  }

  const maxTokens = requestType === 'generate_report' ? 2500 : 1500;

  const allowedUrl = 'https://api.openai.com/v1/chat/completions';
  const response = await fetch(allowedUrl, {
    signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            requestType === 'generate_questions'
              ? 'You are an executive strategy consultant designing C-suite assessments for DeVOTE voting technology. Use sophisticated business language focused on strategic pain points and organizational barriers. Always respond with valid JSON.'
              : 'You are an executive strategy consultant producing comprehensive business cases for C-suite decision-makers. Focus on value propositions, ROI, and strategic positioning. Use executive language, not technical jargon. Always respond with valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as OpenAIChatCompletion;
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('No content in OpenAI response');
  }
  return JSON.parse(content);
}

async function callGemini(prompt: string, requestType: AIRequestType, signal: AbortSignal): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    throw new Error('Invalid Gemini API key');
  }

  const allowedBaseUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  const response = await fetch(`${allowedBaseUrl}?key=${apiKey}`, {
    signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${requestType === 'generate_questions'
                ? 'You are an executive strategy consultant designing C-suite assessments for DeVOTE voting technology. Use sophisticated business language focused on strategic pain points and organizational barriers.'
                : 'You are an executive strategy consultant producing comprehensive business cases for C-suite decision-makers. Focus on value propositions, ROI, and strategic positioning. Use executive language, not technical jargon.'
              } Always respond with valid JSON.\n\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: requestType === 'generate_report' ? 2500 : 1500,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as GeminiResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('No content in Gemini response');
  }
  return JSON.parse(text);
}

function buildPrompt(
  userJourney: UserJourney,
  requestType: AIRequestType,
  industry?: string,
  customScenario?: string
): string {
  const journey = userJourney.responses
    .map(response => {
      if (response.textInput) {
        return `${response.screen}: "${response.textInput}" (custom text input)`;
      }
      return `${response.screen}: "${response.buttonText}"`;
    })
    .join('\n');

  const priorChoices = userJourney.responses.reduce<Record<string, string>>((accumulator, response) => {
    if (response.textInput) {
      accumulator[response.screen] = response.textInput;
    } else {
      accumulator[response.screen] = response.buttonText;
    }
    return accumulator;
  }, {});

  const customScenarioLine = customScenario ? `- customScenario: ${customScenario}\n` : '';

  if (requestType === 'generate_questions') {
    return `You are an executive strategy consultant designing a DeVote pilot assessment for C-suite decision-makers.
DeVote is a privacy-first, verifiable remote voting platform leveraging zero-knowledge proofs and blockchain technology.

OBJECTIVE: Generate exactly 4 executive-level strategic questions that:
1. Focus on strategic pain points, barriers, and business problems that DeVote can address
2. Use sophisticated, C-suite appropriate language
3. Probe organizational challenges, not just technical requirements
4. Drive toward a compelling business case and ROI narrative

INPUT CONTEXT:
- Strategic Focus Area: ${industry}
${customScenarioLine}- Prior Strategic Choices: ${JSON.stringify(priorChoices)}
- Full Journey Context: ${journey}

QUESTION FRAMEWORK (must cover all 4 areas):
Q1: STRATEGIC PAIN POINT - What critical business problem or organizational barrier needs solving?
Q2: STAKEHOLDER IMPACT - Which stakeholder groups are most affected by current process failures?
Q3: RISK & COMPLIANCE - What governance, security, or regulatory risks require mitigation?
Q4: SUCCESS METRICS - What business outcomes would justify investment in transformation?

REQUIREMENTS:
- Use executive language: "strategic barriers", "organizational challenges", "business impact", "value realization"
- Focus on PROBLEMS and PAIN POINTS, not features or solutions
- Each question must have 5-7 varied, realistic options
- Options should reflect real-world executive concerns and priorities
- Questions must be engaging, varied, and industry-specific to ${industry}
- Avoid generic business jargon - be specific and actionable
- Output valid JSON only

OUTPUT JSON SCHEMA:
{
  "response": "Let's identify the strategic challenges and business imperatives for your ${industry} transformation.",
  "questions": [
    {
      "text": "What is the primary strategic barrier preventing organizational success in your decision-making processes?",
      "options": ["Option 1 - specific pain point", "Option 2 - specific pain point", "Option 3", "Option 4", "Option 5", "Option 6", "Option 7"]
    },
    {
      "text": "Which stakeholder groups experience the greatest friction or trust deficits in current processes?",
      "options": ["Option 1 - stakeholder group + pain", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6"]
    },
    {
      "text": "What governance, security, or compliance risks pose the greatest threat to organizational objectives?",
      "options": ["Option 1 - specific risk", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6"]
    },
    {
      "text": "What business outcomes would demonstrate clear ROI and justify strategic investment?",
      "options": ["Option 1 - measurable outcome", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6", "Option 7"]
    }
  ]
}`;
  }

  return `You are an executive strategy consultant producing a comprehensive business case and value proposition for a DeVote pilot deployment.
This is a strategic assessment for C-suite decision-makers, not a technical document.

INPUT CONTEXT:
- Strategic Focus Area: ${industry}
${customScenarioLine}- Strategic Choices Made: ${JSON.stringify(priorChoices)}
- Full Assessment Journey: ${journey}

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

const REQUEST_TIMEOUT_MS = 25000;

export async function POST(request: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = (await request.json()) as unknown;

    if (!validateRequestBody(body)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const signature = request.headers.get('x-signature');
    const timestamp = request.headers.get('x-timestamp');
    const nonce = request.headers.get('x-nonce');

    if (signature && timestamp && nonce) {
      const secret = process.env.HMAC_SECRET || '';
      if (secret) {
        const tsNum = parseInt(timestamp, 10);
        if (!isRecentTimestamp(tsNum)) {
          return NextResponse.json({ error: 'Request expired' }, { status: 401 });
        }

        if (!consumeNonce(nonce)) {
          return NextResponse.json({ error: 'Invalid nonce' }, { status: 401 });
        }

        const message = `${timestamp}:${nonce}:${JSON.stringify(body)}`;
        const expectedSig = hmacSign(secret, message);
        
        if (signature !== expectedSig) {
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
      }
    }

    const { userJourney, requestType, industry, customScenario } = body;

    const prompt = buildPrompt(userJourney, requestType, industry, customScenario);

    let result: unknown;
    try {
      result = await callOpenAI(prompt, requestType, controller.signal);
    } catch (openaiError) {
      if (controller.signal.aborted) {
        throw new Error('Request timeout');
      }
      console.warn('OpenAI failed, trying Gemini:', openaiError);
      try {
        result = await callGemini(prompt, requestType, controller.signal);
      } catch (geminiError) {
        if (controller.signal.aborted) {
          throw new Error('Request timeout');
        }
        console.error('Both AI providers failed:', { openaiError, geminiError });
        throw new Error('AI generation failed');
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('AI Assessment API error:', msg);
    
    if (msg === 'Request timeout') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    clearTimeout(timeoutId);
  }
}
