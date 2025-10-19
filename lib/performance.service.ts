// Performance Monitoring Service
import { getPerformance, trace } from 'firebase/performance';
import { app } from './firebase.config';

interface PerformanceMetrics {
  navigationStart: number;
  loadEventEnd: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

interface CustomMetric {
  name: string;
  value: number;
  unit: 'milliseconds' | 'bytes' | 'count' | 'percentage';
  tags?: Record<string, string>;
}

class PerformanceService {
  private perf: any = null;
  private isInitialized = false;
  private metrics: PerformanceMetrics = {
    navigationStart: 0,
    loadEventEnd: 0,
    domContentLoaded: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0
  };

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined' && !this.isInitialized) {
      try {
        this.perf = getPerformance(app);
        this.isInitialized = true;
        this.setupObservers();
        console.log('Performance monitoring initialized');
      } catch (error) {
        console.warn('Performance monitoring initialization failed:', error);
      }
    }
  }

  private setupObservers() {
    if (typeof window !== 'undefined') {
      // Core Web Vitals
      this.observeFirstContentfulPaint();
      this.observeLargestContentfulPaint();
      this.observeCumulativeLayoutShift();
      this.observeFirstInputDelay();

      // Navigation timing
      this.observeNavigationTiming();

      // Resource timing
      this.observeResourceTiming();
    }
  }

  // Core Web Vitals Observers
  private observeFirstContentfulPaint() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
            this.recordMetric('first_contentful_paint', entry.startTime, 'milliseconds');
          }
        });
      });

      observer.observe({ type: 'paint', buffered: true });
    }
  }

  private observeLargestContentfulPaint() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.largestContentfulPaint = lastEntry.startTime;
        this.recordMetric('largest_contentful_paint', lastEntry.startTime, 'milliseconds');
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    }
  }

  private observeCumulativeLayoutShift() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cumulativeLayoutShift = clsValue;
        this.recordMetric('cumulative_layout_shift', clsValue, 'percentage');
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    }
  }

  private observeFirstInputDelay() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
          this.recordMetric('first_input_delay', this.metrics.firstInputDelay, 'milliseconds');
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
    }
  }

  private observeNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as any[];
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];
        this.metrics.navigationStart = nav.navigationStart;
        this.metrics.loadEventEnd = nav.loadEventEnd;
        this.metrics.domContentLoaded = nav.domContentLoadedEventEnd;

        this.recordMetric('dom_content_loaded', nav.domContentLoadedEventEnd - nav.navigationStart, 'milliseconds');
        this.recordMetric('page_load_time', nav.loadEventEnd - nav.navigationStart, 'milliseconds');
      }
    }
  }

  private observeResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.duration > 1000) { // Log slow resources
            this.recordMetric('slow_resource', entry.duration, 'milliseconds', {
              resource_type: entry.initiatorType,
              resource_name: entry.name.split('/').pop()
            });
          }
        });
      });

      observer.observe({ type: 'resource', buffered: true });
    }
  }

  // Custom Metrics
  recordMetric(name: string, value: number, unit: 'milliseconds' | 'bytes' | 'count' | 'percentage' = 'milliseconds', tags?: Record<string, string>) {
    if (!this.isInitialized) return;

    try {
      const customTrace = trace(this.perf, name);
      customTrace.putMetric('value', value);

      if (tags) {
        Object.entries(tags).forEach(([key, tagValue]) => {
          customTrace.putAttribute(key, tagValue);
        });
      }

      customTrace.record();
      customTrace.stop();

      // Console logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ Performance Metric: ${name}`, { value, unit, tags });
      }
    } catch (error) {
      console.warn(`Failed to record metric ${name}:`, error);
    }
  }

  // Video Performance
  recordVideoLoadTime(videoId: string, loadTime: number) {
    this.recordMetric('video_load_time', loadTime, 'milliseconds', {
      video_id: videoId
    });
  }

  recordVideoBufferTime(videoId: string, bufferTime: number) {
    this.recordMetric('video_buffer_time', bufferTime, 'milliseconds', {
      video_id: videoId
    });
  }

  recordVideoQuality(videoId: string, quality: string) {
    this.recordMetric('video_quality', 1, 'count', {
      video_id: videoId,
      quality_level: quality
    });
  }

  // API Performance
  recordApiCall(endpoint: string, duration: number, status: number) {
    const statusCategory = status >= 200 && status < 300 ? 'success' : 'error';
    this.recordMetric('api_call_duration', duration, 'milliseconds', {
      endpoint: endpoint,
      status_category: statusCategory
    });
  }

  // Database Performance
  recordDatabaseQuery(operation: string, collection: string, duration: number) {
    this.recordMetric('database_query_duration', duration, 'milliseconds', {
      operation: operation,
      collection: collection
    });
  }

  // User Interaction Metrics
  recordClickTime(element: string, timeToClick: number) {
    this.recordMetric('time_to_click', timeToClick, 'milliseconds', {
      element_type: element
    });
  }

  recordFormSubmitTime(formName: string, timeToSubmit: number) {
    this.recordMetric('form_submit_time', timeToSubmit, 'milliseconds', {
      form_name: formName
    });
  }

  // Memory Usage
  recordMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.recordMetric('memory_used', memory.usedJSHeapSize, 'bytes');
      this.recordMetric('memory_total', memory.totalJSHeapSize, 'bytes');
      this.recordMetric('memory_limit', memory.jsHeapSizeLimit, 'bytes');
    }
  }

  // Network Metrics
  recordNetworkInfo() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.recordMetric('network_effective_type', 1, 'count', {
        effective_type: connection.effectiveType || 'unknown'
      });

      this.recordMetric('network_downlink', connection.downlink || 0, 'bytes');
    }
  }

  // Custom Traces
  startCustomTrace(name: string) {
    if (this.perf) {
      return trace(this.perf, name);
    }
    return null;
  }

  // Get Current Metrics
  getCurrentMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Performance Score Calculation
  calculatePerformanceScore(): number {
    const fcpScore = this.scoreFCP(this.metrics.firstContentfulPaint);
    const lcpScore = this.scoreLCP(this.metrics.largestContentfulPaint);
    const clsScore = this.scoreCLS(this.metrics.cumulativeLayoutShift);
    const fidScore = this.scoreFID(this.metrics.firstInputDelay);

    return Math.round((fcpScore + lcpScore + clsScore + fidScore) / 4);
  }

  private scoreFCP(fcp: number): number {
    if (fcp < 1800) return 100;
    if (fcp < 3000) return 50 + ((3000 - fcp) / 1200) * 50;
    return 50;
  }

  private scoreLCP(lcp: number): number {
    if (lcp < 2500) return 100;
    if (lcp < 4000) return 50 + ((4000 - lcp) / 1500) * 50;
    return 50;
  }

  private scoreCLS(cls: number): number {
    if (cls < 0.1) return 100;
    if (cls < 0.25) return 50 + ((0.25 - cls) / 0.15) * 50;
    return 50;
  }

  private scoreFID(fid: number): number {
    if (fid < 100) return 100;
    if (fid < 300) return 50 + ((300 - fid) / 200) * 50;
    return 50;
  }

  // Report Performance Issues
  reportPerformanceIssue(type: string, details: any) {
    this.recordMetric('performance_issue', 1, 'count', {
      issue_type: type,
      details: JSON.stringify(details)
    });
  }
}

// Export singleton instance
export const performanceService = new PerformanceService();

// Export convenience functions
export const {
  recordMetric,
  recordVideoLoadTime,
  recordVideoBufferTime,
  recordApiCall,
  recordDatabaseQuery,
  recordClickTime,
  recordFormSubmitTime,
  recordMemoryUsage,
  recordNetworkInfo,
  startCustomTrace,
  getCurrentMetrics,
  calculatePerformanceScore,
  reportPerformanceIssue
} = performanceService;

export default performanceService;