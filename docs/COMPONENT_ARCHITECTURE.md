# Component Architecture Specification

## Overview

The Cyberpunk GM Screen will use a component-based architecture that promotes reusability, testability, and maintainability. Components will be built using TypeScript and follow a consistent interface pattern.

## Core Architecture Principles

1. **Single Responsibility**: Each component does one thing well
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Props Down, Events Up**: Unidirectional data flow
4. **Dependency Injection**: Components receive dependencies, don't create them
5. **Interface-First Design**: Define contracts before implementation

## Component Hierarchy

```
App
├── Layout
│   ├── NavigationBar
│   │   ├── NavItem
│   │   ├── ThemeSelector
│   │   └── SettingsMenu
│   ├── PanelContainer
│   │   ├── Panel
│   │   │   ├── PanelHeader
│   │   │   ├── PanelContent
│   │   │   └── PanelFooter
│   │   └── PanelOverlay
│   └── StatusBar
├── Panels
│   ├── DiceRoller
│   ├── InitiativeTracker
│   ├── NotesPanel
│   ├── CharacterSheet
│   ├── ReferenceTable
│   └── Generator
└── Utilities
    ├── Modal
    ├── Tooltip
    ├── ContextMenu
    └── Notification
```

## Component Interfaces

### Base Component Interface

```typescript
interface Component<T = {}> {
  id: string;
  type: string;
  props: T;
  state: ComponentState;
  
  // Lifecycle
  init(): void;
  mount(container: HTMLElement): void;
  unmount(): void;
  destroy(): void;
  
  // State management
  setState(updates: Partial<ComponentState>): void;
  getState(): ComponentState;
  
  // Rendering
  render(): HTMLElement | DocumentFragment;
  update(props: Partial<T>): void;
  
  // Events
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
  emit(event: string, data?: any): void;
}

interface ComponentState {
  mounted: boolean;
  visible: boolean;
  loading: boolean;
  error: Error | null;
  [key: string]: any;
}
```

### Panel Component Interface

```typescript
interface PanelComponent extends Component<PanelProps> {
  // Panel-specific properties
  position: Position;
  size: Size;
  zIndex: number;
  
  // Panel actions
  move(position: Position): void;
  resize(size: Size): void;
  minimize(): void;
  maximize(): void;
  close(): void;
  
  // Content management
  loadContent(): Promise<void>;
  saveContent(): Promise<void>;
  refreshContent(): void;
  
  // Serialization
  serialize(): SerializedPanel;
  deserialize(data: SerializedPanel): void;
}

interface PanelProps {
  title: string;
  type: PanelType;
  icon?: string;
  closable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  collapsible?: boolean;
  settings?: PanelSettings;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}
```

## Component Implementation Pattern

### Base Component Class

```typescript
abstract class BaseComponent<T = {}> implements Component<T> {
  protected _id: string;
  protected _type: string;
  protected _props: T;
  protected _state: ComponentState;
  protected _element: HTMLElement | null = null;
  protected _eventBus: EventBus;
  
  constructor(props: T, eventBus: EventBus) {
    this._id = generateId();
    this._type = this.constructor.name;
    this._props = props;
    this._eventBus = eventBus;
    this._state = {
      mounted: false,
      visible: true,
      loading: false,
      error: null
    };
  }
  
  // Lifecycle methods
  init(): void {
    this.emit('component:init', { id: this._id });
  }
  
  mount(container: HTMLElement): void {
    if (this._state.mounted) return;
    
    this._element = this.render();
    container.appendChild(this._element);
    this._state.mounted = true;
    
    this.emit('component:mount', { id: this._id });
  }
  
  unmount(): void {
    if (!this._state.mounted || !this._element) return;
    
    this._element.remove();
    this._state.mounted = false;
    
    this.emit('component:unmount', { id: this._id });
  }
  
  destroy(): void {
    this.unmount();
    this._eventBus.removeAllListeners(this._id);
    this.emit('component:destroy', { id: this._id });
  }
  
  // State management
  setState(updates: Partial<ComponentState>): void {
    const prevState = { ...this._state };
    this._state = { ...this._state, ...updates };
    
    this.emit('component:stateChange', {
      id: this._id,
      prevState,
      nextState: this._state
    });
    
    if (this._state.mounted && this._element) {
      this.updateView();
    }
  }
  
  getState(): ComponentState {
    return { ...this._state };
  }
  
  // Abstract methods to be implemented by subclasses
  abstract render(): HTMLElement;
  abstract updateView(): void;
  
  // Event handling
  on(event: string, handler: EventHandler): void {
    this._eventBus.on(`${this._id}:${event}`, handler);
  }
  
  off(event: string, handler: EventHandler): void {
    this._eventBus.off(`${this._id}:${event}`, handler);
  }
  
  emit(event: string, data?: any): void {
    this._eventBus.emit(event, { ...data, componentId: this._id });
  }
}
```

