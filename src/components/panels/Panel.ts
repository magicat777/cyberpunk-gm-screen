import { Component, ComponentOptions } from '@/components/common/Component';
import { PanelConfig, Position, Size, PanelType } from '@/types';
import { DragHandler } from '@/utils/DragHandler';
import { ResizeHandler } from '@/utils/ResizeHandler';
import { eventBus, Events } from '@/lib/EventBus';
import { appStore, actions } from '@/stores/appStore';
import styles from './Panel.module.scss';

export interface PanelProps extends PanelConfig {
  content?: Component;
}

export class Panel extends Component<PanelProps> {
  private dragHandler: DragHandler | null = null;
  private resizeHandler: ResizeHandler | null = null;
  private headerElement: HTMLElement | null = null;
  private contentElement: HTMLElement | null = null;
  private contentComponent: Component | null = null;
  private isMaximized = false;
  private previousState: { position: Position; size: Size } | null = null;

  constructor(options: ComponentOptions<PanelProps>) {
    super(options);
    
    // Set initial position and size
    if (this._props.position) {
      this._state.position = this._props.position;
    }
    if (this._props.size) {
      this._state.size = this._props.size;
    }
  }

  protected init(): void {
    super.init();
    
    // Subscribe to store updates for this panel
    const unsubscribe = appStore.subscribeToSlice(
      state => state.panels.find(p => p.id === this._props.id),
      (panel, prevPanel) => {
        if (panel && prevPanel) {
          this.handleStoreUpdate(panel);
        }
      }
    );
    
    this._subscriptions.push(unsubscribe);
  }

  render(): HTMLElement {
    const panel = this.createElement('div', {
      className: styles.panel,
      attributes: {
        'data-panel-id': this._props.id,
        'data-panel-type': this._props.type,
        'data-font-scale': '1',
        role: 'region',
        'aria-label': this._props.title,
      },
    });

    // Apply initial position and size
    this.applyStyles(panel);

    // Create header
    this.headerElement = this.renderHeader();
    panel.appendChild(this.headerElement);

    // Create content area
    this.contentElement = this.renderContent();
    panel.appendChild(this.contentElement);

    // Create resize handles if resizable
    if (this._props.resizable) {
      this.renderResizeHandles(panel);
    }

    return panel;
  }

  private renderHeader(): HTMLElement {
    const header = this.createElement('div', {
      className: styles.header,
      attributes: {
        role: 'heading',
        'aria-level': '2',
      },
    });

    // Title
    const title = this.createElement('h3', {
      className: styles.title,
      text: this._props.title,
    });
    header.appendChild(title);

    // Controls
    const controls = this.createElement('div', {
      className: styles.controls,
    });

    if (this._props.collapsible !== false) {
      const minimizeBtn = this.createControlButton('minimize', '−', 'Minimize panel');
      controls.appendChild(minimizeBtn);
    }

    const maximizeBtn = this.createControlButton('maximize', '□', 'Maximize panel');
    controls.appendChild(maximizeBtn);

    if (this._props.closable !== false) {
      const closeBtn = this.createControlButton('close', '×', 'Close panel');
      controls.appendChild(closeBtn);
    }

    header.appendChild(controls);

    return header;
  }

  private renderContent(): HTMLElement {
    const content = this.createElement('div', {
      className: styles.content,
      attributes: {
        role: 'main',
        'aria-busy': 'false',
      },
    });

    // Load panel content
    if (this._props.content) {
      this.contentComponent = this._props.content;
      this.contentComponent.mount(content);
    } else {
      this.loadPanelContent(content);
    }

    return content;
  }

  private renderResizeHandles(panel: HTMLElement): void {
    const directions = ['Top', 'Right', 'Bottom', 'Left', 'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'];
    
    directions.forEach(dir => {
      const handle = this.createElement('div', {
        className: `${styles.resizeHandle} ${styles[`resizeHandle${dir}`]}`,
        attributes: {
          'aria-hidden': 'true',
        },
      });
      panel.appendChild(handle);
    });
  }

