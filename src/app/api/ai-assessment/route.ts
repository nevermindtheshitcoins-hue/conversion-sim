import { NextRequest, NextResponse } from 'next/server';
import type { UserJourney } from '../../../lib/journey-tracker';
import { hmacSign, isRecentTimestamp, consumeNonce } from '../../../lib/security';
import { checkRateLimit } from '../../../lib/rate-limiter';
import { generateRequestId, createErrorContext, logError, logRequest } from '../../../lib/error-utils';
import { isReportData } from '../../../types/report';
import {
  SYSTEM_PROMPT_QUESTIONS,
  SYSTEM_PROMPT_REPORT,
  buildQuestionsPrompt,
  buildReportPrompt,
} from '../../../ai/prompts';

type AIRequestType = 'generate_questions' | 'generate_report';

interface RequestBody {
  userJourney: UserJourney;
  requestType: AIRequestType;
  industry?: string;
  customScenario?: string;
}

interface OpenAIContentPart {
  type?: string;
  text?: string;
  /** fallback for future fields */
  [key: string]: unknown;
}

interface OpenAIChatMessage {
  content?: string | OpenAIContentPart[];
}

interface OpenAIChatCompletion {
  choices?: Array<{
    message?: OpenAIChatMessage;
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

const QUESTION_COUNT = Math.max(1, parseInt(process.env.AI_QUESTION_COUNT || '5', 10));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function assertCondition(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function looksLikeJsonPayload(text: string): boolean {
  if (typeof text !== 'string') {
    return false;
  }
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }
  const firstChar = trimmed.charAt(0);
  const lastChar = trimmed.charAt(trimmed.length - 1);
  return (firstChar === '{' && lastChar === '}') || (firstChar === '[' && lastChar === ']');
}

function sliceJsonFragment(raw: string, open: '{' | '[', close: '}' | ']'): string | null {
  const start = raw.indexOf(open);
  const end = raw.lastIndexOf(close);
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }
  const fragment = raw.slice(start, end + 1).trim();
  return looksLikeJsonPayload(fragment) ? fragment : null;
}

function extractJsonText(rawContent: string): string {
  const trimmed = rawContent.trim();
  if (!trimmed) {
    throw new Error('AI response content is empty');
  }

  if (looksLikeJsonPayload(trimmed)) {
    return trimmed;
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    const candidate = fencedMatch[1]?.trim();
    if (candidate && looksLikeJsonPayload(candidate)) {
      return candidate;
    }
  }

  const objectFragment = sliceJsonFragment(trimmed, '{', '}');
  if (objectFragment) {
    return objectFragment;
  }

  const arrayFragment = sliceJsonFragment(trimmed, '[', ']');
  if (arrayFragment) {
    return arrayFragment;
  }

  throw new Error('AI response did not contain JSON payload');
}

function safeJsonPreview(value: unknown, maxLength = 500): string {
  try {
    const serialized = JSON.stringify(value);
    if (typeof serialized !== 'string') {
      return '';
    }
    return serialized.slice(0, maxLength);
  } catch {
    return '[unserializable]';
  }
}

class AIResponseError extends Error {
  statusCode: number;
  responsePreview: string | undefined;