### Panel Component Implementation

```typescript
class Panel extends BaseComponent<PanelProps> implements PanelComponent {
  position: Position;
  size: Size;
  zIndex: number;
  
  private _headerElement: HTMLElement | null = null;
  private _contentElement: HTMLElement | null = null;
  private _isMaximized: boolean = false;
  private _previousState: { position: Position; size: Size } | null = null;
  
  constructor(props: PanelProps, eventBus: EventBus, options?: PanelOptions) {
    super(props, eventBus);
    
    this.position = options?.position || { x: 50, y: 50 };
    this.size = options?.size || { width: 400, height: 300 };
    this.zIndex = options?.zIndex || 1;
  }
  
  render(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.dataset.panelId = this._id;
    panel.dataset.panelType = this._props.type;
    
    // Set initial position and size
    this.applyStyles(panel);
    
    // Create header
    this._headerElement = this.renderHeader();
    panel.appendChild(this._headerElement);
    
    // Create content area
    this._contentElement = this.renderContent();
    panel.appendChild(this._contentElement);
    
    // Set up event listeners
    this.setupEventListeners(panel);
    
    return panel;
  }
  
  private renderHeader(): HTMLElement {
    const header = document.createElement('div');
    header.className = 'panel-header';
    
    // Title
    const title = document.createElement('h3');
    title.className = 'panel-title';
    title.textContent = this._props.title;
    header.appendChild(title);
    
    // Controls
    const controls = document.createElement('div');
    controls.className = 'panel-controls';
    
    if (this._props.collapsible) {
      const minimizeBtn = this.createControlButton('minimize', '−');
      controls.appendChild(minimizeBtn);
    }
    
    const maximizeBtn = this.createControlButton('maximize', '□');
    controls.appendChild(maximizeBtn);
    
    if (this._props.closable) {
      const closeBtn = this.createControlButton('close', '×');
      controls.appendChild(closeBtn);
    }
    
    header.appendChild(controls);
    
    return header;
  }
  
  private renderContent(): HTMLElement {
    const content = document.createElement('div');
    content.className = 'panel-content';
    
    // Load panel-specific content
    this.loadContent().catch(error => {
      this.setState({ error, loading: false });
    });
    
    return content;
  }
  
  private createControlButton(action: string, icon: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = `panel-control panel-control-${action}`;
    button.setAttribute('aria-label', `${action} panel`);
    button.textContent = icon;
    
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
  
  // Panel actions
  move(position: Position): void {
    this.position = position;
    if (this._element) {
      this._element.style.left = `${position.x}px`;
      this._element.style.top = `${position.y}px`;
    }
    this.emit('panel:move', { position });
  }
  
  resize(size: Size): void {
    this.size = size;
    if (this._element) {
      this._element.style.width = `${size.width}px`;
      this._element.style.height = `${size.height}px`;
    }
    this.emit('panel:resize', { size });
  }
  
  minimize(): void {
    this.setState({ visible: false });
    if (this._element) {
      this._element.classList.add('minimized');
    }
    this.emit('panel:minimize');
  }
  
  maximize(): void {
    if (!this._isMaximized) {
      // Save current state
      this._previousState = {
        position: { ...this.position },
        size: { ...this.size }
      };
      
      // Maximize
      this.move({ x: 0, y: 0 });
      this.resize({
        width: window.innerWidth,
        height: window.innerHeight - 48 // Minus toolbar height
      });
      
      this._isMaximized = true;
      this._element?.classList.add('maximized');
    } else {
      // Restore previous state
      if (this._previousState) {
        this.move(this._previousState.position);
        this.resize(this._previousState.size);
      }
      
      this._isMaximized = false;
      this._element?.classList.remove('maximized');
    }
    
    this.emit('panel:maximize', { maximized: this._isMaximized });
  }
  
  close(): void {
    this.emit('panel:beforeClose');
    this.destroy();
    this.emit('panel:close');
  }
  
  // Content management
  async loadContent(): Promise<void> {
    this.setState({ loading: true });
    
    try {
      // Dynamic import based on panel type
      const module = await import(`./panels/${this._props.type}.js`);
      const PanelContent = module.default;
      
      const content = new PanelContent(this._props.settings);
      content.mount(this._contentElement!);
      
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ 
        loading: false, 
        error: error as Error 
      });
    }
  }
  
  // Serialization
  serialize(): SerializedPanel {
    return {
      id: this._id,
      type: this._props.type,
      title: this._props.title,
      position: this.position,
      size: this.size,
      zIndex: this.zIndex,
      settings: this._props.settings,
      state: this._state
    };
  }
  
  deserialize(data: SerializedPanel): void {
    this.position = data.position;
    this.size = data.size;
    this.zIndex = data.zIndex;
    
    if (data.state) {
      this.setState(data.state);
    }
    
    this.updateView();
  }
  
  updateView(): void {
    if (!this._element) return;
    
    // Update visibility
    this._element.style.display = this._state.visible ? 'block' : 'none';
    
    // Update loading state
    this._element.classList.toggle('loading', this._state.loading);
    
    // Update error state
    if (this._state.error && this._contentElement) {
      this._contentElement.innerHTML = `
        <div class="panel-error">
          <p>Error loading panel: ${this._state.error.message}</p>
          <button onclick="this.closest('.panel').component.refreshContent()">
            Retry
          </button>
        </div>
      `;
    }
  }
  
  private applyStyles(element: HTMLElement): void {
    Object.assign(element.style, {
      position: 'absolute',
      left: `${this.position.x}px`,
      top: `${this.position.y}px`,
      width: `${this.size.width}px`,
      height: `${this.size.height}px`,
      zIndex: this.zIndex.toString()
    });
  }
  
  private setupEventListeners(element: HTMLElement): void {
    // Store reference for event handlers
    (element as any).component = this;
    
    // Drag handling
    if (this._props.draggable && this._headerElement) {
      new DragHandler(this._headerElement, element, {
        onDragEnd: (position) => this.move(position)
      });
    }
    
    // Resize handling
    if (this._props.resizable) {
      new ResizeHandler(element, {
        minSize: { width: 200, height: 150 },
        onResizeEnd: (size) => this.resize(size)
      });
    }
    
    // Focus handling
    element.addEventListener('mousedown', () => {
      this.emit('panel:focus');
    });
  }
}
```

