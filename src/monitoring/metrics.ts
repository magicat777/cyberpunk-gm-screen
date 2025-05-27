/**
 * Custom Metrics Collection for Cyberpunk GM Screen
 * Tracks panel usage, dice rolls, and user behavior
 */

import { getRUM } from './rum';
import { EventBus } from '../lib/EventBus';

interface PanelMetrics {
  panelId: string;
  panelType: string;
  openCount: number;
  closeCount: number;
  focusTime: number;
  interactionCount: number;
  lastInteraction: number;
}

interface DiceMetrics {
  totalRolls: number;
  criticalRolls: number;
  fumbleRolls: number;
  averageResult: number;
  formulaUsage: Map<string, number>;
}

interface SessionMetrics {
  sessionStart: number;
  sessionDuration: number;
  panelsUsed: Set<string>;
  totalInteractions: number;
  errorCount: number;
}

export class MetricsCollector {
  private eventBus: EventBus;
  private panelMetrics: Map<string, PanelMetrics> = new Map();
  private diceMetrics: DiceMetrics = {
    totalRolls: 0,
    criticalRolls: 0,
    fumbleRolls: 0,
    averageResult: 0,
    formulaUsage: new Map()
  };
  private sessionMetrics: SessionMetrics = {
    sessionStart: Date.now(),
    sessionDuration: 0,
    panelsUsed: new Set(),
    totalInteractions: 0,
    errorCount: 0
  };
  private focusTimers: Map<string, number> = new Map();

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.setupEventListeners();
    this.startSessionTracking();
  }

  private setupEventListeners(): void {
    // Panel events
    this.eventBus.on('panel:opened', this.handlePanelOpened.bind(this));
    this.eventBus.on('panel:closed', this.handlePanelClosed.bind(this));
    this.eventBus.on('panel:focused', this.handlePanelFocused.bind(this));
    this.eventBus.on('panel:blurred', this.handlePanelBlurred.bind(this));
    this.eventBus.on('panel:interaction', this.handlePanelInteraction.bind(this));

    // Dice events
    this.eventBus.on('dice:rolled', this.handleDiceRoll.bind(this));

    // Error events
    this.eventBus.on('error:occurred', this.handleError.bind(this));

    // User behavior events
    this.eventBus.on('theme:changed', this.handleThemeChange.bind(this));
    this.eventBus.on('layout:saved', this.handleLayoutSave.bind(this));
    this.eventBus.on('layout:loaded', this.handleLayoutLoad.bind(this));
  }

  private handlePanelOpened(event: string, data: any): void {
    const { panelId, panelType } = data;
    
    if (!this.panelMetrics.has(panelId)) {
      this.panelMetrics.set(panelId, {
        panelId,
        panelType,
        openCount: 0,
        closeCount: 0,
        focusTime: 0,
        interactionCount: 0,
        lastInteraction: Date.now()
      });
    }

    const metrics = this.panelMetrics.get(panelId)!;
    metrics.openCount++;
    this.sessionMetrics.panelsUsed.add(panelId);

    // Record to RUM
    getRUM()?.recordMetric('panel.opened', 1, {
      panelId,
      panelType
    });
  }

  private handlePanelClosed(event: string, data: any): void {
    const { panelId } = data;
    const metrics = this.panelMetrics.get(panelId);
    
    if (metrics) {
      metrics.closeCount++;
      
      // Stop focus timer if running
      if (this.focusTimers.has(panelId)) {
        const startTime = this.focusTimers.get(panelId)!;
        const focusDuration = Date.now() - startTime;
        metrics.focusTime += focusDuration;
        this.focusTimers.delete(panelId);
        
        getRUM()?.recordMetric('panel.focus.duration', focusDuration, {
          panelId,
          panelType: metrics.panelType
        });
      }
    }

    getRUM()?.recordMetric('panel.closed', 1, {
      panelId
    });
  }

  private handlePanelFocused(event: string, data: any): void {
    const { panelId } = data;
    this.focusTimers.set(panelId, Date.now());
  }

  private handlePanelBlurred(event: string, data: any): void {
    const { panelId } = data;
    const metrics = this.panelMetrics.get(panelId);
    
    if (metrics && this.focusTimers.has(panelId)) {
      const startTime = this.focusTimers.get(panelId)!;
      const focusDuration = Date.now() - startTime;
      metrics.focusTime += focusDuration;
      this.focusTimers.delete(panelId);
      
      getRUM()?.recordMetric('panel.focus.duration', focusDuration, {
        panelId,
        panelType: metrics.panelType
      });
    }
  }

  private handlePanelInteraction(event: string, data: any): void {
    const { panelId, interactionType } = data;
    const metrics = this.panelMetrics.get(panelId);
    
    if (metrics) {
      metrics.interactionCount++;
      metrics.lastInteraction = Date.now();
    }
    
    this.sessionMetrics.totalInteractions++;
    
    getRUM()?.recordMetric('panel.interaction', 1, {
      panelId,
      interactionType
    });
  }

  private handleDiceRoll(event: string, data: any): void {
    const { formula, total, rolls, critical, fumble } = data;
    
    this.diceMetrics.totalRolls++;
    if (critical) this.diceMetrics.criticalRolls++;
    if (fumble) this.diceMetrics.fumbleRolls++;
    
    // Update average
    const currentAvg = this.diceMetrics.averageResult;
    const totalRolls = this.diceMetrics.totalRolls;
    this.diceMetrics.averageResult = ((currentAvg * (totalRolls - 1)) + total) / totalRolls;
    
    // Track formula usage
    const formulaCount = this.diceMetrics.formulaUsage.get(formula) || 0;
    this.diceMetrics.formulaUsage.set(formula, formulaCount + 1);
    
    getRUM()?.recordMetric('dice.rolled', 1, {
      formula,
      critical: String(critical || false),
      fumble: String(fumble || false)
    });
    
    getRUM()?.recordMetric('dice.result', total, {
      formula
    });
  }

  private handleError(event: string, data: any): void {
    this.sessionMetrics.errorCount++;
    
    getRUM()?.trackError({
      message: data.message,
      stack: data.stack,
      type: data.type || 'application',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }

  private handleThemeChange(event: string, data: any): void {
    getRUM()?.trackAction({
      type: 'theme_change',
      target: data.theme,
      timestamp: Date.now()
    });
  }

  private handleLayoutSave(event: string, data: any): void {
    getRUM()?.trackAction({
      type: 'layout_save',
      target: data.layoutName || 'default',
      timestamp: Date.now(),
      metadata: {
        panelCount: data.panels?.length || 0
      }
    });
  }

  private handleLayoutLoad(event: string, data: any): void {
    getRUM()?.trackAction({
      type: 'layout_load',
      target: data.layoutName || 'default',
      timestamp: Date.now()
    });
  }

  private startSessionTracking(): void {
    // Update session duration every minute
    setInterval(() => {
      this.sessionMetrics.sessionDuration = Date.now() - this.sessionMetrics.sessionStart;
      
      getRUM()?.recordMetric('session.duration', this.sessionMetrics.sessionDuration, {
        panelsUsed: String(this.sessionMetrics.panelsUsed.size),
        interactions: String(this.sessionMetrics.totalInteractions)
      });
    }, 60000);

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.sendFinalMetrics();
    });
  }

  private sendFinalMetrics(): void {
    const sessionDuration = Date.now() - this.sessionMetrics.sessionStart;
    
    // Session summary
    getRUM()?.recordMetric('session.completed', 1, {
      duration: String(sessionDuration),
      panelsUsed: String(this.sessionMetrics.panelsUsed.size),
      totalInteractions: String(this.sessionMetrics.totalInteractions),
      errors: String(this.sessionMetrics.errorCount)
    });

    // Panel usage summary
    this.panelMetrics.forEach((metrics) => {
      getRUM()?.recordMetric('panel.usage.summary', metrics.interactionCount, {
        panelId: metrics.panelId,
        panelType: metrics.panelType,
        opens: String(metrics.openCount),
        focusTime: String(metrics.focusTime)
      });
    });

    // Dice usage summary
    if (this.diceMetrics.totalRolls > 0) {
      getRUM()?.recordMetric('dice.usage.summary', this.diceMetrics.totalRolls, {
        criticals: String(this.diceMetrics.criticalRolls),
        fumbles: String(this.diceMetrics.fumbleRolls),
        avgResult: String(Math.round(this.diceMetrics.averageResult * 100) / 100)
      });

      // Most used formulas
      const topFormulas = Array.from(this.diceMetrics.formulaUsage.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      topFormulas.forEach(([formula, count], index) => {
        getRUM()?.recordMetric('dice.formula.popularity', count, {
          formula,
          rank: String(index + 1)
        });
      });
    }
  }

  public getMetricsSummary(): any {
    return {
      session: {
        ...this.sessionMetrics,
        duration: Date.now() - this.sessionMetrics.sessionStart,
        panelsUsed: Array.from(this.sessionMetrics.panelsUsed)
      },
      panels: Array.from(this.panelMetrics.values()),
      dice: {
        ...this.diceMetrics,
        formulaUsage: Array.from(this.diceMetrics.formulaUsage.entries())
      }
    };
  }

  public resetMetrics(): void {
    this.panelMetrics.clear();
    this.diceMetrics = {
      totalRolls: 0,
      criticalRolls: 0,
      fumbleRolls: 0,
      averageResult: 0,
      formulaUsage: new Map()
    };
    this.sessionMetrics = {
      sessionStart: Date.now(),
      sessionDuration: 0,
      panelsUsed: new Set(),
      totalInteractions: 0,
      errorCount: 0
    };
    this.focusTimers.clear();
  }
}

// Export singleton
let metricsInstance: MetricsCollector | null = null;

export function initializeMetrics(eventBus: EventBus): MetricsCollector {
  if (!metricsInstance) {
    metricsInstance = new MetricsCollector(eventBus);
  }
  return metricsInstance;
}

export function getMetrics(): MetricsCollector | null {
  return metricsInstance;
}