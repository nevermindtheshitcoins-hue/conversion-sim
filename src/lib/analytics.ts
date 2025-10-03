import type { UserJourney } from './journey-tracker';
import { sendToParent, isInIframe } from './iframe-utils';

interface AnalyticsPattern {
  sessionId: string;
  timestamp: number;
  journey: {
    screen: string;
    option: number;
    timeSpent: number;
  }[];
  totalTime: number;
  completionRate: number;
}

class AnonymousAnalytics {
  private patterns: AnalyticsPattern[] = [];

  aggregateJourney(journey: UserJourney): AnalyticsPattern {
    const pattern: AnalyticsPattern = {
      sessionId: journey.sessionId,
      timestamp: Date.now(),
      journey: journey.responses.map((response, index) => ({
        screen: response.screen,
        option: response.buttonNumber,
        timeSpent: this.calculateTimeSpent(journey.responses, index),
      })),
      totalTime: Date.now() - journey.metadata.startTime,
      completionRate: journey.responses.length / journey.metadata.totalScreens,
    };

    this.patterns.push(pattern);
    this.sendToAnalytics(pattern);
    return pattern;
  }

  private calculateTimeSpent(responses: any[], index: number): number {
    if (index === 0) {
      const firstResponse = responses[0];
      const startTime = firstResponse?.startTime || firstResponse?.timestamp || Date.now();
      return Math.max(0, firstResponse.timestamp - startTime);
    }
    return Math.max(0, responses[index].timestamp - responses[index - 1].timestamp);
  }

  private async sendToAnalytics(pattern: AnalyticsPattern) {
    if (typeof window === 'undefined') return;
    
    try {
      const parentOrigin = document.referrer ? new URL(document.referrer).origin : '';
      const allowedOrigins = [
        'https://devoteusa.com',
        'https://www.devoteusa.com',
        process.env.NEXT_PUBLIC_IFRAME_PARENT
      ].filter(Boolean);
      
      if (allowedOrigins.includes(parentOrigin) || window === window.parent) {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Parent-Origin': parentOrigin
          },
          body: JSON.stringify({
            type: 'journey_pattern',
            data: pattern,
          }),
        });
      }
    } catch (error) {
      const sanitizedError = error instanceof Error ? error.message.replace(/[\r\n\t]/g, '').substring(0, 100) : 'Unknown error';
      console.warn('Analytics send failed:', sanitizedError);
    }
  }

  getAggregatedInsights() {
    if (this.patterns.length === 0) {
      return {
        totalSessions: 0,
        averageCompletionRate: 0,
        popularPaths: [],
        averageTimePerScreen: {}
      };
    }
    return {
      totalSessions: this.patterns.length,
      averageCompletionRate: this.patterns.reduce((sum, p) => sum + p.completionRate, 0) / this.patterns.length,
      popularPaths: this.getMostCommonPaths(),
      averageTimePerScreen: this.getAverageTimePerScreen(),
    };
  }

  private getMostCommonPaths() {
    const pathCounts = new Map<string, number>();
    
    this.patterns.forEach(pattern => {
      const path = pattern.journey.map(j => `${j.screen}:${j.option}`).join('->');
      pathCounts.set(path, (pathCounts.get(path) || 0) + 1);
    });

    return Array.from(pathCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }

  private getAverageTimePerScreen() {
    const screenTimes = new Map<string, number[]>();
    
    this.patterns.forEach(pattern => {
      pattern.journey.forEach(j => {
        if (!screenTimes.has(j.screen)) {
          screenTimes.set(j.screen, []);
        }
        screenTimes.get(j.screen)!.push(j.timeSpent);
      });
    });

    const averages = new Map<string, number>();
    screenTimes.forEach((times, screen) => {
      const avg = times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
      averages.set(screen, avg);
    });

    return Object.fromEntries(averages);
  }
}

export const analytics = new AnonymousAnalytics();

export function trackJourneyCompletion(journey: UserJourney) {
  return analytics.aggregateJourney(journey);
}

export function getAnalyticsInsights() {
  return analytics.getAggregatedInsights();
}