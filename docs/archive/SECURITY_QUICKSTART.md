# API Security Quick Start

## Setup (2 minutes)

### 1. Generate HMAC Secret
```bash
openssl rand -hex 32
```

### 2. Add to Environment
```bash
# .env.local
HMAC_SECRET=<paste-generated-secret-here>
```

### 3. Restart Server
```bash
npm run dev
```

## Usage

### Client-Side (Automatic)
```typescript
import { secureApiCall } from '@/lib/api-client';

// Automatically adds HMAC signature
const response = await secureApiCall('/api/ai-assessment', {
  userJourney: journey,
  requestType: 'generate_report',
});
```

### Manual API Call (Advanced)
```typescript
import { generateSignature, generateNonce } from '@/lib/api-client';

const timestamp = Date.now().toString();
const nonce = generateNonce();
const body = { /* your data */ };
const signature = await generateSignature(timestamp, nonce, body);

const response = await fetch('/api/ai-assessment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-signature': signature,
    'x-timestamp': timestamp,
    'x-nonce': nonce,
  },
  body: JSON.stringify(body),
});
```

## Testing

### Test Rate Limiting
```bash
# Should get 429 after 10 requests
for i in {1..15}; do 
  curl -X POST http://localhost:9002/api/ai-assessment \
    -H "Content-Type: application/json" \
    -d '{"test": true}'
done
```

### Test HMAC Verification
```bash
# Should get 401 if HMAC_SECRET is set
curl -X POST http://localhost:9002/api/ai-assessment \
  -H "Content-Type: application/json" \
  -d '{"userJourney": {}, "requestType": "generate_questions"}'
```

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Invalid request | Check request body format |
| 401 | Auth failed | Check HMAC signature/timestamp |
| 429 | Rate limited | Wait 1 minute, retry |
| 504 | Timeout | Request took >25s, retry |
| 500 | Server error | Check logs |

## Configuration

### Rate Limits
Edit `/src/lib/rate-limiter.ts`:
```typescript
const RATE_LIMIT_TOKENS = 10;      // Max requests
const REFILL_RATE = 1;              // Per minute
```

### Request Timeout
Edit `/src/app/api/ai-assessment/route.ts`:
```typescript
const REQUEST_TIMEOUT_MS = 25000;  // 25 seconds
```

## Troubleshooting

### "Rate limit exceeded"
- Wait 1 minute for token refill
- Increase `RATE_LIMIT_TOKENS` if needed

### "Invalid signature"
- Check `HMAC_SECRET` matches on client/server
- Verify timestamp is current
- Ensure nonce is unique

### "Request timeout"
- Check AI provider API status
- Increase `REQUEST_TIMEOUT_MS` if needed
- Verify network connectivity

## Production Checklist

- [ ] Set `HMAC_SECRET` in production environment
- [ ] Use strong secret (32+ bytes)
- [ ] Monitor rate limit violations
- [ ] Set up alerts for 401/429 responses
- [ ] Rotate secrets every 90 days

## More Info

- Full docs: [SECURITY_IMPLEMENTATION.md](./SECURITY_IMPLEMENTATION.md)
- Changelog: [SECURITY_CHANGELOG.md](./SECURITY_CHANGELOG.md)
