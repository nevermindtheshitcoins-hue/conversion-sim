# Error Handling - Quick Start Guide

## Overview

The error handling system is now fully integrated. Errors are automatically caught, classified, logged, and displayed to users with helpful context.

## For Users

### What Changed?

**Before:**
- Errors showed blank screens
- No indication of what went wrong
- No way to get help

**After:**
- Clear error messages
- Request ID for support
- Copy error details button
- Retry button
- Helpful guidance

### If You See an Error

1. **Read the message** - It explains what happened
2. **Note the Request ID** - Share this with support: `[req_...]`
3. **Click Copy Details** - Copies full error context
4. **Click Retry** - Try the operation again
5. **Check your connection** - Network errors often resolve with reconnection

## For Developers

### Testing Error Handling

```bash
# Enable test mode (no real API keys needed)
AI_TEST_MODE=true npm run dev

# Errors will flow through the full error handling pipeline
```

### Debugging Errors

```javascript
// In browser console:

// View all errors
console.log(window.__errorLog);

// View all requests
console.log(window.__requestLog);

// Find specific error
window.__errorLog.find(e => e.requestId === 'req_...');

// Filter by type
window.__errorLog.filter(e => e.type === 'TIMEOUT_ERROR');

// Get latest error
const latest = window.__errorLog[window.__errorLog.length - 1];
console.log(latest.message, latest.userMessage);
```

### Understanding Error Types

| Type | Cause | User Action |
|------|-------|-------------|
| NETWORK_ERROR | No internet | Check connection |
| TIMEOUT_ERROR | Request too slow | Retry or check connection |
| RATE_LIMIT_ERROR | Too many requests | Wait and retry |
| API_ERROR | Server problem | Retry later |
| VALIDATION_ERROR | Invalid input | Check input and retry |
| PARSING_ERROR | Bad response | Retry |
| AUTH_ERROR | Auth failed | Refresh page |

### Adding Error Handling to New Code

```typescript
import { createErrorContext, logError } from '@/lib/error-utils';

try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  // ... process response
} catch (error) {
  const errorCtx = createErrorContext(error, 500);
  logError(errorCtx);
  
  setState(prev => ({
    ...prev,
    error: errorCtx.userMessage,
  }));
}
```

### Request ID Tracing

Every API request gets a unique ID:

```
req_1729123456789_a1b2c3d4
└─ timestamp ──┘ └─ random ─┘
```

This ID flows through:
1. API request header
2. Server logs
3. Error responses
4. Client error state
5. User-facing error message

Use it to correlate client and server logs.

## Error Display Component

The `ErrorDisplayPresenter` component automatically displays when errors occur:

```
┌─────────────────────────────────────┐
│  ⚠️  Error Occurred                  │
├─────────────────────────────────────┤
│  Something went wrong                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Error message here          │   │
│  │ [req_1729123456789_a1b2c3d4]│   │
│  └─────────────────────────────┘   │
│                                     │
│  [Copy Details]  [Retry]            │
│                                     │
│  If the problem persists, please    │
│  try refreshing or contact support  │
│  with your request ID.              │
└─────────────────────────────────────┘
```

## Console Logging

Errors are logged with visual formatting:

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

## API Response Format

### Success

```json
{
  "response": "...",
  "questions": [...],
  "requestId": "req_..."
}
```

### Error

```json
{
  "error": "User-friendly message",
  "requestId": "req_...",
  "type": "TIMEOUT_ERROR"
}
```

## Files to Know

| File | Purpose |
|------|---------|
| `src/lib/error-utils.ts` | Error classification & logging |
| `src/components/presenters/ErrorDisplayPresenter.tsx` | Error UI component |
| `src/app/api/ai-assessment/route.ts` | API error handling |
| `src/lib/api-client.ts` | Client-side error handling |
| `src/hooks/useAssessmentFlow.ts` | Hook error integration |
| `docs/ERROR_HANDLING.md` | Full documentation |

## Common Scenarios

### Network Error
```
User sees: "Unable to connect. Please check your internet connection and try again."
Action: Check WiFi/internet connection, then retry
```

### Timeout Error
```
User sees: "Request took too long. Please try again or check your connection."
Action: Retry or check connection
```

### Rate Limit
```
User sees: "Too many requests. Please wait a moment and try again."
Action: Wait 60 seconds, then retry
```

### Server Error
```
User sees: "Service temporarily unavailable. Please try again in a moment."
Action: Retry in a few moments
```

## Troubleshooting

### Errors not showing?
- Check if error state is being set: `state.error`
- Verify ErrorDisplayPresenter is in PRESENTERS map
- Check content type logic in `getContentType()`

### Request ID not appearing?
- Verify `generateRequestId()` is being called
- Check error message includes request ID
- Look in console for error logs

### Copy button not working?
- Check browser clipboard permissions
- Verify error details are being formatted
- Check for JavaScript errors in console

### Retry button not working?
- Verify `onRetry` prop is passed to presenter
- Check retry handler is defined in parent component
- Ensure state is being reset properly

## Performance Notes

- Error logging is lightweight
- Window storage only keeps errors in memory (cleared on refresh)
- No external requests for error tracking (yet)
- Graceful degradation if logging fails

## Next Steps

1. **Test it**: Enable `AI_TEST_MODE=true` and trigger errors
2. **Monitor**: Check `window.__errorLog` in console
3. **Iterate**: Adjust error messages based on user feedback
4. **Enhance**: Consider adding error tracking service later

## Support

For detailed documentation, see:
- `docs/ERROR_HANDLING.md` - Complete guide
- `docs/ERROR_HANDLING_SUMMARY.md` - Implementation summary
