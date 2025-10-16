'use server';

import type { UserJourney } from '../../lib/journey-tracker';

export interface FullContextOutput {
  response: string;
  questions?: string[];
  reportFactors?: Array<{
    factor: string;
    analysis: string;
    recommendation: string;
  }>;
}

// Client no longer creates a cryptographic signature. Server enforces HMAC.
function createClientTimestamp(): { timestamp: string; nonce: string } {
  const timestamp = Date.now().toString();
  const nonce = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return { timestamp, nonce };
}

function isFullContextOutput(payload: unknown): payload is FullContextOutput {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as FullContextOutput;
  const hasQuestions =
    candidate.questions === undefined ||
    (Array.isArray(candidate.questions) && candidate.questions.every(question => typeof question === 'string'));
  const hasReportFactors =
    candidate.reportFactors === undefined ||
    (Array.isArray(candidate.reportFactors) &&
      candidate.reportFactors.every(
        factor =>
          factor &&
          typeof factor === 'object' &&
          typeof factor.factor === 'string' &&
          typeof factor.analysis === 'string' &&
          typeof factor.recommendation === 'string'
      ));

  return typeof candidate.response === 'string' && hasQuestions && hasReportFactors;
}

async function callAIAssessmentAPI(
  userJourney: UserJourney,
  requestType: string,
  industry?: string
): Promise<FullContextOutput> {
  // Client does not sign payload; server validates request via HMAC.

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const allowedFromEnv = (process.env.NEXT_PUBLIC_ALLOWED_API_HOSTS || '').split(',').map(s => s.trim()).filter(Boolean);
  const allowedHosts = allowedFromEnv.length ? allowedFromEnv : ['localhost', '127.0.0.1', '.vercel.app'];
  const url = new URL('/api/ai-assessment', baseUrl);

  const host = url.hostname;
  const allowed = allowedHosts.some(pattern => {
    if (pattern.startsWith('*.')) {
      const suffix = pattern.slice(1); // '.example.com'
      return host.endsWith(suffix);
    }
    if (pattern.startsWith('.')) {
      return host.endsWith(pattern);
    }
    return host === pattern;
  });

  if (!allowed) {
    throw new Error('Invalid API host');
  }

  const { timestamp, nonce } = createClientTimestamp();
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-timestamp': timestamp,
      'x-nonce': nonce,
    },
    body: JSON.stringify({
      userJourney,
      requestType,
      industry,
      // signature removed; server computes HMAC
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  const data: unknown = await response.json();
  if (!isFullContextOutput(data)) {
    throw new Error('Invalid API response');
  }

  return data;
}


export async function generateQuestionsFromPrelims(
  userJourney: UserJourney,
  industry: string
): Promise<FullContextOutput> {
  return await callAIAssessmentAPI(userJourney, 'generate_questions', industry);
}

export async function generateCustomReport(
  userJourney: UserJourney,
  industry: string
): Promise<FullContextOutput> {
  return await callAIAssessmentAPI(userJourney, 'generate_report', industry);
}
