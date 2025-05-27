import { Component, ComponentOptions } from '@/components/common/Component';
import { Panel } from '@/components/panels/Panel';
import { PanelConfig, PanelType, Position, Size, Breakpoint } from '@/types';
import { appStore, actions, selectors, thunks } from '@/stores/appStore';
import { eventBus, Events } from '@/lib/EventBus';

export interface PanelManagerOptions {
  container?: HTMLElement;
  snapToGrid?: number;
  maxPanels?: number;
}

export class PanelManager extends Component<PanelManagerOptions> {
  private panels: Map<string, Panel> = new Map();
  private container: HTMLElement | null = null;
  private currentBreakpoint: Breakpoint = Breakpoint.DESKTOP;

  protected init(): void {
    super.init();

    // Subscribe to store changes
    const unsubscribePanels = appStore.subscribeToSlice(
      selectors.getPanels,
      (panels) => {
        this.syncPanels(panels);
      }
    );

    const unsubscribeBreakpoint = appStore.subscribeToSlice(
      selectors.getBreakpoint,
      (breakpoint) => {
        this.handleBreakpointChange(breakpoint);
      }
    );

    this._subscriptions.push(unsubscribePanels, unsubscribeBreakpoint);

    // Subscribe to panel events
    this.setupEventSubscriptions();

    // Initialize with current panels
    const currentPanels = selectors.getPanels(appStore.getState());
    this.syncPanels(currentPanels);
  }

  render(): HTMLElement {
    this.container = this.createElement('div', {
      className: 'panel-container',
      attributes: {
        role: 'region',
        'aria-label': 'Panel container',
      },
    });

    // Apply responsive styles
    this.applyResponsiveStyles();

    return this.container;
  }

  private setupEventSubscriptions(): void {
    // Panel lifecycle events
    this.on('panel:create', ({ type, config }: { type: PanelType; config?: Partial<PanelConfig> }) => {
      this.createPanel(type, config);
    });

    this.on('panel:remove', ({ panelId }: { panelId: string }) => {
      this.removePanel(panelId);
    });

    // Global events
    eventBus.on(Events.PANEL_CREATE, ({ type, config }) => {
      this.createPanel(type, config);
    });

    eventBus.on(Events.PANEL_REMOVE, ({ panelId }) => {
      this.removePanel(panelId);
    });

    // Focus management
    eventBus.on(Events.PANEL_FOCUS, ({ panelId }) => {
      this.focusPanel(panelId);
    });

    // Window resize
    this.setupResizeObserver();
  }

  private setupResizeObserver(): void {
    const resizeObserver = new ResizeObserver(
      this.debounce(() => {
        this.updateBreakpoint();
        this.adjustPanelsForViewport();
      }, 150)
    );

    if (this.container) {
      resizeObserver.observe(this.container);
    }

    // Clean up on destroy
    this._subscriptions.push(() => resizeObserver.disconnect());
  }

  private syncPanels(panelConfigs: PanelConfig[]): void {
    // Remove panels that no longer exist
    const configIds = new Set(panelConfigs.map(p => p.id));
    this.panels.forEach((panel, id) => {
      if (!configIds.has(id)) {
        this.removePanel(id);
      }
    });

    // Add or update panels
    panelConfigs.forEach(config => {
      if (!this.panels.has(config.id)) {
        this.addPanel(config);
      }
    });
  }

  private addPanel(config: PanelConfig): void {
    // Check max panels limit
    if (this._props.maxPanels && this.panels.size >= this._props.maxPanels) {
      appStore.dispatchAction(thunks.showNotification({
        type: 'warning',
        title: 'Panel Limit Reached',
        message: `Maximum of ${this._props.maxPanels} panels allowed`,
        duration: 3000,
      }));
      return;
    }

    // Create panel component
    const panel = new Panel({
      props: config,
      eventBus: this._eventBus,
      parent: this,
    });

    // Mount to container
    if (this.container) {
      panel.mount(this.container);
    }

    // Store reference
    this.panels.set(config.id, panel);

    // Apply responsive adjustments
    if (this.currentBreakpoint !== Breakpoint.DESKTOP) {
      this.adjustPanelForBreakpoint(panel, this.currentBreakpoint);
    }

    // Emit event
    this.emit('panel:added', { panelId: config.id });
  }

  private removePanel(panelId: string): void {
    const panel = this.panels.get(panelId);
    if (!panel) return;

    // Destroy panel
    panel.destroy();
    this.panels.delete(panelId);

    // Emit event
    this.emit('panel:removed', { panelId });
  }

  private focusPanel(panelId: string): void {
    const panel = this.panels.get(panelId);
    if (!panel) return;

    // Update z-indices
    let maxZ = 0;
    this.panels.forEach(p => {
      const config = selectors.getPanelById(appStore.getState(), p.id);
      if (config && config.zIndex > maxZ) {
        maxZ = config.zIndex;
      }
    });

    // Set focused panel to highest z-index
    appStore.dispatchAction(actions.updatePanel(panelId, { zIndex: maxZ + 1 }));
  }