  constructor(message: string, statusCode = 502, responsePreview?: string) {
    super(message);
    this.name = 'AIResponseError';
    this.statusCode = statusCode;
    this.responsePreview = responsePreview;
  }
}

function getOpenAIContentText(completion: unknown): string {
  assertCondition(isRecord(completion), 'Invalid OpenAI response: expected object payload');
  const { choices } = completion as OpenAIChatCompletion;
  assertCondition(Array.isArray(choices) && choices.length > 0, 'OpenAI response missing choices');

  const firstChoice = choices[0];
  assertCondition(isRecord(firstChoice), 'OpenAI response choice is not an object');

  const message = (firstChoice as { message?: OpenAIChatMessage }).message;
  assertCondition(isRecord(message), 'OpenAI response missing message payload');

  const { content } = message as OpenAIChatMessage;
  let contentText: string | null = null;

  if (typeof content === 'string') {
    contentText = content;
  } else if (Array.isArray(content)) {
    const parts = content as OpenAIContentPart[];
    const textCandidate = parts.find((part) => typeof part?.text === 'string');
    const candidateText = textCandidate?.text;
    if (typeof candidateText === 'string' && candidateText.trim()) {
      contentText = candidateText;
    } else {
      const joined = parts
        .map((part) => (typeof part?.text === 'string' ? part.text : ''))
        .join('')
        .trim();
      if (joined) {
        contentText = joined;
      }
    }
  }

  if (!contentText) {
    const messageWithTools = message as {
      tool_calls?: Array<{ function?: { arguments?: unknown } }>;
      function_call?: { arguments?: unknown };
    };

    const toolCallArgs = messageWithTools.tool_calls?.find(
      (call) => typeof call?.function?.arguments === 'string' && call.function.arguments.trim()
    )?.function?.arguments;

    if (typeof toolCallArgs === 'string' && toolCallArgs.trim()) {
      contentText = toolCallArgs;
    } else if (
      typeof messageWithTools.function_call?.arguments === 'string' &&
      messageWithTools.function_call.arguments.trim()
    ) {
      contentText = messageWithTools.function_call.arguments;
    }
  }

  assertCondition(typeof contentText === 'string' && contentText.trim(), 'No content in OpenAI response');
  return extractJsonText(contentText);
}

function getGeminiContentText(completion: unknown): string {
  assertCondition(isRecord(completion), 'Invalid Gemini response: expected object payload');
  const { candidates } = completion as GeminiResponse;
  assertCondition(Array.isArray(candidates) && candidates.length > 0, 'Gemini response missing candidates');

  const firstCandidate = candidates[0];
  assertCondition(isRecord(firstCandidate), 'Gemini candidate is not an object');

  const candidate = firstCandidate as {
    content?: {
      parts?: Array<{ text?: string }>;
    };
  };
  const content = candidate.content;
  assertCondition(isRecord(content), 'Gemini response missing content payload');

  const parts = content.parts;
  assertCondition(Array.isArray(parts) && parts.length > 0, 'Gemini content missing parts');

  const textPart = parts.find((part) => typeof part?.text === 'string');
  const text = textPart?.text;
  assertCondition(typeof text === 'string' && text.trim(), 'No content in Gemini response');

  return extractJsonText(text);
}

async function callOpenAI(prompt: string, requestType: AIRequestType, signal: AbortSignal): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('🔑 OpenAI API Key check:', {
    hasKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING',
  });
  if (!apiKey || apiKey.length < 20) {
    throw new Error('Invalid OpenAI API key');
  }

  const maxTokens = requestType === 'generate_report' ? 2500 : 1500;
  const systemPrompt = requestType === 'generate_questions' ? SYSTEM_PROMPT_QUESTIONS : SYSTEM_PROMPT_REPORT;
  const responseFormat =
    requestType === 'generate_questions'
      ? {
          type: 'json_schema' as const,
          json_schema: {
            name: 'question_set',
            strict: false,
            schema: {
              type: 'object',
              properties: {
                response: { type: 'string' },
                questions: {
                  type: 'array',
                  minItems: QUESTION_COUNT,
                  maxItems: QUESTION_COUNT,
                  items: {
                    type: 'object',
                    properties: {
                      text: { type: 'string' },
                      type: { type: 'string', enum: ['single_choice', 'multi_choice', 'text_input'] },
                      options: { type: 'array', items: { type: 'string' } },
                      maxSelections: { type: 'integer', minimum: 1, maximum: 7 },
                      placeholder: { type: 'string' },
                      minLength: { type: 'integer', minimum: 5, maximum: 150 },
                    },
                    required: ['text', 'type'],
                  },
                },
              },
              required: ['response', 'questions'],
            },
          },
        }
      : { type: 'json_object' as const };

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
      response_format: responseFormat,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error('❌ OpenAI API response error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText.substring(0, 500),
    });
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as OpenAIChatCompletion;
  let jsonText: string | null = null;

  try {
    jsonText = getOpenAIContentText(data);
  } catch (extractionError) {
    console.error('❌ OpenAI content extraction failed:', {
      error: extractionError instanceof Error ? extractionError.message : String(extractionError),
      responsePreview: safeJsonPreview(data),
    });
    throw extractionError instanceof Error ? extractionError : new Error('Failed to extract OpenAI content');
  }

  console.log('📦 OpenAI response structure:', {
    hasChoices: !!data.choices,
    choicesLength: data.choices?.length || 0,
    hasMessage: !!data.choices?.[0]?.message,
    hasContent: typeof jsonText === 'string' && jsonText.trim().length > 0,
    contentLength: jsonText?.length || 0,
  });

  assertCondition(typeof jsonText === 'string' && jsonText.trim(), 'No content in OpenAI response');

  try {
    return JSON.parse(jsonText);
  } catch (jsonError) {
    console.error('❌ Failed to parse OpenAI JSON response:', {
      error: jsonError instanceof Error ? jsonError.message : String(jsonError),
      contentPreview: typeof jsonText === 'string' ? jsonText.substring(0, 200) : null,
    });
    throw new Error('Invalid JSON in OpenAI response');
  }
}

