interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, TokenBucket>();

const RATE_LIMIT_TOKENS = 10;
const REFILL_RATE = 1;
const REFILL_INTERVAL_MS = 60000;

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  let bucket = buckets.get(identifier);

  if (!bucket) {
    bucket = { tokens: RATE_LIMIT_TOKENS, lastRefill: now };
    buckets.set(identifier, bucket);
  }

  const elapsed = now - bucket.lastRefill;
  const refillCount = Math.floor(elapsed / REFILL_INTERVAL_MS) * REFILL_RATE;
  
  if (refillCount > 0) {
    bucket.tokens = Math.min(RATE_LIMIT_TOKENS, bucket.tokens + refillCount);
    bucket.lastRefill = now;
  }

  if (bucket.tokens < 1) {
    return false;
  }

  bucket.tokens -= 1;
  return true;
}

export function cleanupExpiredBuckets(): void {
  const now = Date.now();
  const expiryThreshold = 3600000;
  
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill > expiryThreshold) {
      buckets.delete(key);
    }
  }
}

setInterval(cleanupExpiredBuckets, 600000);