  public createPanel(type: PanelType, config?: Partial<PanelConfig>): void {
    const newPanel = appStore.dispatchAction(thunks.createPanel(type, config?.title));
    
    if (config) {
      appStore.dispatchAction(actions.updatePanel(newPanel.id, config));
    }
  }

  public arrangePanels(arrangement: 'cascade' | 'tile' | 'stack'): void {
    const panels = Array.from(this.panels.values());
    if (panels.length === 0) return;

    const containerRect = this.container?.getBoundingClientRect();
    if (!containerRect) return;

    const updates: Array<{ id: string; position: Position; size?: Size }> = [];

    switch (arrangement) {
      case 'cascade':
        panels.forEach((panel, index) => {
          updates.push({
            id: panel.id,
            position: {
              x: 50 + (index * 30),
              y: 50 + (index * 30),
            },
          });
        });
        break;

      case 'tile':
        const cols = Math.ceil(Math.sqrt(panels.length));
        const rows = Math.ceil(panels.length / cols);
        const width = Math.floor(containerRect.width / cols) - 20;
        const height = Math.floor(containerRect.height / rows) - 20;

        panels.forEach((panel, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          
          updates.push({
            id: panel.id,
            position: {
              x: 10 + (col * (width + 10)),
              y: 10 + (row * (height + 10)),
            },
            size: { width, height },
          });
        });
        break;

      case 'stack':
        const stackWidth = Math.min(600, containerRect.width - 100);
        const stackHeight = Math.min(400, containerRect.height - 100);
        const centerX = (containerRect.width - stackWidth) / 2;
        const centerY = (containerRect.height - stackHeight) / 2;

        panels.forEach((panel) => {
          updates.push({
            id: panel.id,
            position: { x: centerX, y: centerY },
            size: { width: stackWidth, height: stackHeight },
          });
        });
        break;
    }

    // Apply updates
    updates.forEach(update => {
      appStore.dispatchAction(actions.updatePanel(update.id, {
        position: update.position,
        size: update.size,
      }));
    });
  }

  private updateBreakpoint(): void {
    const width = window.innerWidth;
    let breakpoint: Breakpoint;

    if (width < 768) {
      breakpoint = Breakpoint.MOBILE;
    } else if (width < 1024) {
      breakpoint = Breakpoint.TABLET;
    } else if (width >= 1536) {
      breakpoint = Breakpoint.WIDE;
    } else {
      breakpoint = Breakpoint.DESKTOP;
    }

    if (breakpoint !== this.currentBreakpoint) {
      appStore.dispatchAction(actions.setBreakpoint(breakpoint));
    }
  }

  private handleBreakpointChange(breakpoint: Breakpoint): void {
    const previousBreakpoint = this.currentBreakpoint;
    this.currentBreakpoint = breakpoint;

    // Apply responsive styles
    this.applyResponsiveStyles();

    // Adjust panels if moving to/from mobile
    if (breakpoint === Breakpoint.MOBILE || previousBreakpoint === Breakpoint.MOBILE) {
      this.adjustPanelsForViewport();
    }

    this.emit('breakpoint:change', { breakpoint, previousBreakpoint });
  }

  private applyResponsiveStyles(): void {
    if (!this.container) return;

    // Remove all breakpoint classes
    this.container.classList.remove('mobile', 'tablet', 'desktop', 'wide');

    // Add current breakpoint class
    switch (this.currentBreakpoint) {
      case Breakpoint.MOBILE:
        this.container.classList.add('mobile');
        break;
      case Breakpoint.TABLET:
        this.container.classList.add('tablet');
        break;
      case Breakpoint.DESKTOP:
        this.container.classList.add('desktop');
        break;
      case Breakpoint.WIDE:
        this.container.classList.add('wide');
        break;
    }
  }

  private adjustPanelsForViewport(): void {
    this.panels.forEach(panel => {
      this.adjustPanelForBreakpoint(panel, this.currentBreakpoint);
    });
  }

  private adjustPanelForBreakpoint(panel: Panel, breakpoint: Breakpoint): void {
    switch (breakpoint) {
      case Breakpoint.MOBILE:
        // Stack panels vertically on mobile
        panel.setProps({
          draggable: false,
          resizable: false,
        });
        break;

      case Breakpoint.TABLET:
        // Limited drag on tablet
        panel.setProps({
          draggable: true,
          resizable: false,
        });
        break;

      case Breakpoint.DESKTOP:
      case Breakpoint.WIDE:
        // Full functionality on desktop
        panel.setProps({
          draggable: true,
          resizable: true,
        });
        break;
    }
  }

  update(): void {
    // Update container visibility or state if needed
  }

  public getPanels(): Panel[] {
    return Array.from(this.panels.values());
  }

  public getPanel(panelId: string): Panel | undefined {
    return this.panels.get(panelId);
  }

  public minimizeAll(): void {
    this.panels.forEach(panel => panel.minimize());
  }

  public restoreAll(): void {
    this.panels.forEach(panel => panel.restore());
  }

  public closeAll(): void {
    const panelIds = Array.from(this.panels.keys());
    panelIds.forEach(id => {
      appStore.dispatchAction(actions.removePanel(id));
    });
  }
}