  private createControlButton(action: string, icon: string, label: string): HTMLButtonElement {
    const button = this.createElement('button', {
      className: `${styles.control} ${styles[`control${action.charAt(0).toUpperCase() + action.slice(1)}`]}`,
      attributes: {
        'aria-label': label,
        type: 'button',
      },
      text: icon,
    }) as HTMLButtonElement;

    button.addEventListener('click', () => {
      switch (action) {
        case 'minimize':
          this.minimize();
          break;
        case 'maximize':
          this.maximize();
          break;
        case 'close':
          this.close();
          break;
      }
    });

    return button;
  }

  protected afterMount(): void {
    // Initialize drag handler
    if (this._props.draggable !== false && this.headerElement && this._element) {
      this.dragHandler = new DragHandler(this._element, {
        handle: this.headerElement,
        constrainToParent: true,
        snapToGrid: 0,
        onDragEnd: (position) => {
          appStore.dispatchAction(actions.updatePanel(this._props.id, { position }));
        },
      });
    }

    // Initialize resize handler
    if (this._props.resizable !== false && this._element) {
      this.resizeHandler = new ResizeHandler(this._element, {
        minSize: this._props.minSize || { width: 200, height: 150 },
        maxSize: this._props.maxSize,
        snapToGrid: 0,
        onResizeEnd: (size) => {
          appStore.dispatchAction(actions.updatePanel(this._props.id, { size }));
        },
      });
    }

    // Set focus on mount
    this.focus();
  }

  protected beforeUnmount(): void {
    // Clean up handlers
    this.dragHandler?.destroy();
    this.resizeHandler?.destroy();
    
    // Unmount content component
    this.contentComponent?.unmount();
  }

  protected setupEventListeners(): void {
    if (!this._element) return;

    // Focus management
    this._element.addEventListener('mousedown', () => {
      this.focus();
    });

    this._element.addEventListener('touchstart', () => {
      this.focus();
    });

    // Keyboard navigation
    this._element.addEventListener('keydown', (e) => {
      this.handleKeyDown(e as KeyboardEvent);
    });
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this._element) return;

    const step = e.shiftKey ? 10 : 1;
    let position = this.getPosition();
    let size = this.getSize();
    let handled = false;

    // Move with arrow keys
    if (!e.ctrlKey && !e.altKey) {
      switch (e.key) {
        case 'ArrowLeft':
          position.x -= step;
          handled = true;
          break;
        case 'ArrowRight':
          position.x += step;
          handled = true;
          break;
        case 'ArrowUp':
          position.y -= step;
          handled = true;
          break;
        case 'ArrowDown':
          position.y += step;
          handled = true;
          break;
      }
      
      if (handled) {
        this.setPosition(position);
        appStore.dispatchAction(actions.updatePanel(this._props.id, { position }));
      }
    }

