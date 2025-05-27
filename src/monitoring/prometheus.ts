/**
 * Prometheus Metrics Exporter for ODIN Integration
 * Formats and exports metrics in Prometheus format
 */

interface PrometheusMetric {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  help: string;
  labels?: string[];
  value?: number;
  values?: Array<{ labels: Record<string, string>; value: number }>;
}

interface PrometheusConfig {
  endpoint: string;
  pushInterval: number;
  jobName: string;
  instance: string;
  username?: string;
  password?: string;
}

export class PrometheusExporter {
  private config: PrometheusConfig;
  private metrics: Map<string, PrometheusMetric> = new Map();
  private pushTimer?: NodeJS.Timer;

  constructor(config: PrometheusConfig) {
    this.config = config;
    this.initializeMetrics();
    this.startPushGateway();
  }

  private initializeMetrics(): void {
    // Define standard metrics
    this.registerMetric({
      name: 'cyberpunk_gm_screen_info',
      type: 'gauge',
      help: 'Application information',
      labels: ['version', 'environment'],
      value: 1
    });

    // User session metrics
    this.registerMetric({
      name: 'cyberpunk_gm_session_duration_seconds',
      type: 'gauge',
      help: 'Current session duration in seconds'
    });

    this.registerMetric({
      name: 'cyberpunk_gm_active_users',
      type: 'gauge',
      help: 'Number of active users'
    });

    // Panel metrics
    this.registerMetric({
      name: 'cyberpunk_gm_panel_opens_total',
      type: 'counter',
      help: 'Total number of panel opens',
      labels: ['panel_type', 'panel_id']
    });

    this.registerMetric({
      name: 'cyberpunk_gm_panel_focus_duration_seconds',
      type: 'histogram',
      help: 'Panel focus duration in seconds',
      labels: ['panel_type', 'panel_id']
    });

    this.registerMetric({
      name: 'cyberpunk_gm_panel_interactions_total',
      type: 'counter',
      help: 'Total panel interactions',
      labels: ['panel_type', 'interaction_type']
    });

    // Dice roll metrics
    this.registerMetric({
      name: 'cyberpunk_gm_dice_rolls_total',
      type: 'counter',
      help: 'Total number of dice rolls',
      labels: ['formula']
    });

    this.registerMetric({
      name: 'cyberpunk_gm_dice_result_value',
      type: 'histogram',
      help: 'Dice roll result values',
      labels: ['formula']
    });

    this.registerMetric({
      name: 'cyberpunk_gm_dice_critical_total',
      type: 'counter',
      help: 'Total critical rolls'
    });

    this.registerMetric({
      name: 'cyberpunk_gm_dice_fumble_total',
      type: 'counter',
      help: 'Total fumble rolls'
    });

    // Performance metrics
    this.registerMetric({
      name: 'cyberpunk_gm_page_load_duration_seconds',
      type: 'histogram',
      help: 'Page load duration in seconds',
      labels: ['page']
    });

    this.registerMetric({
      name: 'cyberpunk_gm_lcp_duration_seconds',
      type: 'histogram',
      help: 'Largest Contentful Paint duration',
      labels: ['page']
    });

    this.registerMetric({
      name: 'cyberpunk_gm_fid_duration_seconds',
      type: 'histogram',
      help: 'First Input Delay duration',
      labels: ['event_type']
    });

    // Error metrics
    this.registerMetric({
      name: 'cyberpunk_gm_errors_total',
      type: 'counter',
      help: 'Total application errors',
      labels: ['error_type', 'severity']
    });

    // Resource metrics
    this.registerMetric({
      name: 'cyberpunk_gm_memory_usage_bytes',
      type: 'gauge',
      help: 'JavaScript heap size in bytes'
    });

    this.registerMetric({
      name: 'cyberpunk_gm_resource_load_duration_seconds',
      type: 'histogram',
      help: 'Resource load duration',
      labels: ['resource_type', 'resource_name']
    });
  }

  public registerMetric(metric: PrometheusMetric): void {
    this.metrics.set(metric.name, metric);
  }

