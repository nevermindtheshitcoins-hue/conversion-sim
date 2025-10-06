import crypto from 'crypto';

export interface SignedHeaders {
  signature: string;
  timestamp: string;
  nonce: string;
}

export function canonicalizePayload(payload: unknown): string {
  // Stable JSON stringify for HMAC
  return JSON.stringify(payload, Object.keys(payload as Record<string, unknown>).sort());
}

export function hmacSign(secret: string, message: string): string {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

export function isRecentTimestamp(tsMillis: number, skewMs = 5 * 60 * 1000): boolean {
  const now = Date.now();
  return Math.abs(now - tsMillis) <= skewMs;
}

// Simple in-memory nonce cache for low-traffic scenarios
const nonceCache = new Map<string, number>();

export function consumeNonce(nonce: string, ttlMs = 5 * 60 * 1000): boolean {
  const now = Date.now();
  // Clear expired entries opportunistically
  for (const [key, exp] of nonceCache) {
    if (exp < now) nonceCache.delete(key);
  }
  if (nonceCache.has(nonce)) return false;
  nonceCache.set(nonce, now + ttlMs);
  return true;
}

export function sanitizeForLog(input: unknown, maxLen = 200): string {
  const s = typeof input === 'string' ? input : JSON.stringify(input);
  return s.replace(/[\r\n\t\u0000-\u001f]+/g, ' ').slice(0, maxLen);
}

