import { NextRequest, NextResponse } from 'next/server';
import type { UserJourney } from '../../../lib/journey-tracker';

interface RequestBody {
  userJourney: UserJourney;
  requestType: 'generate_questions' | 'generate_report';
  industry?: string;
  signature: string;
}

function validateRequest(body: any): body is RequestBody {
  return body && 
    body.userJourney && 
    body.requestType && 
    ['generate_questions', 'generate_report'].includes(body.requestType) &&
    body.signature;
}

function validateSignature(data: any, signature: string): boolean {
  const expectedSignature = Buffer.from(JSON.stringify(data)).toString('base64');
  return signature === expectedSignature;
}

async function callOpenAI(prompt: string, requestType: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('Invalid OpenAI API key');
  }

  const maxTokens = requestType === 'generate_report' ? 2500 : 1500;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
          content: requestType === 'generate_questions' 
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
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0]?.message?.content || '{}');
}

async function callGemini(prompt: string, requestType: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Invalid Gemini API key');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${requestType === 'generate_questions' 
            ? 'You design pilot scenarios for DeVOTE voting technology.' 
            : 'You are a newsroom generator producing credible articles about DeVOTE pilot successes.'} Always respond with valid JSON.\n\n${prompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: requestType === 'generate_report' ? 2500 : 1500,
        responseMimeType: 'application/json'
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return JSON.parse(data.candidates[0]?.content?.parts[0]?.text || '{}');
}

function buildPrompt(userJourney: UserJourney, requestType: string, industry?: string): string {
  const journey = userJourney.responses.map(r => 
    `${r.screen}: "${r.buttonText}"`
  ).join('\n');
  
  const priorChoices = userJourney.responses.reduce((acc, r) => {
    acc[r.screen] = r.buttonText;
    return acc;
  }, {} as Record<string, string>);

  if (requestType === 'generate_questions') {
    return `You design pilot-scenario questions for DeVote (privacy-first, verifiable remote voting). 
Goal: produce exactly 4 questions, each with up to 7 options, tailored to the user's context. 
Every answer must later drive a believable fictional news report about a pilot using DeVote.

INPUT VARIABLES:
- industry: ${industry}
- priorChoices: ${JSON.stringify(priorChoices)}
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
- priorChoices: ${JSON.stringify(priorChoices)}
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
    const body = await request.json();
    
    if (!validateRequest(body)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { userJourney, requestType, industry, signature } = body;

    const dataToSign = { userJourney, requestType, industry };
    if (!validateSignature(dataToSign, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const prompt = buildPrompt(userJourney, requestType, industry);
    
    let result;
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
    console.error('AI Assessment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}