    // Resize with Ctrl+Arrow keys
    if (e.ctrlKey && !e.altKey) {
      switch (e.key) {
        case 'ArrowLeft':
          size.width -= step;
          handled = true;
          break;
        case 'ArrowRight':
          size.width += step;
          handled = true;
          break;
        case 'ArrowUp':
          size.height -= step;
          handled = true;
          break;
        case 'ArrowDown':
          size.height += step;
          handled = true;
          break;
      }
      
      if (handled) {
        this.setSize(size);
        appStore.dispatchAction(actions.updatePanel(this._props.id, { size }));
      }
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  private async loadPanelContent(container: HTMLElement): Promise<void> {
    this.setState({ loading: true });
    
    try {
      // Dynamic import based on panel type
      const module = await import(`../panels/${this._props.type}/index.js`);
      const PanelContent = module.default;
      
      this.contentComponent = new PanelContent({
        props: this._props.settings,
        eventBus: this._eventBus,
        parent: this,
      });
      
      this.contentComponent.mount(container);
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ 
        loading: false, 
        error: error as Error,
      });
      
      // Show error state
      container.innerHTML = `
        <div class="${styles.error}">
          <p>Error loading panel: ${(error as Error).message}</p>
          <button onclick="this.closest('[data-panel-id]').__component.retryLoad()">
            Retry
          </button>
        </div>
      `;
    }
  }

  private handleStoreUpdate(panelConfig: PanelConfig): void {
    // Update position if changed
    if (panelConfig.position && 
        (panelConfig.position.x !== this._props.position.x || 
         panelConfig.position.y !== this._props.position.y)) {
      this.setPosition(panelConfig.position);
      this._props.position = panelConfig.position;
    }

    // Update size if changed
    if (panelConfig.size && 
        (panelConfig.size.width !== this._props.size.width || 
         panelConfig.size.height !== this._props.size.height)) {
      this.setSize(panelConfig.size);
      this._props.size = panelConfig.size;
    }

    // Update visibility
    if (panelConfig.visible !== this._props.visible) {
      this._props.visible = panelConfig.visible;
      this.setVisible(panelConfig.visible);
    }

    // Update z-index
    if (panelConfig.zIndex !== this._props.zIndex) {
      this._props.zIndex = panelConfig.zIndex;
      if (this._element) {
        this._element.style.zIndex = panelConfig.zIndex.toString();
      }
    }
  }

  update(): void {
    if (!this._element) return;

    // Update visibility
    this._element.style.display = this._state.visible ? 'block' : 'none';

    // Update loading state
    this._element.classList.toggle(styles.loading, this._state.loading);
    if (this.contentElement) {
      this.contentElement.setAttribute('aria-busy', this._state.loading ? 'true' : 'false');
    }

    // Update active state
    const isActive = appStore.getState().ui.activePanel === this._props.id;
    this._element.classList.toggle(styles.active, isActive);
  }

  // Public API
  focus(): void {
    appStore.dispatchAction(actions.setActivePanel(this._props.id));
    this._element?.focus();
    this.emit('panel:focus');
  }

  blur(): void {
    if (appStore.getState().ui.activePanel === this._props.id) {
      appStore.dispatchAction(actions.setActivePanel(null));
    }
    this.emit('panel:blur');
  }

  minimize(): void {
    this._element?.classList.add(styles.minimized);
    this.setState({ minimized: true });
    this.emit('panel:minimize');
  }

  restore(): void {
    this._element?.classList.remove(styles.minimized);
    this.setState({ minimized: false });
    this.emit('panel:restore');
  }

  maximize(): void {
    if (!this._element) return;

    if (!this.isMaximized) {
      // Save current state
      this.previousState = {
        position: this.getPosition(),
        size: this.getSize(),
      };

      // Maximize
      this._element.classList.add(styles.maximized);
      this.isMaximized = true;
      
      // Disable drag and resize
      this.dragHandler?.disable();
      this.resizeHandler?.disable();
    } else {
      // Restore previous state
      this._element.classList.remove(styles.maximized);
      this.isMaximized = false;

      if (this.previousState) {
        this.setPosition(this.previousState.position);
        this.setSize(this.previousState.size);
      }

      // Re-enable drag and resize
      this.dragHandler?.enable();
      this.resizeHandler?.enable();
    }

    this.emit('panel:maximize', { maximized: this.isMaximized });
  }

  close(): void {
    this.emit('panel:beforeClose');
    appStore.dispatchAction(actions.removePanel(this._props.id));
    this.destroy();
    this.emit('panel:close');
  }

  setPosition(position: Position): void {
    this._props.position = position;
    if (this._element) {
      this._element.style.left = `${position.x}px`;
      this._element.style.top = `${position.y}px`;
    }
    this.dragHandler?.setPosition(position);
  }

  getPosition(): Position {
    return { ...this._props.position };
  }

  setSize(size: Size): void {
    this._props.size = size;
    if (this._element) {
      this._element.style.width = `${size.width}px`;
      this._element.style.height = `${size.height}px`;
    }
    this.resizeHandler?.setSize(size);
  }

  getSize(): Size {
    return { ...this._props.size };
  }

  setVisible(visible: boolean): void {
    this.setState({ visible });
  }

  setFontScale(scale: number): void {
    if (this._element) {
      this._element.dataset.fontScale = scale.toString();
    }
  }

  private applyStyles(element: HTMLElement): void {
    Object.assign(element.style, {
      position: 'absolute',
      left: `${this._props.position.x}px`,
      top: `${this._props.position.y}px`,
      width: `${this._props.size.width}px`,
      height: `${this._props.size.height}px`,
      zIndex: this._props.zIndex.toString(),
    });
  }

  retryLoad(): void {
    if (this.contentElement) {
      this.loadPanelContent(this.contentElement);
    }
  }
}