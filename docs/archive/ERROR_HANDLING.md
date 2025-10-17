# Error Handling & UX Implementation Guide

## Overview

This document describes the comprehensive error handling system implemented to make failures visible, actionable, and user-friendly throughout the application.

## Architecture

### 1. Error Classification System (`src/lib/error-utils.ts`)

The error handling system classifies errors into distinct types for appropriate handling:

**Error Types:**
- `NETWORK_ERROR` - Network connectivity issues
- `TIMEOUT_ERROR` - Request timeouts or aborts
- `VALIDATION_ERROR` - Invalid request/response data
- `PARSING_ERROR` - JSON parsing failures
- `API_ERROR` - Server-side errors (5xx)
- `RATE_LIMIT_ERROR` - Rate limiting (429)
- `AUTH_ERROR` - Authentication failures (401/403)
- `UNKNOWN_ERROR` - Unclassified errors

**Error Severity Levels:**
- `LOW` - Validation/parsing errors
- `MEDIUM` - Rate limits, timeouts
- `HIGH` - Network/API errors
- `CRITICAL` - Authentication failures

### 2. Request Tracking

Every API request receives a unique request ID for tracing:

```typescript
// Format: req_<timestamp>_<random>
// Example: req_1729123456789_a1b2c3d4
const requestId = generateRequestId();
```

**Benefits:**
- Correlate client-side errors with server logs
- Provide users with actionable debugging information
- Enable support team to investigate issues

### 3. Structured Error Context

All errors are wrapped in a standardized context:

```typescript
interface ErrorContext {
  requestId: string;           // Unique identifier
  timestamp: string;           // ISO 8601 timestamp
  type: ErrorType;            // Classification
  severity: ErrorSeverity;    // Severity level
  message: string;            // Technical message
  userMessage: string;        // User-friendly message
  statusCode?: number;        // HTTP status if applicable
  responsePreview?: string;   // First 200 chars of response
  stack?: string;             // Stack trace
  details?: Record<string, unknown>;
}
```

## Implementation Details

### API Route Error Handling (`src/app/api/ai-assessment/route.ts`)

**Request Lifecycle:**

```
1. Generate Request ID
2. Start timing
3. Validate request
4. Execute operation
5. Log response (success or failure)
6. Return structured response
```

**Response Format:**

Success:
```json
{
  "response": "...",
  "questions": [...],
  "requestId": "req_..."
}
```

Error:
```json
{
  "error": "User-friendly message",
  "requestId": "req_...",
  "type": "TIMEOUT_ERROR"
}
```

**Error Scenarios Handled:**

- **Rate Limiting (429)**: Returns user message about waiting
- **Timeouts (504)**: Returns message about connection issues
- **Validation (400)**: Returns message about invalid input
- **Server Errors (500)**: Returns generic error with request ID
- **Network Errors**: Caught and classified appropriately

### API Client Enhancement (`src/lib/api-client.ts`)

```typescript
// Enhanced secureApiCall with timeout handling
const response = await secureApiCall(
  '/api/ai-assessment',
  requestBody,
  { timeout: 35000 }  // Optional timeout override
);
```

**Features:**
- Automatic timeout management
- Response time tracking
- Detailed logging of request/response cycle
- Error classification at client level

### Error Display Presenter (`src/components/presenters/ErrorDisplayPresenter.tsx`)

User-friendly error display component with:

- **Visual Hierarchy**: Icon, title, message, details
- **Request ID Display**: Extracted and highlighted
- **Copy Functionality**: Users can copy error details for support
- **Retry Button**: Allows retry of failed operations
- **Helpful Guidance**: Suggests next steps

**Features:**
- Responsive design
- Accessible (ARIA labels)
- Graceful degradation
- Copy-to-clipboard support

### Content Type Integration

Error display is integrated into the content type system:

```typescript
// In getContentType():
if (state.error && !state.isLoading) {
  return ContentType.ERROR_DISPLAY;
}
```

This ensures errors take precedence over loading states and display appropriately.

### Hook Integration (`src/hooks/useAssessmentFlow.ts`)

Error handling in async operations:

