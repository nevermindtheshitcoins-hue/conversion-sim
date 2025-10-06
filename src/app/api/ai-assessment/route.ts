import { NextRequest, NextResponse } from 'next/server';
import type { UserJourney } from '../../../lib/journey-tracker';
import crypto from 'crypto';
import { canonicalizePayload, hmacSign, isRecentTimestamp, consumeNonce, sanitizeForLog } from '../../../lib/security';

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

function verifyHmac(req: NextRequest, body: RequestBody): { ok: boolean; code?: string } {
  const secret = process.env.AI_ASSESS_SECRET;
  if (!secret || secret.length < 16) return { ok: false, code: 'secret_missing' };

  const timestamp = req.headers.get('x-timestamp');
  const nonce = req.headers.get('x-nonce');
  const signature = req.headers.get('x-signature');
  if (!timestamp || !nonce || !signature) return { ok: false, code: 'sig_headers_missing' };

  const tsNum = Number(timestamp);
  if (!Number.isFinite(tsNum) || !isRecentTimestamp(tsNum)) return { ok: false, code: 'stale_timestamp' };
  if (!consumeNonce(`${nonce}:${timestamp}`)) return { ok: false, code: 'nonce_reuse' };

  const canonical = canonicalizePayload({
    requestType: body.requestType,
    industry: body.industry ?? null,
    customScenario: body.customScenario ?? null,
    userJourney: body.userJourney,
    timestamp: tsNum,
    nonce,
  });
  const expected = hmacSign(secret, canonical);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return { ok: false, code: 'sig_len' };
  return { ok: crypto.timingSafeEqual(a, b) };
}

async function callOpenAI(prompt: string, requestType: AIRequestType): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    throw new Error('Invalid OpenAI API key');
  }

  const maxTokens = requestType === 'generate_report' ? 2500 : 1500;

  const allowedUrl = 'https://api.openai.com/v1/chat/completions';
  const response = await fetch(allowedUrl, {
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
              ? 'You design pilot scenarios for DeVOTE voting technology. Always respond with valid JSON.'
              : 'You are a newsroom generator producing credible articles about DeVOTE pilot successes. Always respond with valid JSON.',
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

async function callGemini(prompt: string, requestType: AIRequestType): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    throw new Error('Invalid Gemini API key');
  }

  const allowedBaseUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  const response = await fetch(`${allowedBaseUrl}?key=${apiKey}`, {
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
                ? 'You design pilot scenarios for DeVOTE voting technology.'
                : 'You are a newsroom generator producing credible articles about DeVOTE pilot successes.'
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
    return `You design pilot-scenario questions for DeVote (privacy-first, verifiable remote voting). 
Goal: produce exactly 4 questions, each with up to 7 options, tailored to the user's context. 
Every answer must later drive a believable fictional news report about a pilot using DeVote.

INPUT VARIABLES:
- industry: ${industry}
${customScenarioLine}- priorChoices: ${JSON.stringify(priorChoices)}
- journey: ${journey}

REQUIREMENTS:
- Questions must be: (1) specific to ${industry}, (2) actionable, (3) mutually informative.
- Cover: scope, stakeholders/eligibility, integrity & deployment, success metric/timeline.
- Each question includes 3–7 options. Provide diverse, realistic choices.
- No generic business fluff. No advice. No explanations in prose.
- Output valid JSON only.

OUTPUT JSON SCHEMA:
{
  "response": "Please answer these 4 questions to define your ${industry} pilot.",
  "questions": [
    {
      "text": "Question 1 text specific to ${industry}",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6", "Option 7"]
    },
    {
      "text": "Question 2 text specific to ${industry}",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6", "Option 7"]
    },
    {
      "text": "Question 3 text specific to ${industry}",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6", "Option 7"]
    },
    {
      "text": "Question 4 text specific to ${industry}",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6", "Option 7"]
    }
  ]
}`;
  }

  return `You are a newsroom generator producing a credible, third-party style article about a successful pilot of DeVote remote voting in the user's scenario. 
Use every available data point from the entire journey.

INPUT VARIABLES:
- industry: ${industry}
${customScenarioLine}- priorChoices: ${JSON.stringify(priorChoices)}
- journey: ${journey}

MANDATES:
- Weave DeVote specifics only when relevant: anonymity via ZK, end-to-end verifiability, audit trail, hybrid/private/public chain options, mobile/Web client. 
- Include concrete pilot details: scope, stakeholders, integrity controls, deployment model, metrics, timeframe, outcome.
- No claims of real deployments; this is clearly a simulation.
- Output valid JSON only.

OUTPUT JSON SCHEMA:
{
  "response": "Drafting your simulated pilot article…",
  "facts": {
    "pilotScope": "…",
    "stakeholders": ["…"],
    "eligibilityModel": "…",
    "deploymentModel": "private|public|hybrid",
    "integrityControls": ["ZK proofs","on-chain audit","MPC admin", "..."],
    "timeline": "…",
    "kpis": [{"name":"…","baseline":"…","result":"…"}],
    "region": "Not specified"
  },
  "article": {
    "headline": "…",
    "subhead": "…",
    "lede": "…",
    "body": [
      "Para 1 …",
      "Para 2 …",
      "Para 3 …"
    ],
    "quotes": [
      {"attribution":"Organization spokesperson","text":"…"},
      {"attribution":"DeVote representative","text":"…"}
    ],
    "callToAction": "Book a consultation to explore your pilot."
  }
}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;

    if (!validateRequestBody(body)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { userJourney, requestType, industry, customScenario } = body;

    const sig = verifyHmac(request, { userJourney, requestType, industry, customScenario });
    if (!sig.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prompt = buildPrompt(userJourney, requestType, industry, customScenario);

    let result: unknown;
    try {
      result = await callOpenAI(prompt, requestType);
    } catch (openaiError) {
      console.warn('OpenAI failed, trying Gemini:', openaiError);
      try {
        result = await callGemini(prompt, requestType);
      } catch (geminiError) {
        console.error('Both AI providers failed:', { openaiError, geminiError });
        throw new Error('AI generation failed');
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('AI Assessment API error:', sanitizeForLog(msg));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