## State Management Architecture

### Store Interface

```typescript
interface Store<T = any> {
  getState(): T;
  setState(updates: Partial<T> | ((state: T) => Partial<T>)): void;
  subscribe(listener: StateListener<T>): UnsubscribeFn;
  dispatch(action: Action): void;
}

interface Action {
  type: string;
  payload?: any;
}

type StateListener<T> = (state: T, prevState: T) => void;
type UnsubscribeFn = () => void;
```

### Application State

```typescript
interface AppState {
  panels: PanelState[];
  layout: LayoutState;
  settings: SettingsState;
  ui: UIState;
}

interface PanelState {
  id: string;
  type: PanelType;
  position: Position;
  size: Size;
  zIndex: number;
  visible: boolean;
  data: any;
}

interface LayoutState {
  id: string;
  name: string;
  viewport: Viewport;
  breakpoint: Breakpoint;
}

interface SettingsState {
  theme: string;
  fontSize: number;
  fontFamily: string;
  animations: boolean;
  autoSave: boolean;
}

interface UIState {
  activePanel: string | null;
  modalOpen: boolean;
  sidebarVisible: boolean;
  notifications: Notification[];
}
```

## Event System

### Event Bus Implementation

```typescript
class EventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();
  
  on(event: string, handler: EventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }
  
  off(event: string, handler: EventHandler): void {
    this.listeners.get(event)?.delete(handler);
  }
  
  emit(event: string, data?: any): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }
  
  removeAllListeners(namespace?: string): void {
    if (namespace) {
      // Remove only namespaced events
      for (const [event, handlers] of this.listeners) {
        if (event.startsWith(namespace)) {
          handlers.clear();
          this.listeners.delete(event);
        }
      }
    } else {
      // Remove all
      this.listeners.clear();
    }
  }
}

type EventHandler = (data?: any) => void;
```

