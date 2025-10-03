const ALLOWED_ORIGINS = [
  'https://devoteusa.com',
  'https://www.devoteusa.com',
  process.env.NEXT_PUBLIC_IFRAME_PARENT
].filter(Boolean);

export function isInIframe(): boolean {
  return typeof window !== 'undefined' && window !== window.parent;
}

export function validateParentOrigin(): boolean {
  if (typeof window === 'undefined' || !isInIframe()) return true;
  
  try {
    const parentOrigin = document.referrer ? new URL(document.referrer).origin : '';
    return ALLOWED_ORIGINS.includes(parentOrigin);
  } catch {
    return false;
  }
}

export function sendToParent(type: string, data: any): void {
  if (typeof window === 'undefined' || !isInIframe() || !validateParentOrigin()) return;
  
  const parentOrigin = document.referrer ? new URL(document.referrer).origin : '';
  if (ALLOWED_ORIGINS.includes(parentOrigin)) {
    window.parent.postMessage({ type, data }, parentOrigin);
  }
}

export function copyToClipboard(text: string): void {
  if (typeof window === 'undefined') return;
  
  if (isInIframe()) {
    sendToParent('COPY_TO_CLIPBOARD', { text });
  } else {
    navigator.clipboard?.writeText(text).catch(() => {
      console.warn('Clipboard access denied');
    });
  }
}