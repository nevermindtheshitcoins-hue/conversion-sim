/**
 * Error Handling & Logging Utilities
 * Provides structured error classification, logging, and user-friendly messages
 */


export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  API_ERROR = 'API_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ErrorContext {
  requestId: string;
  timestamp: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  details?: Record<string, unknown> | undefined;
  statusCode?: number | undefined;
  responsePreview?: string | undefined;
  stack?: string | undefined;
}

export interface RequestLog {
  requestId: string;
  timestamp: string;
  endpoint: string;
  method: string;
  requestBody?: Record<string, unknown>;
  responseStatus?: number;
  responseTime?: number;
  error?: ErrorContext;
}

/**
 * Generate unique request ID for tracing
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Classify error type based on error object and status code
 */
export function classifyError(error: unknown, statusCode?: number): ErrorType {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || message.includes('abort')) {
      return ErrorType.TIMEOUT_ERROR;
    }
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorType.NETWORK_ERROR;
    }
    if (message.includes('json') || message.includes('parse')) {
      return ErrorType.PARSING_ERROR;
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION_ERROR;
    }
  }

  if (statusCode) {
    if (statusCode === 429) return ErrorType.RATE_LIMIT_ERROR;
    if (statusCode === 401 || statusCode === 403) return ErrorType.AUTH_ERROR;
    if (statusCode >= 400 && statusCode < 500) return ErrorType.VALIDATION_ERROR;
    if (statusCode >= 500) return ErrorType.API_ERROR;
  }

  return ErrorType.UNKNOWN_ERROR;
}

/**
 * Determine error severity based on type
 */
export function getErrorSeverity(type: ErrorType): ErrorSeverity {
  switch (type) {
    case ErrorType.RATE_LIMIT_ERROR:
    case ErrorType.TIMEOUT_ERROR:
      return ErrorSeverity.MEDIUM;
    case ErrorType.API_ERROR:
    case ErrorType.NETWORK_ERROR:
      return ErrorSeverity.HIGH;
    case ErrorType.AUTH_ERROR:
      return ErrorSeverity.CRITICAL;
    case ErrorType.VALIDATION_ERROR:
    case ErrorType.PARSING_ERROR:
      return ErrorSeverity.LOW;
    default:
      return ErrorSeverity.MEDIUM;
  }
}

/**
 * Generate user-friendly error message
 */
export function getUserFriendlyMessage(type: ErrorType, details?: Record<string, unknown>): string {
  switch (type) {
    case ErrorType.NETWORK_ERROR:
      return 'Unable to connect. Please check your internet connection and try again.';
    case ErrorType.TIMEOUT_ERROR:
      return 'Request took too long. Please try again or check your connection.';
    case ErrorType.RATE_LIMIT_ERROR:
      return 'Too many requests. Please wait a moment and try again.';
    case ErrorType.API_ERROR:
      return 'Service temporarily unavailable. Please try again in a moment.';
    case ErrorType.AUTH_ERROR:
      return 'Authentication failed. Please refresh and try again.';
    case ErrorType.PARSING_ERROR:
      return 'Received invalid response format. Please try again.';
    case ErrorType.VALIDATION_ERROR:
      return 'Invalid request. Please check your input and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

/**
 * Create structured error context
 */
export function createErrorContext(
  error: unknown,
  statusCode?: number,
  responsePreview?: string,
  requestId?: string
): ErrorContext {
  const type = classifyError(error, statusCode);
  const severity = getErrorSeverity(type);
  const message = error instanceof Error ? error.message : String(error);
  const userMessage = getUserFriendlyMessage(type);

  return {
    requestId: requestId || generateRequestId(),
    timestamp: new Date().toISOString(),
    type,
    severity,
    message,
    userMessage,
    statusCode,
    responsePreview,
    stack: error instanceof Error ? error.stack : undefined,
  };
}

/**
 * Format error for console logging
 */
export function formatErrorLog(context: ErrorContext): string {
  return `
❌ ERROR [${context.requestId}]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: ${context.type}
Severity: ${context.severity}
Timestamp: ${context.timestamp}
Message: ${context.message}
${context.statusCode ? `Status Code: ${context.statusCode}` : ''}
${context.responsePreview ? `Response Preview: ${context.responsePreview}` : ''}
${context.stack ? `Stack: ${context.stack}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
}

/**
 * Format request/response log
 */
export function formatRequestLog(log: RequestLog): string {
  return `
📋 REQUEST LOG [${log.requestId}]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Timestamp: ${log.timestamp}
Endpoint: ${log.method} ${log.endpoint}
Response Status: ${log.responseStatus || 'pending'}
Response Time: ${log.responseTime ? `${log.responseTime}ms` : 'N/A'}
${log.error ? `Error: ${log.error.type} - ${log.error.message}` : 'Success'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
}

/**
 * Log error with full context
 */
export function logError(context: ErrorContext): void {
  const formatted = formatErrorLog(context);
  
  if (context.severity === ErrorSeverity.CRITICAL) {
    console.error(formatted);
  } else if (context.severity === ErrorSeverity.HIGH) {
    console.error(formatted);
  } else {
    console.warn(formatted);
  }

  // In production, you might send this to an error tracking service
  if (typeof window !== 'undefined' && window.__errorLog) {
    window.__errorLog.push(context);
  }
}

/**
 * Log request/response cycle
 */
export function logRequest(log: RequestLog): void {
  const formatted = formatRequestLog(log);
  
  if (log.error) {
    console.error(formatted);
  } else {
    console.log(formatted);
  }

  // Store in window for debugging
  if (typeof window !== 'undefined') {
    if (!window.__requestLog) {
      window.__requestLog = [];
    }
    window.__requestLog.push(log);
  }
}

/**
 * Type guard for error context
 */
export function isErrorContext(obj: unknown): obj is ErrorContext {
  if (!obj || typeof obj !== 'object') return false;
  const ctx = obj as Record<string, unknown>;
  return (
    typeof ctx.requestId === 'string' &&
    typeof ctx.timestamp === 'string' &&
    typeof ctx.type === 'string' &&
    typeof ctx.message === 'string'
  );
}

/**
 * Augment window object for error logging
 */
declare global {
  interface Window {
    __errorLog?: ErrorContext[];
    __requestLog?: RequestLog[];
  }
}
