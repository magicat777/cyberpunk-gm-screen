/**
 * Error Boundary Implementation for Component Error Handling
 * Catches and reports errors in component trees
 */

import { log } from './logger';
import { getRUM } from './rum';
import { getPrometheusExporter } from './prometheus';

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryFound?: boolean;
  [key: string]: any;
}

interface ErrorBoundaryConfig {
  fallbackComponent?: (error: Error, errorInfo: ErrorInfo) => HTMLElement;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableReporting: boolean;
  enableRecovery: boolean;
}

export class ErrorBoundary {
  private config: ErrorBoundaryConfig;
  private hasError: boolean = false;
  private error: Error | null = null;
  private errorInfo: ErrorInfo | null = null;
  private container: HTMLElement;
  private originalContent: Node[] = [];

  constructor(container: HTMLElement, config: Partial<ErrorBoundaryConfig> = {}) {
    this.container = container;
    this.config = {
      enableReporting: true,
      enableRecovery: true,
      ...config
    };

    this.wrapContainer();
  }

  private wrapContainer(): void {
    // Store original content
    this.originalContent = Array.from(this.container.childNodes);

    // Set up error catching
    this.container.addEventListener('error', this.handleError.bind(this), true);
  }

  private handleError(event: ErrorEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const error = new Error(event.message);
    error.stack = event.error?.stack || `at ${event.filename}:${event.lineno}:${event.colno}`;

    this.captureError(error, {
      componentStack: this.getComponentStack(),
      errorBoundary: this.container.id || this.container.className,
      errorBoundaryFound: true
    });
  }

  public captureError(error: Error, errorInfo: ErrorInfo): void {
    this.hasError = true;
    this.error = error;
    this.errorInfo = errorInfo;

    // Log the error
    log.error('Component error caught', error, {
      component: errorInfo.errorBoundary,
      stack: errorInfo.componentStack
    });

    // Report to monitoring
    if (this.config.enableReporting) {
      this.reportError(error, errorInfo);
    }

    // Call custom error handler
    if (this.config.onError) {
      this.config.onError(error, errorInfo);
    }

    // Render fallback UI
    this.renderFallback();
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    // Report to RUM
    getRUM()?.trackError({
      message: error.message,
      stack: error.stack,
      type: 'component_error',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // Report to Prometheus
    getPrometheusExporter()?.recordError('component_error', 'error');
  }

  private renderFallback(): void {
    if (!this.error || !this.errorInfo) return;

    // Clear current content
    this.container.innerHTML = '';

    // Render fallback
    if (this.config.fallbackComponent) {
      const fallback = this.config.fallbackComponent(this.error, this.errorInfo);
      this.container.appendChild(fallback);
    } else {
      this.container.appendChild(this.createDefaultFallback());
    }
  }

  private createDefaultFallback(): HTMLElement {
    const fallback = document.createElement('div');
    fallback.className = 'error-boundary-fallback';
    fallback.innerHTML = `
      <div style="
        padding: 20px;
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 8px;
        color: #ff6b6b;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <h3 style="margin: 0 0 10px 0; color: #ff4444;">Something went wrong</h3>
        <p style="margin: 0 0 10px 0;">An error occurred in this component.</p>
        ${this.config.enableRecovery ? `
          <button onclick="this.getRootNode().host?.resetError?.()" style="
            padding: 8px 16px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          ">Try Again</button>
        ` : ''}
        <details style="margin-top: 15px;">
          <summary style="cursor: pointer;">Error Details</summary>
          <pre style="
            margin-top: 10px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            overflow-x: auto;
            font-size: 12px;
          ">${this.error?.stack || this.error?.message}</pre>
        </details>
      </div>
    `;

    // Add reset handler if recovery is enabled
    if (this.config.enableRecovery) {
      const button = fallback.querySelector('button');
      button?.addEventListener('click', () => this.resetError());
    }

    return fallback;
  }

  public resetError(): void {
    this.hasError = false;
    this.error = null;
    this.errorInfo = null;

    // Restore original content
    this.container.innerHTML = '';
    this.originalContent.forEach(node => {
      this.container.appendChild(node.cloneNode(true));
    });

    log.info('Error boundary reset', {
      component: this.container.id || this.container.className
    });
  }

  private getComponentStack(): string {
    const stack: string[] = [];
    let element: HTMLElement | null = this.container;

    while (element) {
      const identifier = element.id 
        ? `#${element.id}` 
        : element.className 
        ? `.${element.className.split(' ')[0]}`
        : element.tagName.toLowerCase();
      
      stack.unshift(identifier);
      element = element.parentElement;
    }

    return stack.join(' > ');
  }

  public hasErrored(): boolean {
    return this.hasError;
  }

  public getError(): { error: Error | null; errorInfo: ErrorInfo | null } {
    return {
      error: this.error,
      errorInfo: this.errorInfo
    };
  }

  public destroy(): void {
    this.container.removeEventListener('error', this.handleError.bind(this), true);
  }
}

// Global error boundary for uncaught errors
export class GlobalErrorBoundary {
  private static instance: GlobalErrorBoundary | null = null;
  private errorBoundaries: Map<string, ErrorBoundary> = new Map();

  private constructor() {
    this.setupGlobalHandlers();
  }

  public static getInstance(): GlobalErrorBoundary {
    if (!GlobalErrorBoundary.instance) {
      GlobalErrorBoundary.instance = new GlobalErrorBoundary();
    }
    return GlobalErrorBoundary.instance;
  }

  private setupGlobalHandlers(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      // Check if error was caught by a boundary
      const wasCaught = Array.from(this.errorBoundaries.values()).some(
        boundary => boundary.hasErrored()
      );

      if (!wasCaught) {
        log.error('Uncaught error', new Error(event.message), {
          filename: event.filename,
          line: event.lineno,
          column: event.colno
        });

        getRUM()?.trackError({
          message: event.message,
          stack: event.error?.stack,
          type: 'uncaught_error',
          timestamp: Date.now(),
          url: event.filename || window.location.href,
          userAgent: navigator.userAgent
        });

        getPrometheusExporter()?.recordError('uncaught_error', 'fatal');
      }
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      log.error('Unhandled promise rejection', event.reason);

      getRUM()?.trackError({
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        type: 'unhandled_promise',
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });

      getPrometheusExporter()?.recordError('unhandled_promise', 'error');
    });
  }

  public registerBoundary(id: string, boundary: ErrorBoundary): void {
    this.errorBoundaries.set(id, boundary);
  }

  public unregisterBoundary(id: string): void {
    const boundary = this.errorBoundaries.get(id);
    if (boundary) {
      boundary.destroy();
      this.errorBoundaries.delete(id);
    }
  }

  public resetAll(): void {
    this.errorBoundaries.forEach(boundary => boundary.resetError());
  }
}

// Helper function to wrap components with error boundary
export function withErrorBoundary(
  container: HTMLElement,
  config?: Partial<ErrorBoundaryConfig>
): ErrorBoundary {
  const boundary = new ErrorBoundary(container, config);
  GlobalErrorBoundary.getInstance().registerBoundary(
    container.id || `boundary-${Date.now()}`,
    boundary
  );
  return boundary;
}