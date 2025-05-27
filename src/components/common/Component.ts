import { EventBus } from '@/lib/EventBus';
import { Unsubscribe } from '@/types';

export interface ComponentOptions<T = {}> {
  props?: T;
  eventBus?: EventBus;
  parent?: Component;
}

export interface ComponentState {
  mounted: boolean;
  visible: boolean;
  loading: boolean;
  error: Error | null;
  [key: string]: any;
}

export abstract class Component<T = {}> {
  protected _id: string;
  protected _type: string;
  protected _props: T;
  protected _state: ComponentState;
  protected _element: HTMLElement | null = null;
  protected _eventBus: EventBus;
  protected _parent: Component | null = null;
  protected _children: Map<string, Component> = new Map();
  protected _subscriptions: Unsubscribe[] = [];

  constructor(options: ComponentOptions<T> = {}) {
    this._id = this.generateId();
    this._type = this.constructor.name;
    this._props = options.props || ({} as T);
    this._eventBus = options.eventBus || new EventBus();
    this._parent = options.parent || null;
    
    this._state = {
      mounted: false,
      visible: true,
      loading: false,
      error: null,
    };

    this.init();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get type(): string {
    return this._type;
  }

  get element(): HTMLElement | null {
    return this._element;
  }

  get props(): T {
    return { ...this._props };
  }

  get state(): ComponentState {
    return { ...this._state };
  }

  get isMounted(): boolean {
    return this._state.mounted;
  }

  // Lifecycle methods
  protected init(): void {
    this.emit('component:init', { id: this._id, type: this._type });
  }

  mount(container: HTMLElement): void {
    if (this._state.mounted) {
      console.warn(`Component ${this._id} is already mounted`);
      return;
    }

    this._element = this.render();
    if (!this._element) {
      throw new Error(`Component ${this._id} render() must return an HTMLElement`);
    }

    // Store component reference on element
    (this._element as any).__component = this;
    
    container.appendChild(this._element);
    this._state.mounted = true;

    this.setupEventListeners();
    this.afterMount();
    
    this.emit('component:mount', { id: this._id });
  }

  unmount(): void {
    if (!this._state.mounted || !this._element) return;

    this.beforeUnmount();

    // Unmount children first
    this._children.forEach(child => child.unmount());

    // Remove element
    this._element.remove();
    this._state.mounted = false;

    // Clean up event listeners
    this.removeEventListeners();

    this.emit('component:unmount', { id: this._id });
  }

  destroy(): void {
    this.unmount();

    // Destroy children
    this._children.forEach(child => child.destroy());
    this._children.clear();

    // Clean up subscriptions
    this._subscriptions.forEach(unsubscribe => unsubscribe());
    this._subscriptions = [];

    // Remove from parent
    if (this._parent) {
      this._parent.removeChild(this._id);
    }

    this.emit('component:destroy', { id: this._id });
  }

  // State management
  setState(updates: Partial<ComponentState>): void {
    const prevState = { ...this._state };
    this._state = { ...this._state, ...updates };

    this.emit('component:stateChange', {
      id: this._id,
      prevState,
      nextState: this._state,
    });

    if (this._state.mounted && this._element) {
      this.update();
    }
  }

  // Props management
  setProps(updates: Partial<T>): void {
    const prevProps = { ...this._props };
    this._props = { ...this._props, ...updates };

    this.emit('component:propsChange', {
      id: this._id,
      prevProps,
      nextProps: this._props,
    });

    if (this._state.mounted && this._element) {
      this.update();
    }
  }

  // Child management
  addChild(child: Component): void {
    this._children.set(child.id, child);
    (child as any)._parent = this;
  }

  removeChild(childId: string): void {
    this._children.delete(childId);
  }

  getChild(childId: string): Component | undefined {
    return this._children.get(childId);
  }

  getChildren(): Component[] {
    return Array.from(this._children.values());
  }

  // Event handling
  on(event: string, handler: (data?: any) => void): void {
    const unsubscribe = this._eventBus.on(`${this._id}:${event}`, handler);
    this._subscriptions.push(unsubscribe);
  }

  once(event: string, handler: (data?: any) => void): void {
    const unsubscribe = this._eventBus.once(`${this._id}:${event}`, handler);
    this._subscriptions.push(unsubscribe);
  }

  emit(event: string, data?: any): void {
    this._eventBus.emit(`${this._id}:${event}`, { ...data, componentId: this._id });
    
    // Also emit global event
    this._eventBus.emit(event, { ...data, componentId: this._id });
  }

  // DOM helpers
  protected query<E extends HTMLElement = HTMLElement>(selector: string): E | null {
    return this._element?.querySelector<E>(selector) || null;
  }

  protected queryAll<E extends HTMLElement = HTMLElement>(selector: string): NodeListOf<E> {
    return this._element?.querySelectorAll<E>(selector) || ([] as any);
  }

  protected createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options?: {
      className?: string;
      attributes?: Record<string, string>;
      children?: (Node | string)[];
      text?: string;
      html?: string;
    }
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);

    if (options?.className) {
      element.className = options.className;
    }

    if (options?.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    if (options?.text) {
      element.textContent = options.text;
    } else if (options?.html) {
      element.innerHTML = options.html;
    }

    if (options?.children) {
      options.children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });
    }

    return element;
  }

  // Utility methods
  protected generateId(): string {
    return `${this.constructor.name.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected debounce<F extends (...args: any[]) => any>(
    func: F,
    wait: number
  ): (...args: Parameters<F>) => void {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: Parameters<F>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  protected throttle<F extends (...args: any[]) => any>(
    func: F,
    limit: number
  ): (...args: Parameters<F>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<F>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Abstract methods
  abstract render(): HTMLElement;
  abstract update(): void;

  // Optional lifecycle hooks
  protected afterMount(): void {}
  protected beforeUnmount(): void {}
  protected setupEventListeners(): void {}
  protected removeEventListeners(): void {}
}

// Component registry
export class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, typeof Component> = new Map();

  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  register(name: string, componentClass: typeof Component): void {
    this.components.set(name, componentClass);
  }

  create<T extends Component>(
    name: string,
    options?: ComponentOptions<any>
  ): T {
    const ComponentClass = this.components.get(name);
    if (!ComponentClass) {
      throw new Error(`Component "${name}" not found in registry`);
    }
    return new (ComponentClass as any)(options) as T;
  }

  has(name: string): boolean {
    return this.components.has(name);
  }
}

export const componentRegistry = ComponentRegistry.getInstance();