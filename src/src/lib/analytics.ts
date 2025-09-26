/*
 * Simple analytics helper for sending events to the parent iframe and
 * optionally local analytics providers.  This utility detects
 * whether the code is running within an iframe and posts messages
 * accordingly.  It also wraps Google Analytics and PostHog if
 * available on the window global.
 */

export interface AnalyticsEvent {
  type: string;
  category?: string;
  label?: string;
  value?: number;
  data?: any;
}

class Analytics {
  private isIframe: boolean;
  constructor() {
    this.isIframe = window !== window.parent;
  }
  track(event: AnalyticsEvent) {
    console.log('Analytics Event:', event);
    if (this.isIframe) {
      window.parent?.postMessage(
        {
          type: 'ANALYTICS_EVENT',
          event,
        },
        '*'
      );
    }
    this.trackLocally(event);
  }
  private trackLocally(event: AnalyticsEvent) {
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', event.type, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_data: event.data,
      });
    }
    if (typeof (window as any).posthog !== 'undefined') {
      (window as any).posthog.capture(event.type, {
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.data,
      });
    }
  }
  // Event helpers
  trackAssessmentStarted() {
    this.track({
      type: 'assessment_started',
      category: 'conversion',
      label: 'tool_loaded',
    });
  }
  trackStepCompleted(step: number, selection: number) {
    this.track({
      type: 'step_completed',
      category: 'engagement',
      label: `step_${step}`,
      value: selection,
    });
  }
  trackAssessmentCompleted(reportLength: number) {
    this.track({
      type: 'assessment_completed',
      category: 'conversion',
      label: 'report_generated',
      value: reportLength,
    });
  }
  trackError(error: string, context: string) {
    this.track({
      type: 'error_occurred',
      category: 'technical',
      label: context,
      data: { error },
    });
  }
  trackProviderFallback(fromProvider: string, toProvider: string) {
    this.track({
      type: 'ai_provider_fallback',
      category: 'technical',
      label: `${fromProvider}_to_${toProvider}`,
    });
  }
}

export const analytics = new Analytics();

export const useAnalytics = () => {
  return analytics;
};