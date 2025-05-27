/**
 * Monitoring Module - Main Entry Point
 * Initializes all monitoring and observability features
 */

import { EventBus } from '../lib/EventBus';
import { Store } from '../lib/Store';
import { initializeRUM, type RUMConfig } from './rum';
import { initializeMetrics } from './metrics';
import { initializePrometheus, type PrometheusConfig, getPrometheusExporter } from './prometheus';
import { initializeLogger, LogLevel, type LoggerConfig } from './logger';
import { GlobalErrorBoundary } from './error-boundary';
import { initializeDebugMode, type DebugConfig } from './debug-mode';

export interface MonitoringConfig {
  rum?: Partial<RUMConfig>;
  prometheus?: Partial<PrometheusConfig>;
  logger?: Partial<LoggerConfig>;
  debug?: Partial<DebugConfig>;
  enableRUM?: boolean;
  enablePrometheus?: boolean;
  enableDebug?: boolean;
}

export class MonitoringService {
  private initialized: boolean = false;

  public async initialize(
    eventBus: EventBus,
    store: Store,
    config: MonitoringConfig = {}
  ): Promise<void> {
    if (this.initialized) {
      console.warn('Monitoring already initialized');
      return;
    }

    console.log('Initializing monitoring services...');

    // 1. Initialize Logger
    const loggerConfig: LoggerConfig = {
      level: config.logger?.level || LogLevel.INFO,
      enableConsole: config.logger?.enableConsole ?? true,
      enableRemote: config.logger?.enableRemote ?? false,
      remoteEndpoint: config.logger?.remoteEndpoint,
      bufferSize: config.logger?.bufferSize || 100,
      flushInterval: config.logger?.flushInterval || 30000
    };
    initializeLogger(loggerConfig);

    // 2. Initialize Global Error Boundary
    GlobalErrorBoundary.getInstance();

    // 3. Initialize RUM
    if (config.enableRUM !== false && config.rum?.apiEndpoint) {
      const rumConfig: RUMConfig = {
        apiEndpoint: config.rum.apiEndpoint,
        apiKey: config.rum.apiKey || '',
        sampleRate: config.rum.sampleRate || 1.0,
        environment: config.rum.environment || 'development',
        version: config.rum.version || '1.0.0'
      };
      initializeRUM(rumConfig);
    }

    // 4. Initialize Custom Metrics
    initializeMetrics(eventBus);

    // 5. Initialize Prometheus
    if (config.enablePrometheus !== false && config.prometheus?.endpoint) {
      const prometheusConfig: PrometheusConfig = {
        endpoint: config.prometheus.endpoint,
        pushInterval: config.prometheus.pushInterval || 30000,
        jobName: config.prometheus.jobName || 'cyberpunk-gm-screen',
        instance: config.prometheus.instance || window.location.hostname,
        username: config.prometheus.username,
        password: config.prometheus.password
      };
      
      const exporter = initializePrometheus(prometheusConfig);
      
      // Connect RUM to Prometheus
      this.connectRUMtoPrometheus();
    }

    // 6. Initialize Debug Mode
    if (config.enableDebug !== false) {
      const debugConfig: DebugConfig = {
        enabled: config.debug?.enabled || false,
        showMetrics: config.debug?.showMetrics ?? true,
        showEvents: config.debug?.showEvents ?? true,
        showState: config.debug?.showState ?? true,
        showPerformance: config.debug?.showPerformance ?? true,
        logLevel: config.debug?.logLevel || LogLevel.DEBUG
      };
      initializeDebugMode(eventBus, store, debugConfig);
    }

    this.initialized = true;
    console.log('Monitoring services initialized successfully');
  }

  private connectRUMtoPrometheus(): void {
    // Bridge RUM metrics to Prometheus
    const prometheus = getPrometheusExporter();
    if (!prometheus) return;

    // Override RUM metric recording to also send to Prometheus
    const originalRecordMetric = getRUM()?.recordMetric;
    if (originalRecordMetric && getRUM()) {
      getRUM()!.recordMetric = function(name: string, value: number, tags: Record<string, string>) {
        // Call original
        originalRecordMetric.call(this, name, value, tags);
        
        // Also send to Prometheus
        prometheus.recordRUMMetric(name, value, tags);
      };
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }
}

// Export singleton instance
const monitoringService = new MonitoringService();

export function initializeMonitoring(
  eventBus: EventBus,
  store: Store,
  config: MonitoringConfig = {}
): Promise<void> {
  return monitoringService.initialize(eventBus, store, config);
}

// Re-export key components
export { getRUM } from './rum';
export { getMetrics } from './metrics';
export { getPrometheusExporter } from './prometheus';
export { log, getLogger, LogLevel } from './logger';
export { withErrorBoundary } from './error-boundary';
export { getDebugMode } from './debug-mode';

// Re-export types
export type { RUMConfig, Metric, UserAction, ErrorEvent } from './rum';
export type { LogContext, LoggerConfig } from './logger';
export type { ErrorBoundaryConfig } from './error-boundary';
export type { DebugConfig } from './debug-mode';

function getRUM() {
  return require('./rum').getRUM();
}