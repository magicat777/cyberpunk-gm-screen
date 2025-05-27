/**
 * Real User Monitoring (RUM) Implementation
 * Tracks user interactions, performance metrics, and errors
 */

interface RUMConfig {
  apiEndpoint: string;
  apiKey: string;
  sampleRate: number;
  environment: string;
  version: string;
}

interface Metric {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: number;
}

interface UserAction {
  type: string;
  target: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface ErrorEvent {
  message: string;
  stack?: string;
  type: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

class RealUserMonitoring {
  private config: RUMConfig;
  private sessionId: string;
  private userId: string;
  private metrics: Metric[] = [];
  private actions: UserAction[] = [];
  private errors: ErrorEvent[] = [];
  private flushInterval: number = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timer;

  constructor(config: RUMConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // Performance monitoring
    this.setupPerformanceObserver();
    
    // Error tracking
    this.setupErrorTracking();
    
    // User interaction tracking
    this.setupInteractionTracking();
    
    // Visibility tracking
    this.setupVisibilityTracking();
    
    // Start flush timer
    this.startFlushTimer();
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      // Navigation timing
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('page.load.time', navEntry.loadEventEnd - navEntry.fetchStart, {
              page: window.location.pathname
            });
            this.recordMetric('page.dom.interactive', navEntry.domInteractive - navEntry.fetchStart, {
              page: window.location.pathname
            });
            this.recordMetric('page.first.byte', navEntry.responseStart - navEntry.fetchStart, {
              page: window.location.pathname
            });
          }
        }
      });
      
      try {
        navigationObserver.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        console.warn('Navigation observer not supported');
      }

      // Resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.recordMetric('resource.load.time', resourceEntry.duration, {
              resource: resourceEntry.name.split('/').pop() || 'unknown',
              type: resourceEntry.initiatorType
            });
          }
        }
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (e) {
        console.warn('Resource observer not supported');
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('lcp', lastEntry.startTime, {
          page: window.location.pathname
        });
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as any;
            this.recordMetric('fid', fidEntry.processingStart - fidEntry.startTime, {
              eventType: fidEntry.name
            });
          }
        }
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observer not supported');
      }
    }
  }

  private setupErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        type: 'javascript',
        timestamp: Date.now(),
        url: event.filename || window.location.href,
        userAgent: navigator.userAgent
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        type: 'unhandled_promise',
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });
  }

  private setupInteractionTracking(): void {
    // Click tracking
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const action = this.getActionFromElement(target);
      
      if (action) {
        this.trackAction({
          type: 'click',
          target: action,
          timestamp: Date.now(),
          metadata: {
            x: event.clientX,
            y: event.clientY
          }
        });
      }
    });

    // Form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackAction({
        type: 'form_submit',
        target: form.id || form.name || 'unnamed_form',
        timestamp: Date.now(),
        metadata: {
          method: form.method,
          action: form.action
        }
      });
    });

    // Page visibility
    document.addEventListener('visibilitychange', () => {
      this.trackAction({
        type: 'visibility_change',
        target: document.visibilityState,
        timestamp: Date.now()
      });
    });
  }

  private setupVisibilityTracking(): void {
    let hiddenTime = 0;
    let visibleTime = 0;
    let lastVisibilityChange = Date.now();

    document.addEventListener('visibilitychange', () => {
      const now = Date.now();
      const duration = now - lastVisibilityChange;

      if (document.hidden) {
        visibleTime += duration;
        this.recordMetric('page.visible.time', visibleTime, {
          page: window.location.pathname
        });
      } else {
        hiddenTime += duration;
        this.recordMetric('page.hidden.time', hiddenTime, {
          page: window.location.pathname
        });
      }

      lastVisibilityChange = now;
    });

    // Track on page unload
    window.addEventListener('beforeunload', () => {
      const duration = Date.now() - lastVisibilityChange;
      if (!document.hidden) {
        visibleTime += duration;
      }
      
      this.recordMetric('page.total.visible.time', visibleTime, {
        page: window.location.pathname
      });
      
      // Force flush
      this.flush();
    });
  }

  private getActionFromElement(element: HTMLElement): string | null {
    // Try to get meaningful identifier
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    if (element.tagName === 'BUTTON') return element.textContent?.trim() || 'button';
    if (element.tagName === 'A') return element.getAttribute('href') || 'link';
    
    // Check parent elements
    if (element.parentElement) {
      return this.getActionFromElement(element.parentElement);
    }
    
    return null;
  }

  public recordMetric(name: string, value: number, tags: Record<string, string> = {}): void {
    // Sample rate check
    if (Math.random() > this.config.sampleRate) return;

    this.metrics.push({
      name,
      value,
      tags: {
        ...tags,
        environment: this.config.environment,
        version: this.config.version,
        sessionId: this.sessionId,
        userId: this.userId
      },
      timestamp: Date.now()
    });
  }

  public trackAction(action: UserAction): void {
    // Sample rate check
    if (Math.random() > this.config.sampleRate) return;

    this.actions.push(action);
  }

  public trackError(error: ErrorEvent): void {
    // Always track errors (no sampling)
    this.errors.push(error);
    
    // Immediate flush for errors
    this.flush();
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private async flush(): Promise<void> {
    if (this.metrics.length === 0 && this.actions.length === 0 && this.errors.length === 0) {
      return;
    }

    const payload = {
      sessionId: this.sessionId,
      userId: this.userId,
      metrics: [...this.metrics],
      actions: [...this.actions],
      errors: [...this.errors],
      timestamp: Date.now()
    };

    // Clear arrays
    this.metrics = [];
    this.actions = [];
    this.errors = [];

    try {
      // Use Beacon API for reliability
      if ('sendBeacon' in navigator) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(this.config.apiEndpoint, blob);
      } else {
        // Fallback to fetch
        await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.config.apiKey
          },
          body: JSON.stringify(payload),
          keepalive: true
        });
      }
    } catch (error) {
      console.error('Failed to send RUM data:', error);
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string {
    // Check for existing user ID in localStorage
    const stored = localStorage.getItem('rum_user_id');
    if (stored) return stored;

    // Generate new user ID
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('rum_user_id', userId);
    return userId;
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Export singleton instance
let rumInstance: RealUserMonitoring | null = null;

export function initializeRUM(config: RUMConfig): RealUserMonitoring {
  if (rumInstance) {
    rumInstance.destroy();
  }
  rumInstance = new RealUserMonitoring(config);
  return rumInstance;
}

export function getRUM(): RealUserMonitoring | null {
  return rumInstance;
}

export { RealUserMonitoring, type RUMConfig, type Metric, type UserAction, type ErrorEvent };