async function callGemini(prompt: string, requestType: AIRequestType, signal: AbortSignal): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('🔑 Gemini API Key check:', {
    hasKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING',
  });
  if (!apiKey || apiKey.length < 20) {
    throw new Error('Invalid Gemini API key');
  }

  const systemPrompt = requestType === 'generate_questions' ? SYSTEM_PROMPT_QUESTIONS : SYSTEM_PROMPT_REPORT;
  const allowedBaseUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
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
              text: `${systemPrompt}\n\n${prompt}`,
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
    console.error('❌ Gemini API response error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText.substring(0, 500),
    });
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as GeminiResponse;
  let jsonText: string | null = null;

  try {
    jsonText = getGeminiContentText(data);
  } catch (extractionError) {
    console.error('❌ Gemini content extraction failed:', {
      error: extractionError instanceof Error ? extractionError.message : String(extractionError),
      responsePreview: safeJsonPreview(data),
    });
    throw extractionError instanceof Error ? extractionError : new Error('Failed to extract Gemini content');
  }

  console.log('📦 Gemini response structure:', {
    hasCandidates: !!data.candidates,
    candidatesLength: data.candidates?.length || 0,
    hasContent: !!data.candidates?.[0]?.content,
    hasParts: !!data.candidates?.[0]?.content?.parts,
    hasText: typeof jsonText === 'string' && jsonText.trim().length > 0,
    textLength: jsonText?.length || 0,
  });

  assertCondition(typeof jsonText === 'string' && jsonText.trim(), 'No content in Gemini response');

  try {
    return JSON.parse(jsonText);
  } catch (parseError) {
    console.error('❌ Failed to parse Gemini JSON response:', {
      error: parseError instanceof Error ? parseError.message : String(parseError),
      textPreview: typeof jsonText === 'string' ? jsonText.substring(0, 200) : null,
    });
    throw parseError;
  }
}

