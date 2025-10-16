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
  body: unknown,
  options?: { timeout?: number }
): Promise<Response> {
  const callStartTime = Date.now();
  console.log('📡 secureApiCall started:', { url, hasBody: !!body, timeout: options?.timeout });

  const timestamp = Date.now().toString();
  const nonce = generateNonce();
  const signature = await generateSignature(timestamp, nonce, body);

  console.log('🔐 API call details:', {
    url,
    timestamp,
    nonce: nonce.substring(0, 8) + '...',
    hasSignature: !!signature,
    bodySize: JSON.stringify(body).length
  });
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (signature) {
    headers['x-signature'] = signature;
    headers['x-timestamp'] = timestamp;
    headers['x-nonce'] = nonce;
  }
  
  try {
    const controller = new AbortController();
    const timeoutMs = options?.timeout || 35000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - callStartTime;
    
    console.log('📡 API call completed:', {
      url,
      status: response.status,
      responseTime: `${responseTime}ms`,
      ok: response.ok,
    });
    
    return response;
  } catch (error) {
    const responseTime = Date.now() - callStartTime;
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    console.error('❌ API call failed:', {
      url,
      error: errorMsg,
      responseTime: `${responseTime}ms`,
      isTimeout: errorMsg.includes('abort'),
    });
    
    throw error;
  }
}
