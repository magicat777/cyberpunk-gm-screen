/**
 * Debug Mode Implementation
 * Provides development tools and debugging capabilities
 */

import { EventBus } from '../lib/EventBus';
import { Store } from '../lib/Store';
import { getMetrics } from './metrics';
import { LogLevel, initializeLogger } from './logger';

interface DebugConfig {
  enabled: boolean;
  showMetrics: boolean;
  showEvents: boolean;
  showState: boolean;
  showPerformance: boolean;
  logLevel: LogLevel;
}

export class DebugMode {
  private config: DebugConfig;
  private eventBus: EventBus;
  private store: Store;
  private debugPanel: HTMLElement | null = null;
  private eventLog: Array<{ event: string; data: any; timestamp: number }> = [];
  private performanceMarks: Map<string, number> = new Map();

  constructor(eventBus: EventBus, store: Store, config: Partial<DebugConfig> = {}) {
    this.eventBus = eventBus;
    this.store = store;
    this.config = {
      enabled: false,
      showMetrics: true,
      showEvents: true,
      showState: true,
      showPerformance: true,
      logLevel: LogLevel.DEBUG,
      ...config
    };

    this.initialize();
  }

  private initialize(): void {
    // Check for debug mode in URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
      this.enable();
    }

    // Keyboard shortcut: Ctrl+Shift+D
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        this.toggle();
      }
    });

    // Console API
    (window as any).debug = {
      enable: () => this.enable(),
      disable: () => this.disable(),
      toggle: () => this.toggle(),
      getState: () => this.store.getState(),
      getMetrics: () => getMetrics()?.getMetricsSummary(),
      getEvents: () => this.eventLog,
      dispatch: (action: any) => this.store.dispatch(action),
      emit: (event: string, data: any) => this.eventBus.emit(event, data)
    };
  }

  public enable(): void {
    this.config.enabled = true;
    
    // Set debug log level
    initializeLogger({
      level: this.config.logLevel,
      enableConsole: true,
      enableRemote: false,
      bufferSize: 1000,
      flushInterval: 60000
    });

    // Start event monitoring
    if (this.config.showEvents) {
      this.startEventMonitoring();
    }

    // Create debug panel
    this.createDebugPanel();

    console.log('%c🐛 Debug Mode Enabled', 'color: #00ff00; font-size: 16px; font-weight: bold');
    console.log('Debug commands available:');
    console.log('- debug.getState() - Get current application state');
    console.log('- debug.getMetrics() - Get metrics summary');
    console.log('- debug.getEvents() - Get event log');
    console.log('- debug.dispatch(action) - Dispatch store action');
    console.log('- debug.emit(event, data) - Emit event');
  }

  public disable(): void {
    this.config.enabled = false;
    this.stopEventMonitoring();
    this.removeDebugPanel();
    console.log('%c🐛 Debug Mode Disabled', 'color: #ff0000; font-size: 16px; font-weight: bold');
  }

  public toggle(): void {
    if (this.config.enabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  private startEventMonitoring(): void {
    this.eventBus.on('*', this.logEvent.bind(this));
  }

  private stopEventMonitoring(): void {
    this.eventBus.off('*', this.logEvent.bind(this));
  }

  private logEvent(event: string, data: any): void {
    const entry = {
      event,
      data,
      timestamp: Date.now()
    };

    this.eventLog.push(entry);
    
    // Keep only last 100 events
    if (this.eventLog.length > 100) {
      this.eventLog.shift();
    }

    // Update debug panel
    if (this.debugPanel) {
      this.updateDebugPanel();
    }

    // Console log if verbose
    if (this.config.logLevel === LogLevel.DEBUG) {
      console.log(`[Event] ${event}`, data);
    }
  }

  private createDebugPanel(): void {
    this.debugPanel = document.createElement('div');
    this.debugPanel.id = 'debug-panel';
    this.debugPanel.innerHTML = `
      <style>
        #debug-panel {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 400px;
          max-height: 50vh;
          background: rgba(0, 0, 0, 0.95);
          color: #00ff00;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          border: 1px solid #00ff00;
          border-radius: 8px 0 0 0;
          z-index: 99999;
          display: flex;
          flex-direction: column;
        }
        
        #debug-panel .debug-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: rgba(0, 255, 0, 0.1);
          border-bottom: 1px solid #00ff00;
        }
        
        #debug-panel .debug-tabs {
          display: flex;
          gap: 8px;
        }
        
        #debug-panel .debug-tab {
          padding: 4px 8px;
          background: transparent;
          color: #00ff00;
          border: 1px solid #00ff00;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
        }
        
        #debug-panel .debug-tab.active {
          background: #00ff00;
          color: #000;
        }
        
        #debug-panel .debug-content {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
          font-size: 11px;
        }
        
        #debug-panel .metric-item {
          margin-bottom: 4px;
          padding: 4px;
          background: rgba(0, 255, 0, 0.05);
          border-radius: 2px;
        }
        
        #debug-panel .event-item {
          margin-bottom: 4px;
          padding: 4px;
          background: rgba(0, 255, 0, 0.05);
          border-radius: 2px;
        }
        
        #debug-panel .event-time {
          color: #888;
          font-size: 10px;
        }
        
        #debug-panel .state-tree {
          white-space: pre;
          overflow-x: auto;
        }
        
        #debug-panel .perf-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        
        #debug-panel .close-button {
          background: none;
          border: none;
          color: #ff0000;
          cursor: pointer;
          font-size: 16px;
        }
      </style>
      
      <div class="debug-header">
        <div class="debug-tabs">
          <button class="debug-tab active" data-tab="metrics">Metrics</button>
          <button class="debug-tab" data-tab="events">Events</button>
          <button class="debug-tab" data-tab="state">State</button>
          <button class="debug-tab" data-tab="performance">Perf</button>
        </div>
        <button class="close-button" onclick="debug.disable()">×</button>
      </div>
      
      <div class="debug-content" id="debug-content">
        <!-- Content will be dynamically updated -->
      </div>
    `;

    document.body.appendChild(this.debugPanel);

    // Tab switching
    this.debugPanel.querySelectorAll('.debug-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        this.debugPanel?.querySelectorAll('.debug-tab').forEach(t => t.classList.remove('active'));
        target.classList.add('active');
        this.updateDebugPanel(target.dataset.tab);
      });
    });

    // Initial update
    this.updateDebugPanel('metrics');
  }

  private removeDebugPanel(): void {
    if (this.debugPanel) {
      this.debugPanel.remove();
      this.debugPanel = null;
    }
  }

  private updateDebugPanel(tab: string = 'metrics'): void {
    if (!this.debugPanel) return;

    const content = this.debugPanel.querySelector('#debug-content');
    if (!content) return;

    switch (tab) {
      case 'metrics':
        content.innerHTML = this.renderMetrics();
        break;
      case 'events':
        content.innerHTML = this.renderEvents();
        break;
      case 'state':
        content.innerHTML = this.renderState();
        break;
      case 'performance':
        content.innerHTML = this.renderPerformance();
        break;
    }
  }

  private renderMetrics(): string {
    const metrics = getMetrics()?.getMetricsSummary();
    if (!metrics) return '<div>No metrics available</div>';

    return `
      <div class="metric-item">
        <strong>Session Duration:</strong> ${Math.round(metrics.session.duration / 1000)}s
      </div>
      <div class="metric-item">
        <strong>Total Interactions:</strong> ${metrics.session.totalInteractions}
      </div>
      <div class="metric-item">
        <strong>Panels Used:</strong> ${metrics.session.panelsUsed.length}
      </div>
      <div class="metric-item">
        <strong>Errors:</strong> ${metrics.session.errorCount}
      </div>
      <div class="metric-item">
        <strong>Dice Rolls:</strong> ${metrics.dice.totalRolls}
        (${metrics.dice.criticalRolls} crits, ${metrics.dice.fumbleRolls} fumbles)
      </div>
      <div class="metric-item">
        <strong>Avg Roll:</strong> ${metrics.dice.averageResult.toFixed(2)}
      </div>
    `;
  }

  private renderEvents(): string {
    const recentEvents = this.eventLog.slice(-20).reverse();
    
    if (recentEvents.length === 0) {
      return '<div>No events logged</div>';
    }

    return recentEvents.map(entry => `
      <div class="event-item">
        <div>
          <strong>${entry.event}</strong>
          <span class="event-time">${new Date(entry.timestamp).toLocaleTimeString()}</span>
        </div>
        <div>${JSON.stringify(entry.data, null, 2)}</div>
      </div>
    `).join('');
  }

  private renderState(): string {
    const state = this.store.getState();
    return `<pre class="state-tree">${JSON.stringify(state, null, 2)}</pre>`;
  }

  private renderPerformance(): string {
    const entries = performance.getEntriesByType('measure');
    const marks = performance.getEntriesByType('mark');
    
    return `
      <div>
        <strong>Performance Marks:</strong>
        ${marks.map(mark => `
          <div class="perf-item">
            <span>${mark.name}</span>
            <span>${mark.startTime.toFixed(2)}ms</span>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 8px;">
        <strong>Performance Measures:</strong>
        ${entries.map(entry => `
          <div class="perf-item">
            <span>${entry.name}</span>
            <span>${entry.duration.toFixed(2)}ms</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  public mark(name: string): void {
    performance.mark(name);
    this.performanceMarks.set(name, performance.now());
  }

  public measure(name: string, startMark: string, endMark?: string): void {
    performance.measure(name, startMark, endMark);
    
    if (this.config.showPerformance && this.debugPanel) {
      this.updateDebugPanel('performance');
    }
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }
}

// Export singleton
let debugInstance: DebugMode | null = null;

export function initializeDebugMode(eventBus: EventBus, store: Store, config?: Partial<DebugConfig>): DebugMode {
  if (!debugInstance) {
    debugInstance = new DebugMode(eventBus, store, config);
  }
  return debugInstance;
}

export function getDebugMode(): DebugMode | null {
  return debugInstance;
}