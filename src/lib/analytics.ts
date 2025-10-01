import type { UserJourney } from './journey-tracker';

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
    if (index === 0) return responses[0].timestamp - Date.now();
    return responses[index].timestamp - responses[index - 1].timestamp;
  }

  private async sendToAnalytics(pattern: AnalyticsPattern) {
    try {
      // Send to your analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'journey_pattern',
          data: pattern,
        }),
      });
    } catch (error) {
      console.warn('Analytics send failed:', error);
    }
  }

  getAggregatedInsights() {
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
      const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
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