  public updateMetric(name: string, value: number, labels?: Record<string, string>): void {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Metric ${name} not registered`);
      return;
    }

    if (labels) {
      if (!metric.values) {
        metric.values = [];
      }
      
      // Find existing entry with same labels
      const existingIndex = metric.values.findIndex(v => 
        JSON.stringify(v.labels) === JSON.stringify(labels)
      );

      if (existingIndex >= 0) {
        if (metric.type === 'counter') {
          metric.values[existingIndex].value += value;
        } else {
          metric.values[existingIndex].value = value;
        }
      } else {
        metric.values.push({ labels, value });
      }
    } else {
      if (metric.type === 'counter' && metric.value !== undefined) {
        metric.value += value;
      } else {
        metric.value = value;
      }
    }
  }

  public collectSystemMetrics(): void {
    // Memory metrics
    if ('performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      this.updateMetric('cyberpunk_gm_memory_usage_bytes', memory.usedJSHeapSize);
    }

    // Active users (simplified - in production would use server-side tracking)
    this.updateMetric('cyberpunk_gm_active_users', 1);
  }

  private formatMetrics(): string {
    const lines: string[] = [];
    const timestamp = Date.now();

    this.metrics.forEach((metric) => {
      // Add help text
      lines.push(`# HELP ${metric.name} ${metric.help}`);
      lines.push(`# TYPE ${metric.name} ${metric.type}`);

      // Add metric values
      if (metric.values && metric.values.length > 0) {
        metric.values.forEach(({ labels, value }) => {
          const labelStr = Object.entries(labels)
            .map(([k, v]) => `${k}="${v}"`)
            .join(',');
          lines.push(`${metric.name}{${labelStr}} ${value} ${timestamp}`);
        });
      } else if (metric.value !== undefined) {
        lines.push(`${metric.name} ${metric.value} ${timestamp}`);
      }
      
      lines.push(''); // Empty line between metrics
    });

    return lines.join('\n');
  }

  private async pushMetrics(): Promise<void> {
    try {
      // Collect latest system metrics
      this.collectSystemMetrics();

      const metricsData = this.formatMetrics();
      const pushUrl = `${this.config.endpoint}/metrics/job/${this.config.jobName}/instance/${this.config.instance}`;

      const headers: HeadersInit = {
        'Content-Type': 'text/plain; version=0.0.4'
      };

      // Add basic auth if configured
      if (this.config.username && this.config.password) {
        headers['Authorization'] = 'Basic ' + btoa(`${this.config.username}:${this.config.password}`);
      }

      const response = await fetch(pushUrl, {
        method: 'POST',
        headers,
        body: metricsData
      });

      if (!response.ok) {
        throw new Error(`Push failed: ${response.status} ${response.statusText}`);
      }

      console.debug('Metrics pushed successfully');
    } catch (error) {
      console.error('Failed to push metrics:', error);
    }
  }

  private startPushGateway(): void {
    // Initial push
    this.pushMetrics();

    // Schedule regular pushes
    this.pushTimer = setInterval(() => {
      this.pushMetrics();
    }, this.config.pushInterval);
  }

  public stopPushGateway(): void {
    if (this.pushTimer) {
      clearInterval(this.pushTimer);
    }
  }

  // Helper method to record RUM metrics
  public recordRUMMetric(name: string, value: number, tags: Record<string, string>): void {
    // Map RUM metrics to Prometheus metrics
    switch (name) {
      case 'panel.opened':
        this.updateMetric('cyberpunk_gm_panel_opens_total', 1, {
          panel_type: tags.panelType,
          panel_id: tags.panelId
        });
        break;

      case 'panel.focus.duration':
        this.updateMetric('cyberpunk_gm_panel_focus_duration_seconds', value / 1000, {
          panel_type: tags.panelType,
          panel_id: tags.panelId
        });
        break;

      case 'panel.interaction':
        this.updateMetric('cyberpunk_gm_panel_interactions_total', 1, {
          panel_type: tags.panelId,
          interaction_type: tags.interactionType
        });
        break;

      case 'dice.rolled':
        this.updateMetric('cyberpunk_gm_dice_rolls_total', 1, {
          formula: tags.formula
        });
        if (tags.critical === 'true') {
          this.updateMetric('cyberpunk_gm_dice_critical_total', 1);
        }
        if (tags.fumble === 'true') {
          this.updateMetric('cyberpunk_gm_dice_fumble_total', 1);
        }
        break;

      case 'dice.result':
        this.updateMetric('cyberpunk_gm_dice_result_value', value, {
          formula: tags.formula
        });
        break;

      case 'page.load.time':
        this.updateMetric('cyberpunk_gm_page_load_duration_seconds', value / 1000, {
          page: tags.page
        });
        break;

      case 'lcp':
        this.updateMetric('cyberpunk_gm_lcp_duration_seconds', value / 1000, {
          page: tags.page
        });
        break;

      case 'fid':
        this.updateMetric('cyberpunk_gm_fid_duration_seconds', value / 1000, {
          event_type: tags.eventType
        });
        break;

      case 'session.duration':
        this.updateMetric('cyberpunk_gm_session_duration_seconds', value / 1000);
        break;

      case 'resource.load.time':
        this.updateMetric('cyberpunk_gm_resource_load_duration_seconds', value / 1000, {
          resource_type: tags.type,
          resource_name: tags.resource
        });
        break;
    }
  }

  // Helper method to record errors
  public recordError(type: string, severity: string = 'error'): void {
    this.updateMetric('cyberpunk_gm_errors_total', 1, {
      error_type: type,
      severity
    });
  }

  public getMetricsEndpoint(): string {
    return `${this.config.endpoint}/metrics`;
  }
}

// Export singleton
let exporterInstance: PrometheusExporter | null = null;

export function initializePrometheus(config: PrometheusConfig): PrometheusExporter {
  if (exporterInstance) {
    exporterInstance.stopPushGateway();
  }
  exporterInstance = new PrometheusExporter(config);
  return exporterInstance;
}

export function getPrometheusExporter(): PrometheusExporter | null {
  return exporterInstance;
}