```typescript
// loadAIQuestions
try {
  const response = await secureApiCall('/api/ai-assessment', requestBody);
  // ... process response
} catch (error) {
  const message = error instanceof Error ? error.message : 'Failed';
  
  // Extract request ID if available
  const requestIdMatch = message.match(/\[req_[\w_]+\]/);
  const requestId = requestIdMatch ? requestIdMatch[0] : '';
  
  // Format error with context
  const errorDisplay = requestId 
    ? `${message}\n${requestId}`
    : message;
  
  setState(prev => ({
    ...prev,
    isLoading: false,
    error: errorDisplay,
  }));
}
```

## Logging System

### Console Logging

Structured logging with visual indicators:

```
❌ ERROR [req_1729123456789_a1b2c3d4]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: TIMEOUT_ERROR
Severity: MEDIUM
Timestamp: 2024-10-16T22:30:45.123Z
Message: Request timeout after 35000ms
Status Code: 504
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Request Logging

Complete request/response cycle tracking:

```
📋 REQUEST LOG [req_1729123456789_a1b2c3d4]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Timestamp: 2024-10-16T22:30:45.123Z
Endpoint: POST /api/ai-assessment
Response Status: 200
Response Time: 2341ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Window Object Storage

For debugging, logs are stored on window object:

```typescript
// Access in browser console:
window.__errorLog    // Array of ErrorContext objects
window.__requestLog  // Array of RequestLog objects
```

## User-Friendly Messages

Error messages are automatically translated to user-friendly text:

| Error Type | User Message |
|---|---|
| NETWORK_ERROR | "Unable to connect. Please check your internet connection and try again." |
| TIMEOUT_ERROR | "Request took too long. Please try again or check your connection." |
| RATE_LIMIT_ERROR | "Too many requests. Please wait a moment and try again." |
| API_ERROR | "Service temporarily unavailable. Please try again in a moment." |
| AUTH_ERROR | "Authentication failed. Please refresh and try again." |
| PARSING_ERROR | "Received invalid response format. Please try again." |
| VALIDATION_ERROR | "Invalid request. Please check your input and try again." |

## Graceful Degradation

### Partial Results

When possible, the system returns partial results:

```typescript
// In normalizeQuestions():
const safe: NormalizedPayload = { response: '', questions: [] };

// Process questions with fallbacks
for (const question of rawQuestions) {
  // Normalize with defaults
  // Skip invalid questions
  // Continue processing
}

return safe; // Return what we could process
```

### Fallback Behavior

- Invalid questions are skipped, not fatal
- Missing fields use sensible defaults
- Partial data is better than no data

## Testing & Debugging

### Test Mode

Enable test mode without real API keys:

```bash
AI_TEST_MODE=true npm run dev
```

Returns mock data with full error handling pipeline.

### Debug Commands

```typescript
// View all errors
console.log(window.__errorLog);

// View all requests
console.log(window.__requestLog);

// Filter errors by type
window.__errorLog.filter(e => e.type === 'TIMEOUT_ERROR');

// Find errors by request ID
window.__errorLog.find(e => e.requestId === 'req_...');
```

## Best Practices

### For Developers

1. **Always use structured errors**: Use `createErrorContext()` for consistency
2. **Include request IDs**: Pass request ID through error chain
3. **Log at appropriate levels**: Use `logError()` and `logRequest()`
4. **Provide context**: Include relevant data in error details
5. **Test error paths**: Verify error handling works as expected

### For Users

1. **Note the Request ID**: Provided for support inquiries
2. **Check Connection**: Network errors often resolve with reconnection
3. **Wait Before Retry**: Rate limits require waiting
4. **Copy Error Details**: Helps support team investigate

## Integration Checklist

- [x] Error utilities module created
- [x] API route enhanced with error handling
- [x] ErrorDisplay presenter component
- [x] Content type integration
- [x] Hook error handling
- [x] API client timeout management
- [x] Request ID tracking
- [x] User-friendly messages
- [x] Console logging
- [x] Window object storage
- [x] Graceful degradation

## Future Enhancements

1. **Error Tracking Service**: Send errors to Sentry/similar
2. **Error Analytics**: Track error patterns and frequencies
3. **Automatic Retries**: Implement exponential backoff
4. **Error Recovery**: Suggest recovery actions
5. **Offline Support**: Handle offline scenarios gracefully
6. **Error Notifications**: Toast/notification system for errors
