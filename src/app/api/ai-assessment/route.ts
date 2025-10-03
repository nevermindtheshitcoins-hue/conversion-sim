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

function validateApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('Invalid or missing OpenAI API key');
  }
  return apiKey;
}

function validateSignature(data: any, signature: string): boolean {
  const expectedSignature = Buffer.from(JSON.stringify(data)).toString('base64');
  return signature === expectedSignature;
}

async function callOpenAI(prompt: string, apiKey: string) {
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
          content: 'You are a business assessment AI. Always respond with valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0]?.message?.content || '{}');
}

function buildPrompt(userJourney: UserJourney, requestType: string, industry?: string): string {
  const journey = userJourney.responses.map(r => 
    `${r.screen}: "${r.buttonText}"`
  ).join('\n');

  if (requestType === 'generate_questions') {
    return `Industry: ${industry || 'General Business'}\nUser Journey:\n${journey}\n\nGenerate 5 specific business statements for agreement/disagreement rating.\n\nReturn JSON with:\n- "response": Brief message\n- "questions": Array of 5 statements`;
  }

  return `Industry: ${industry}\nComplete User Journey:\n${journey}\n\nCreate assessment report with 8 factors.\n\nReturn JSON with:\n- "response": Executive summary\n- "reportFactors": Array of 8 objects with factor, analysis, recommendation`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!validateRequest(body)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { userJourney, requestType, industry, signature } = body;

    // Validate signature
    const dataToSign = { userJourney, requestType, industry };
    if (!validateSignature(dataToSign, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const apiKey = validateApiKey();
    const prompt = buildPrompt(userJourney, requestType, industry);
    const result = await callOpenAI(prompt, apiKey);

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Assessment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}