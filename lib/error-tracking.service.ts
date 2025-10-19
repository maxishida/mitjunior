// Error Tracking Service - Centralized error handling and reporting
import { getAuth } from 'firebase/auth';
import { analyticsService } from './analytics.service';

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: string;
  component?: string;
  action?: string;
  additionalData?: Record<string, any>;
}

interface ErrorReport {
  error: Error | string;
  context?: ErrorContext;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  fingerprint?: string;
}

class ErrorTrackingService {
  private isEnabled = true;
  private sessionId: string;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 50;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalHandlers();
    this.startErrorReporting();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalHandlers() {
    if (typeof window !== 'undefined') {
      // Global error handler
      window.addEventListener('error', (event) => {
        this.captureError(event.error || event.message, {
          component: 'global',
          action: 'window_error',
          additionalData: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        });
      });

      // Unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(event.reason, {
          component: 'global',
          action: 'unhandled_promise_rejection'
        });
      });

      // Resource error handler
      window.addEventListener('error', (event) => {
        if (event.target !== window) {
          const target = event.target as HTMLElement;
          this.captureError(`Resource load failed: ${target.tagName}`, {
            component: 'global',
            action: 'resource_error',
            additionalData: {
              tagName: target.tagName,
              source: target.getAttribute('src') || target.getAttribute('href')
            }
          });
        }
      }, true);
    }
  }

  private startErrorReporting() {
    // Report queued errors every 30 seconds
    setInterval(() => {
      this.reportQueuedErrors();
    }, 30000);
  }

  // Public API
  captureError(error: Error | string, context?: Partial<ErrorContext>, severity: ErrorReport['severity'] = 'medium') {
    if (!this.isEnabled) return;

    const errorReport: ErrorReport = {
      error,
      context: this.buildContext(context),
      severity,
      fingerprint: this.generateFingerprint(error, context)
    };

    this.addToQueue(errorReport);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Error captured:', errorReport);
    }

    // Log to analytics
    analyticsService.errorEvent(
      error instanceof Error ? error.name : 'Error',
      error instanceof Error ? error.message : String(error),
      context?.component
    );
  }

  // Specific error types
  captureAuthError(error: Error | string, context?: { action?: string; additionalData?: any }) {
    this.captureError(error, {
      component: 'authentication',
      action: context?.action || 'auth_error',
      additionalData: context?.additionalData
    }, 'high');
  }

  captureNetworkError(error: Error | string, context?: { url?: string; method?: string; status?: number }) {
    this.captureError(error, {
      component: 'network',
      action: 'api_error',
      additionalData: context
    }, 'medium');
  }

  captureVideoError(error: Error | string, context?: { videoId?: string; courseId?: string }) {
    this.captureError(error, {
      component: 'video_player',
      action: 'video_error',
      additionalData: context
    }, 'medium');
  }

  captureDatabaseError(error: Error | string, context?: { operation?: string; collection?: string }) {
    this.captureError(error, {
      component: 'database',
      action: context?.operation || 'database_error',
      additionalData: context
    }, 'high');
  }

  captureValidationError(error: Error | string, context?: { field?: string; value?: any }) {
    this.captureError(error, {
      component: 'validation',
      action: 'validation_error',
      additionalData: context
    }, 'low');
  }

  capturePerformanceError(error: Error | string, context?: { metric?: string; value?: number }) {
    this.captureError(error, {
      component: 'performance',
      action: 'performance_error',
      additionalData: context
    }, 'medium');
  }

  // React Error Boundary integration
  captureReactError(error: Error, errorInfo: any) {
    this.captureError(error, {
      component: 'react',
      action: 'component_error',
      additionalData: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    }, 'high');
  }

  // Private helper methods
  private buildContext(context?: Partial<ErrorContext>): ErrorContext {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    return {
      userId: currentUser?.uid,
      sessionId: this.sessionId,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: new Date().toISOString(),
      ...context
    };
  }

  private generateFingerprint(error: Error | string, context?: Partial<ErrorContext>): string {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const componentName = context?.component || 'unknown';
    const actionName = context?.action || 'unknown';

    // Create a simple hash for fingerprinting
    const fingerprint = `${componentName}_${actionName}_${errorMessage.substring(0, 100)}`;
    return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  private addToQueue(errorReport: ErrorReport) {
    this.errorQueue.push(errorReport);

    // Limit queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  private async reportQueuedErrors() {
    if (this.errorQueue.length === 0) return;

    const errorsToReport = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // Send to custom error tracking endpoint
      await this.sendErrorReport(errorsToReport);
    } catch (error) {
      console.warn('Failed to report errors:', error);
      // Re-queue errors if reporting failed
      this.errorQueue.unshift(...errorsToReport);
    }
  }

  private async sendErrorReport(errors: ErrorReport[]) {
    // In production, send to your error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to your error tracking API
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ errors })
      // });

      // For now, we'll just log the errors
      console.group('🚨 Error Report Batch');
      errors.forEach((errorReport, index) => {
        console.error(`Error ${index + 1}:`, errorReport);
      });
      console.groupEnd();
    }
  }

  // Error classification
  classifyError(error: Error | string): 'user' | 'system' | 'network' | 'validation' | 'unknown' {
    const message = error instanceof Error ? error.message : String(error).toLowerCase();

    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return 'network';
    }
    if (message.includes('validation') || message.includes('required') || message.includes('invalid')) {
      return 'validation';
    }
    if (message.includes('permission') || message.includes('auth') || message.includes('unauthorized')) {
      return 'user';
    }
    if (message.includes('internal') || message.includes('server') || message.includes('system')) {
      return 'system';
    }
    return 'unknown';
  }

  // Error rate monitoring
  private errorCounts: Map<string, number> = new Map();

  incrementErrorCount(errorType: string): number {
    const currentCount = this.errorCounts.get(errorType) || 0;
    const newCount = currentCount + 1;
    this.errorCounts.set(errorType, newCount);

    // Report if error rate is too high
    if (newCount > 10) {
      analyticsService.errorEvent('high_error_rate', `${errorType}: ${newCount}`, errorType);
    }

    return newCount;
  }

  // Get error statistics
  getErrorStats(): { totalErrors: number; errorsByType: Record<string, number> } {
    const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
    const errorsByType = Object.fromEntries(this.errorCounts);

    return { totalErrors, errorsByType };
  }

  // Control methods
  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  // Session management
  resetSession() {
    this.sessionId = this.generateSessionId();
    this.errorCounts.clear();
  }

  // Error recovery suggestions
  getErrorSuggestion(errorType: string): string {
    const suggestions: Record<string, string> = {
      network: 'Verifique sua conexão com a internet e tente novamente.',
      validation: 'Por favor, verifique os dados inseridos e corrija os erros destacados.',
      authentication: 'Faça login novamente para continuar.',
      system: 'Ocorreu um erro inesperado. Tente recarregar a página.',
      video: 'Verifique sua conexão e tente recarregar o vídeo.',
      database: 'Ocorreu um erro ao salvar dados. Tente novamente.'
    };

    return suggestions[errorType] || 'Ocorreu um erro. Tente novamente mais tarde.';
  }
}

// Export singleton instance
export const errorTrackingService = new ErrorTrackingService();

// Export convenience functions
export const {
  captureError,
  captureAuthError,
  captureNetworkError,
  captureVideoError,
  captureDatabaseError,
  captureValidationError,
  capturePerformanceError,
  captureReactError,
  getErrorStats,
  enable: enableErrorTracking,
  disable: disableErrorTracking,
  resetSession: resetErrorSession,
  getErrorSuggestion
} = errorTrackingService;

export default errorTrackingService;