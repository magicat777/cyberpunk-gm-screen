import { Callback, Unsubscribe } from '@/types';

export interface EventHandler {
  callback: Callback<any>;
  once: boolean;
}

export class EventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private wildcardListeners: Set<EventHandler> = new Set();

  /**
   * Subscribe to an event
   */
  on<T = any>(event: string, callback: Callback<T>): Unsubscribe {
    if (event === '*') {
      const handler = { callback, once: false };
      this.wildcardListeners.add(handler);
      return () => this.wildcardListeners.delete(handler);
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const handler = { callback, once: false };
    this.listeners.get(event)!.add(handler);

    return () => {
      const handlers = this.listeners.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Subscribe to an event once
   */
  once<T = any>(event: string, callback: Callback<T>): Unsubscribe {
    if (event === '*') {
      const handler = { callback, once: true };
      this.wildcardListeners.add(handler);
      return () => this.wildcardListeners.delete(handler);
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const handler = { callback, once: true };
    this.listeners.get(event)!.add(handler);

    return () => {
      const handlers = this.listeners.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Emit an event
   */
  emit<T = any>(event: string, data?: T): void {
    // Emit to specific event listeners
    const handlers = this.listeners.get(event);
    if (handlers) {
      const handlersToRemove: EventHandler[] = [];
      
      handlers.forEach(handler => {
        try {
          handler.callback(data);
          if (handler.once) {
            handlersToRemove.push(handler);
          }
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });

      // Remove one-time handlers
      handlersToRemove.forEach(handler => handlers.delete(handler));
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }

    // Emit to wildcard listeners
    const wildcardToRemove: EventHandler[] = [];
    this.wildcardListeners.forEach(handler => {
      try {
        handler.callback({ event, data });
        if (handler.once) {
          wildcardToRemove.push(handler);
        }
      } catch (error) {
        console.error(`Error in wildcard event handler:`, error);
      }
    });

    // Remove one-time wildcard handlers
    wildcardToRemove.forEach(handler => this.wildcardListeners.delete(handler));
  }

  /**
   * Remove all listeners for an event
   */
  off(event?: string): void {
    if (event) {
      if (event === '*') {
        this.wildcardListeners.clear();
      } else {
        this.listeners.delete(event);
      }
    } else {
      // Remove all listeners
      this.listeners.clear();
      this.wildcardListeners.clear();
    }
  }

  /**
   * Remove all listeners with a specific namespace
   */
  offNamespace(namespace: string): void {
    const eventsToRemove: string[] = [];
    
    this.listeners.forEach((handlers, event) => {
      if (event.startsWith(`${namespace}:`)) {
        eventsToRemove.push(event);
      }
    });

    eventsToRemove.forEach(event => this.listeners.delete(event));
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount(event?: string): number {
    if (!event) {
      let count = this.wildcardListeners.size;
      this.listeners.forEach(handlers => count += handlers.size);
      return count;
    }

    if (event === '*') {
      return this.wildcardListeners.size;
    }

    return this.listeners.get(event)?.size || 0;
  }

  /**
   * Check if there are any listeners for an event
   */
  hasListeners(event?: string): boolean {
    if (!event) {
      return this.listeners.size > 0 || this.wildcardListeners.size > 0;
    }

    if (event === '*') {
      return this.wildcardListeners.size > 0;
    }

    return this.listeners.has(event);
  }
}

// Create a singleton instance
export const eventBus = new EventBus();

// Event name constants
export const Events = {
  // Panel events
  PANEL_CREATE: 'panel:create',
  PANEL_UPDATE: 'panel:update',
  PANEL_REMOVE: 'panel:remove',
  PANEL_FOCUS: 'panel:focus',
  PANEL_BLUR: 'panel:blur',
  PANEL_MOVE: 'panel:move',
  PANEL_RESIZE: 'panel:resize',
  PANEL_MINIMIZE: 'panel:minimize',
  PANEL_MAXIMIZE: 'panel:maximize',
  PANEL_RESTORE: 'panel:restore',

  // Layout events
  LAYOUT_SAVE: 'layout:save',
  LAYOUT_LOAD: 'layout:load',
  LAYOUT_DELETE: 'layout:delete',
  LAYOUT_EXPORT: 'layout:export',
  LAYOUT_IMPORT: 'layout:import',

  // Theme events
  THEME_CHANGE: 'theme:change',

  // Settings events
  SETTINGS_UPDATE: 'settings:update',

  // UI events
  UI_SIDEBAR_TOGGLE: 'ui:sidebar:toggle',
  UI_MODAL_OPEN: 'ui:modal:open',
  UI_MODAL_CLOSE: 'ui:modal:close',
  UI_CONTEXT_MENU_OPEN: 'ui:contextmenu:open',
  UI_CONTEXT_MENU_CLOSE: 'ui:contextmenu:close',
  UI_NOTIFICATION_ADD: 'ui:notification:add',
  UI_NOTIFICATION_REMOVE: 'ui:notification:remove',

  // Drag and drop events
  DRAG_START: 'drag:start',
  DRAG_MOVE: 'drag:move',
  DRAG_END: 'drag:end',

  // Resize events
  RESIZE_START: 'resize:start',
  RESIZE_MOVE: 'resize:move',
  RESIZE_END: 'resize:end',

  // Viewport events
  VIEWPORT_RESIZE: 'viewport:resize',
  BREAKPOINT_CHANGE: 'breakpoint:change',

  // Data events
  DATA_SAVE: 'data:save',
  DATA_LOAD: 'data:load',
  DATA_SYNC: 'data:sync',
} as const;