const REQUEST_TIMEOUT_MS = 35000;

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  console.log(`🚀 AI Assessment API called [${requestId}]`);
  console.log('Environment check:', {
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasGemini: !!process.env.GEMINI_API_KEY,
    openAIKeyLength: process.env.OPENAI_API_KEY?.length || 0,
    geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
  });

  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    if (!checkRateLimit(clientIp)) {
      const errorCtx = createErrorContext(
        new Error('Rate limit exceeded'),
        429,
        undefined,
        requestId
      );
      logError(errorCtx);
      logRequest({
        requestId,
        timestamp: new Date().toISOString(),
        endpoint: '/api/ai-assessment',
        method: 'POST',
        responseStatus: 429,
        responseTime: Date.now() - startTime,
        error: errorCtx,
      });
      return NextResponse.json(
        { error: errorCtx.userMessage, requestId },
        { status: 429 }
      );
    }

    const body = (await request.json()) as unknown;

    if (!validateRequestBody(body)) {
      const errorCtx = createErrorContext(
        new Error('Invalid request body'),
        400,
        JSON.stringify(body).substring(0, 200),
        requestId
      );
      logError(errorCtx);
      return NextResponse.json(
        { error: errorCtx.userMessage, requestId },
        { status: 400 }
      );
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

    const promptContext: {
      priorChoices: Record<string, string>;
      journey: string;
      industry?: string;
      customScenario?: string;
    } = {
      priorChoices,
      journey,
    };

    if (industry !== undefined) {
      promptContext.industry = industry;
    }

    if (customScenario !== undefined) {
      promptContext.customScenario = customScenario;
    }

    const prompt =
      requestType === 'generate_questions'
        ? buildQuestionsPrompt({
            ...promptContext,
            count: QUESTION_COUNT,
          })
        : buildReportPrompt(promptContext);

    let result: unknown;
    type SingleChoiceQuestion = { text: string; type: 'single_choice'; options: string[] };
    type MultiChoiceQuestion = { text: string; type: 'multi_choice'; options: string[]; maxSelections?: number };
    type TextInputQuestion = { text: string; type: 'text_input'; placeholder: string; minLength: number };
    type NormalizedQuestion = SingleChoiceQuestion | MultiChoiceQuestion | TextInputQuestion;
    type NormalizedPayload = { response: string; questions: NormalizedQuestion[] };
    type RawQuestion = {
      text?: unknown;
      type?: unknown;
      options?: unknown;
      maxSelections?: unknown;
      placeholder?: unknown;
      minLength?: unknown;
    };
    type RawPayload = {
      response?: unknown;
      questions?: unknown;
    };
    const ALLOWED_TYPES = new Set<NormalizedQuestion['type']>(['single_choice', 'multi_choice', 'text_input']);

    const toTrimmedString = (value: unknown, label: string): string => {
      assertCondition(typeof value === 'string', `${label} must be a string`);
      const trimmed = value.trim();
      assertCondition(trimmed.length > 0, `${label} cannot be empty`);
      return trimmed;
    };

    const toStringArray = (value: unknown, label: string): string[] => {
      assertCondition(Array.isArray(value), `${label} must be an array`);
      const arr = value.map((entry, idx) => {
        assertCondition(typeof entry === 'string', `${label} item ${idx + 1} must be a string`);
        const trimmed = entry.trim();
        assertCondition(trimmed.length > 0, `${label} item ${idx + 1} cannot be empty`);
        return trimmed;
      });
      assertCondition(arr.length > 0, `${label} must include at least one option`);
      return arr;
    };

    const toOptionalInteger = (value: unknown, label: string): number | undefined => {
      if (value === undefined || value === null) {
        return undefined;
      }
      if (typeof value === 'number') {
        assertCondition(Number.isFinite(value), `${label} must be a finite number`);
        return Math.trunc(value);
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        assertCondition(/^[-+]?\d+$/.test(trimmed), `${label} must be an integer`);
        const parsed = Number.parseInt(trimmed, 10);
        assertCondition(Number.isFinite(parsed), `${label} must be a finite integer`);
        return parsed;
      }
      throw new Error(`${label} must be an integer`);
    };

    function normalizeQuestions(payload: unknown): NormalizedPayload {
      assertCondition(isRecord(payload), 'AI questions payload must be an object');

      const rawPayload = payload as RawPayload;
      const response = toTrimmedString(rawPayload.response, 'questions.response');

      assertCondition(Array.isArray(rawPayload.questions), 'questions.questions must be an array');

      const rawQuestions = rawPayload.questions as RawQuestion[];
      assertCondition(
        rawQuestions.length >= QUESTION_COUNT,
        `Expected at least ${QUESTION_COUNT} questions, received ${rawQuestions.length}`
      );

      const normalizedQuestions: NormalizedQuestion[] = [];

      rawQuestions.slice(0, QUESTION_COUNT).forEach((question, index) => {
        assertCondition(isRecord(question), `Question ${index + 1} must be an object`);

        const text = toTrimmedString(question.text, `Question ${index + 1} text`);
        const type = toTrimmedString(question.type, `Question ${index + 1} type`) as NormalizedQuestion['type'];
        assertCondition(ALLOWED_TYPES.has(type), `Question ${index + 1} type "${type}" is not supported`);

        if (type === 'text_input') {
          const placeholder = toTrimmedString(question.placeholder, `Question ${index + 1} placeholder`);
          const minLength = toOptionalInteger(question.minLength, `Question ${index + 1} minLength`);
          assertCondition(typeof minLength === 'number', `Question ${index + 1} minLength is required`);
          assertCondition(minLength >= 5 && minLength <= 150, `Question ${index + 1} minLength must be between 5-150`);

          normalizedQuestions.push({
            text,
            type,
            placeholder,
            minLength,
          });
          return;
        }

        const options = toStringArray(question.options, `Question ${index + 1} options`).slice(0, 7);
        assertCondition(options.length >= 2, `Question ${index + 1} must include at least two options`);

        if (type === 'multi_choice') {
          const maxSelections = toOptionalInteger(question.maxSelections, `Question ${index + 1} maxSelections`);
          if (maxSelections !== undefined) {
            assertCondition(maxSelections >= 1, `Question ${index + 1} maxSelections must be at least 1`);
            assertCondition(
              maxSelections <= options.length && maxSelections <= 7,
              `Question ${index + 1} maxSelections exceeds available options`
            );
          }

          const normalized: MultiChoiceQuestion = {
            text,
            type,
            options,
          };
          if (maxSelections !== undefined) {
            normalized.maxSelections = maxSelections;
          }

          normalizedQuestions.push(normalized);
          return;
        }

        normalizedQuestions.push({
          text,
          type: 'single_choice',
          options,
        });
      });

      return { response, questions: normalizedQuestions };
    }
    result = await callOpenAI(prompt, requestType, controller.signal);

    console.log('📊 Raw AI response received:', {
      type: typeof result,
      isObject: isRecord(result),
      keys: isRecord(result) ? Object.keys(result as Record<string, unknown>) : 'N/A',
      hasResponse: isRecord(result) && 'response' in (result as Record<string, unknown>),
      hasQuestions: isRecord(result) && 'questions' in (result as Record<string, unknown>),
      preview: safeJsonPreview(result, 300),
    });

    let responseData: unknown;

    if (requestType === 'generate_questions') {
      try {
        responseData = normalizeQuestions(result);
      } catch (validationError) {
        const preview = safeJsonPreview(result);
        console.error('❌ AI questions validation failed:', {
          error: validationError instanceof Error ? validationError.message : String(validationError),
          responsePreview: preview,
        });
        const message =
          validationError instanceof Error
            ? `AI questions validation failed: ${validationError.message}`
            : 'AI questions validation failed';
        throw new AIResponseError(message, 502, preview);
      }
    } else {
      if (!isReportData(result)) {
        const preview = safeJsonPreview(result);
        console.error('❌ AI report validation failed:', {
          responsePreview: preview,
        });
        throw new AIResponseError('AI report validation failed: received invalid report structure', 502, preview);
      }
      responseData = result;
    }
    
    logRequest({
      requestId,
      timestamp: new Date().toISOString(),
      endpoint: '/api/ai-assessment',
      method: 'POST',
      responseStatus: 200,
      responseTime: Date.now() - startTime,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    let statusCode = 500;
    let responsePreview: string | undefined;

    if (error instanceof AIResponseError) {
      statusCode = error.statusCode;
      responsePreview = error.responsePreview ?? error.message.substring(0, 200);
    } else if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('timeout') || message.includes('abort')) {
        statusCode = 504;
      } else if (message.includes('rate limit')) {
        statusCode = 429;
      } else if (message.includes('validation')) {
        statusCode = 400;
      }

      responsePreview = error.message.substring(0, 200);
    }

    const errorCtx = createErrorContext(error, statusCode, responsePreview, requestId);
    logError(errorCtx);
    logRequest({
      requestId,
      timestamp: new Date().toISOString(),
      endpoint: '/api/ai-assessment',
      method: 'POST',
      responseStatus: statusCode,
      responseTime: Date.now() - startTime,
      error: errorCtx,
    });
    
    return NextResponse.json(
      {
        error: errorCtx.userMessage,
        requestId,
        type: errorCtx.type,
      },
      { status: statusCode }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
