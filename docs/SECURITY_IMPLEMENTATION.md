# API Security Implementation

## Overview
Enhanced security measures for the AI assessment API including HMAC signature verification, rate limiting, and request timeouts.

## Security Features

### 1. HMAC Signature Verification
Prevents request tampering and ensures authenticity.

**Configuration:**
```bash
# Generate a secure secret
openssl rand -hex 32

# Add to .env.local
HMAC_SECRET=your-generated-secret-here
```

**How it works:**
- Client generates signature: `HMAC-SHA256(timestamp:nonce:body)`
- Server validates signature matches expected value
- Timestamp must be within 5 minutes (prevents replay attacks)
- Nonce must be unique (prevents duplicate requests)

**Headers:**
- `x-signature`: HMAC signature
- `x-timestamp`: Unix timestamp in milliseconds
- `x-nonce`: Unique request identifier

### 2. Rate Limiting (Token Bucket)
Prevents API abuse and ensures fair usage.

**Configuration:**
- 10 tokens per bucket (per IP address)
- Refills at 1 token per minute
- Automatic cleanup of expired buckets

**Behavior:**
- Each request consumes 1 token
- Returns 429 status when bucket is empty
- Tokens refill gradually over time

**Customization:**
Edit `/src/lib/rate-limiter.ts`:
```typescript
const RATE_LIMIT_TOKENS = 10;      // Max tokens
const REFILL_RATE = 1;              // Tokens per interval
const REFILL_INTERVAL_MS = 60000;   // 1 minute
```

### 3. Request Timeouts
Prevents resource exhaustion from long-running requests.

**Configuration:**
- Default timeout: 25 seconds
- Uses AbortController for clean cancellation
- Returns 504 status on timeout

**Customization:**
Edit `/src/app/api/ai-assessment/route.ts`:
```typescript
const REQUEST_TIMEOUT_MS = 25000; // 25 seconds
```

## Implementation Details

### Server-Side (API Route)
```typescript
// 1. Rate limiting check
if (!checkRateLimit(clientIp)) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
}

// 2. HMAC verification (if headers present)
if (signature && timestamp && nonce) {
  // Validate timestamp
  if (!isRecentTimestamp(tsNum)) {
    return NextResponse.json({ error: 'Request expired' }, { status: 401 });
  }
  
  // Validate nonce (prevent replay)
  if (!consumeNonce(nonce)) {
    return NextResponse.json({ error: 'Invalid nonce' }, { status: 401 });
  }
  
  // Validate signature
  const expectedSig = hmacSign(secret, message);
  if (signature !== expectedSig) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
}

// 3. Request timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
```

### Client-Side (API Client)
```typescript
import { secureApiCall } from '@/lib/api-client';

// Automatically adds HMAC signature if HMAC_SECRET is configured
const response = await secureApiCall('/api/ai-assessment', {
  userJourney: journey,
  requestType: 'generate_report',
  industry: state.industry,
});
```

## Security Best Practices

### Production Deployment
1. **Always set HMAC_SECRET** in production environment
2. **Use strong secrets** (32+ bytes of random data)
3. **Rotate secrets periodically** (every 90 days recommended)
4. **Monitor rate limit violations** for potential abuse
5. **Set up alerts** for repeated 401/429 responses

### Development
- HMAC verification is optional (works without HMAC_SECRET)
- Rate limiting is always active
- Request timeouts are always enforced

### Testing
```bash
# Test rate limiting
for i in {1..15}; do curl -X POST http://localhost:9002/api/ai-assessment; done

# Test timeout (requires long-running request)
# Adjust REQUEST_TIMEOUT_MS to 1000 for testing

# Test HMAC verification
# Set HMAC_SECRET and make request without signature headers
```

## Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Invalid request | Malformed request body |
| 401 | Request expired | Timestamp too old/new |
| 401 | Invalid nonce | Nonce already used |
| 401 | Invalid signature | HMAC signature mismatch |
| 429 | Rate limit exceeded | Too many requests |
| 504 | Request timeout | Request took too long |
| 500 | Internal server error | Server-side error |

## Monitoring

### Key Metrics
- Rate limit violations per IP
- Average request duration
- Timeout frequency
- HMAC verification failures

### Logging
All security events are logged:
```typescript
console.error('AI Assessment API error:', msg);
console.warn('OpenAI failed, trying Gemini:', openaiError);
```

## Migration Guide

### Existing Deployments
1. Add `HMAC_SECRET` to environment variables
2. Deploy updated code
3. Monitor for any authentication issues
4. Adjust rate limits if needed

### Backward Compatibility
- HMAC verification is optional (graceful degradation)
- Existing clients work without modification
- Add signature headers for enhanced security

## Future Enhancements
- [ ] Distributed rate limiting (Redis)
- [ ] IP whitelist/blacklist
- [ ] Request signing with asymmetric keys
- [ ] API key authentication
- [ ] Request logging and analytics
