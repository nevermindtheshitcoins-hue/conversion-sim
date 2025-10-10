export async function generateSignature(
  timestamp: string,
  nonce: string,
  body: unknown
): Promise<string> {
  const message = `${timestamp}:${nonce}:${JSON.stringify(body)}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  const secret = process.env.NEXT_PUBLIC_HMAC_SECRET || '';
  if (!secret) return '';
  
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateNonce(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function secureApiCall(
  url: string,
  body: unknown
): Promise<Response> {
  const timestamp = Date.now().toString();
  const nonce = generateNonce();
  const signature = await generateSignature(timestamp, nonce, body);
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (signature) {
    headers['x-signature'] = signature;
    headers['x-timestamp'] = timestamp;
    headers['x-nonce'] = nonce;
  }
  
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}
