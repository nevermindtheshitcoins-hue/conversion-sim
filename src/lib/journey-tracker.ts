export interface UserResponse {
  screen: string;
  buttonNumber: number;
  buttonText: string;
  timestamp: number;
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
    this.sessionId = crypto.randomUUID();
    this.startTime = Date.now();
  }

  addResponse(screen: string, buttonNumber: number, buttonText: string) {
    this.responses.push({
      screen,
      buttonNumber,
      buttonText,
      timestamp: Date.now()
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
    this.sessionId = crypto.randomUUID();
    this.startTime = Date.now();
  }
}