## Component Factory

```typescript
class ComponentFactory {
  private registry: Map<string, ComponentConstructor> = new Map();
  
  register(type: string, constructor: ComponentConstructor): void {
    this.registry.set(type, constructor);
  }
  
  create(type: string, props: any, eventBus: EventBus): Component {
    const Constructor = this.registry.get(type);
    if (!Constructor) {
      throw new Error(`Component type "${type}" not registered`);
    }
    
    return new Constructor(props, eventBus);
  }
  
  createPanel(type: PanelType, props: PanelProps, eventBus: EventBus): PanelComponent {
    return this.create(`panel-${type}`, props, eventBus) as PanelComponent;
  }
}

type ComponentConstructor = new (props: any, eventBus: EventBus) => Component;
```

## Testing Strategy

### Component Testing

```typescript
describe('Panel Component', () => {
  let panel: Panel;
  let eventBus: EventBus;
  let container: HTMLElement;
  
  beforeEach(() => {
    eventBus = new EventBus();
    container = document.createElement('div');
    panel = new Panel({
      title: 'Test Panel',
      type: 'dice-roller',
      closable: true,
      resizable: true,
      draggable: true
    }, eventBus);
  });
  
  afterEach(() => {
    panel.destroy();
  });
  
  test('should render with correct title', () => {
    panel.mount(container);
    const title = container.querySelector('.panel-title');
    expect(title?.textContent).toBe('Test Panel');
  });
  
  test('should emit events on state changes', () => {
    const spy = jest.fn();
    eventBus.on('component:stateChange', spy);
    
    panel.setState({ loading: true });
    
    expect(spy).toHaveBeenCalledWith({
      componentId: panel.id,
      prevState: expect.objectContaining({ loading: false }),
      nextState: expect.objectContaining({ loading: true })
    });
  });
  
  test('should handle resize correctly', () => {
    panel.mount(container);
    const newSize = { width: 500, height: 400 };
    
    panel.resize(newSize);
    
    expect(panel.size).toEqual(newSize);
    expect(panel.element?.style.width).toBe('500px');
    expect(panel.element?.style.height).toBe('400px');
  });
});
```

## Migration Path

### Step 1: Create Component Wrappers
Wrap existing panel implementations in component interface

### Step 2: Implement Event Bus
Replace direct DOM events with centralized event system

### Step 3: Add State Management
Introduce store for application state

### Step 4: Refactor Panel System
Migrate panels to new component architecture

### Step 5: Add TypeScript
Gradually add types to components

### Step 6: Implement Testing
Add unit tests for all components