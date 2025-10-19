interface AnalyticsEvent {
  event_name: string;
  user_id?: string;
  event_params?: Record<string, any>;
  timestamp: number;
  user_agent?: string;
  page?: string;
  referrer?: string;
}

interface ConversionEvent extends AnalyticsEvent {
  conversion_value?: number;
  currency?: string;
}

class Analytics {
  private static instance: Analytics;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // Initialize analytics (call this on app startup)
  initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Initialize Google Analytics
    if (process.env.NEXT_PUBLIC_GA_ID) {
      // Load gtag script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        debug_mode: process.env.NODE_ENV === 'development'
      });

      // Initialize Google Ads if configured
      if (process.env.NEXT_PUBLIC_AW_ID) {
        window.gtag('config', process.env.NEXT_PUBLIC_AW_ID);
      }

      // Initialize Facebook Pixel if configured
      if (process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
        this.initializeFacebookPixel();
      }

      // Initialize Hotjar if configured
      if (process.env.NEXT_PUBLIC_HOTJAR_ID) {
        this.initializeHotjar();
      }
    }

    this.isInitialized = true;
  }

  private initializeFacebookPixel() {
    if (!process.env.NEXT_PUBLIC_FB_PIXEL_ID) return;

    // Facebook Pixel initialization
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);
  }

  private initializeHotjar() {
    if (!process.env.NEXT_PUBLIC_HOTJAR_ID) return;

    const script = document.createElement('script');
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(script);
  }

  // Track page view
  trackPageView(page?: string) {
    if (typeof window === 'undefined') return;

    const pageUrl = page || window.location.pathname;

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: pageUrl
      });
    }

    // Facebook Pixel
    if (window.fbq && process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
      window.fbq('track', 'PageView');
    }

    // Custom event tracking
    this.trackEvent('page_view', {
      page_path: pageUrl,
      page_title: document.title,
      page_location: window.location.href
    });
  }

  // Track custom event
  trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    const event: AnalyticsEvent = {
      event_name: eventName,
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      page: window.location.pathname,
      referrer: document.referrer,
      event_params: parameters
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }

    // Send to our own analytics endpoint
    this.sendToBackend(event);
  }

  // Track conversion events (signups, purchases, etc.)
  trackConversion(eventName: string, value?: number, currency?: string, parameters?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    const conversionEvent: ConversionEvent = {
      event_name: eventName,
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      page: window.location.pathname,
      referrer: document.referrer,
      conversion_value: value,
      currency: currency || 'BRL',
      event_params: parameters
    };

    // Google Analytics Ecommerce
    if (window.gtag && value) {
      window.gtag('event', eventName, {
        value: value,
        currency: currency || 'BRL',
        ...parameters
      });
    }

    // Google Ads conversion tracking
    if (window.gtag && process.env.NEXT_PUBLIC_AW_CONVERSION_LABEL) {
      window.gtag('event', 'conversion', {
        send_to: `${process.env.NEXT_PUBLIC_AW_ID}/${process.env.NEXT_PUBLIC_AW_CONVERSION_LABEL}`,
        value: value,
        currency: currency || 'BRL'
      });
    }

    // Facebook Pixel conversion
    if (window.fbq && process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
      if (eventName === 'sign_up') {
        window.fbq('track', 'CompleteRegistration', {
          value: value,
          currency: currency || 'BRL'
        });
      } else if (eventName === 'purchase') {
        window.fbq('track', 'Purchase', {
          value: value,
          currency: currency || 'BRL'
        });
      }
    }

    // Send to our own analytics endpoint
    this.sendToBackend(conversionEvent);
  }

  // Track user engagement
  trackEngagement(action: string, parameters?: Record<string, any>) {
    this.trackEvent('engagement', {
      action,
      ...parameters
    });
  }

  // Track video watching
  trackVideoProgress(videoId: string, progress: number, totalDuration: number) {
    this.trackEvent('video_progress', {
      video_id: videoId,
      progress_percent: progress,
      progress_seconds: Math.round((progress / 100) * totalDuration),
      total_duration: totalDuration
    });
  }

  // Track course completion
  trackCourseCompletion(courseId: string, score?: number) {
    this.trackEvent('course_completion', {
      course_id: courseId,
      score: score
    });
  }

  // Track feature usage
  trackFeatureUsage(feature: string, action?: string) {
    this.trackEvent('feature_usage', {
      feature,
      action: action || 'used'
    });
  }

  // Track form interactions
  trackFormInteraction(formName: string, action: 'start' | 'abandon' | 'submit', step?: number) {
    this.trackEvent('form_interaction', {
      form_name: formName,
      action,
      step
    });
  }

  // Send events to our backend for detailed analytics
  private async sendToBackend(event: AnalyticsEvent) {
    try {
      // Send to our analytics endpoint
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Set user properties for all events
  setUserProperties(userId: string, properties: Record<string, any>) {
    if (typeof window === 'undefined') return;

    // Google Analytics user properties
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        user_id: userId,
        custom_map: properties
      });
    }

    // Facebook Pixel user properties
    if (window.fbq && process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
      Object.entries(properties).forEach(([key, value]) => {
        window.fbq('trackCustom', 'UserProperty', {
          property_name: key,
          property_value: value
        });
      });
    }
  }

  // Enhanced ecommerce tracking
  trackEcommerce(eventName: string, items: any[], parameters?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    // Google Analytics 4 Ecommerce
    if (window.gtag) {
      window.gtag('event', eventName, {
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price
        })),
        ...parameters
      });
    }
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance();

// Export types
export type { AnalyticsEvent, ConversionEvent };

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}