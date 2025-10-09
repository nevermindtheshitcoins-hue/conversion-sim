export interface UserResponse {
  screen: string;
  buttonNumber: number;
  buttonText: string;
  timestamp: number;
  textInput?: string;
}

export interface UserJourney {
  sessionId: string;
  responses: UserResponse[];
  metadata: {
    startTime: number;
    currentScreen: string;
    totalScreens: number;
  };
}

export class JourneyTracker {
  private sessionId: string;
  private responses: UserResponse[] = [];
  private startTime: number;

  constructor() {
    this.sessionId = generateSessionId();
    this.startTime = Date.now();
  }

  addResponse(screen: string, buttonNumber: number, buttonText: string, textInput?: string) {
    this.responses.push({
      screen,
      buttonNumber,
      buttonText,
      timestamp: Date.now(),
      textInput
    });
  }

  getFullContext(currentScreen: string): UserJourney {
    return {
      sessionId: this.sessionId,
      responses: this.responses,
      metadata: {
        startTime: this.startTime,
        currentScreen,
        totalScreens: this.responses.length + 1
      }
    };
  }

  getLastResponse(): UserResponse | null {
    return this.responses[this.responses.length - 1] || null;
  }

  clear() {
    this.responses = [];
    this.sessionId = generateSessionId();
    this.startTime = Date.now();
  }
}

function generateSessionId(): string {
  const globalCrypto = typeof globalThis !== 'undefined' ? (globalThis.crypto ?? undefined) : undefined;

  if (globalCrypto?.randomUUID) {
    return globalCrypto.randomUUID();
  }

  if (globalCrypto?.getRandomValues) {
    const bytes = globalCrypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0'));
    return (
      hex.slice(0, 4).join('') +
      '-' + hex.slice(4, 6).join('') +
      '-' + hex.slice(6, 8).join('') +
      '-' + hex.slice(8, 10).join('') +
      '-' + hex.slice(10, 16).join('')
    );
  }

  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}
