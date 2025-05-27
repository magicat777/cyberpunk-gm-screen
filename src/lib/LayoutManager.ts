import { Layout, PanelConfig, Viewport } from '@/types';
import { appStore, actions, selectors } from '@/stores/appStore';
import { eventBus, Events } from '@/lib/EventBus';
import { generateId, saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage } from '@/utils';

export interface LayoutManagerOptions {
  autoSave?: boolean;
  autoSaveInterval?: number;
  maxLayouts?: number;
  storageKey?: string;
}

export class LayoutManager {
  private options: Required<LayoutManagerOptions>;
  private autoSaveTimer: ReturnType<typeof setInterval> | null = null;
  private layouts: Map<string, Layout> = new Map();

  constructor(options: LayoutManagerOptions = {}) {
    this.options = {
      autoSave: true,
      autoSaveInterval: 30000, // 30 seconds
      maxLayouts: 10,
      storageKey: 'cyberpunk-gm-screen-layouts',
      ...options,
    };

    this.init();
  }

  private init(): void {
    // Load saved layouts
    this.loadLayouts();

    // Subscribe to layout events
    eventBus.on(Events.LAYOUT_SAVE, ({ layout }) => {
      this.saveLayout(layout);
    });

    eventBus.on(Events.LAYOUT_LOAD, ({ layoutId }) => {
      this.loadLayout(layoutId);
    });

    eventBus.on(Events.LAYOUT_DELETE, ({ layoutId }) => {
      this.deleteLayout(layoutId);
    });

    // Start auto-save if enabled
    if (this.options.autoSave) {
      this.startAutoSave();
    }

    // Subscribe to panel changes for auto-save
    appStore.subscribe(() => {
      if (this.options.autoSave && appStore.getState().layout) {
        this.markLayoutDirty();
      }
    });
  }

  private loadLayouts(): void {
    const savedLayouts = loadFromLocalStorage<Layout[]>(this.options.storageKey, []);
    
    savedLayouts.forEach(layout => {
      // Ensure dates are properly parsed
      layout.createdAt = new Date(layout.createdAt);
      layout.updatedAt = new Date(layout.updatedAt);
      this.layouts.set(layout.id, layout);
    });
  }

  private persistLayouts(): void {
    const layoutsArray = Array.from(this.layouts.values());
    saveToLocalStorage(this.options.storageKey, layoutsArray);
  }

  private startAutoSave(): void {
    this.autoSaveTimer = setInterval(() => {
      const currentLayout = appStore.getState().layout;
      if (currentLayout && this.isLayoutDirty(currentLayout)) {
        this.saveCurrentLayout();
      }
    }, this.options.autoSaveInterval);
  }

  private stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  private isLayoutDirty(layout: Layout): boolean {
    const savedLayout = this.layouts.get(layout.id);
    if (!savedLayout) return true;

    // Compare panel states
    const currentPanels = appStore.getState().panels;
    return JSON.stringify(currentPanels) !== JSON.stringify(savedLayout.panels);
  }

  private markLayoutDirty(): void {
    // This could set a dirty flag if needed for more complex scenarios
  }

  public saveLayout(layout: Partial<Layout>): Layout {
    const currentPanels = selectors.getPanels(appStore.getState());
    const viewport = this.getCurrentViewport();

    const newLayout: Layout = {
      id: layout.id || generateId('layout'),
      name: layout.name || `Layout ${this.layouts.size + 1}`,
      description: layout.description,
      panels: currentPanels,
      viewport,
      createdAt: layout.createdAt || new Date(),
      updatedAt: new Date(),
    };

    // Check max layouts limit
    if (this.layouts.size >= this.options.maxLayouts && !this.layouts.has(newLayout.id)) {
      // Remove oldest layout
      const oldestLayout = Array.from(this.layouts.values())
        .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())[0];
      
      if (oldestLayout) {
        this.deleteLayout(oldestLayout.id);
      }
    }

    // Save layout
    this.layouts.set(newLayout.id, newLayout);
    this.persistLayouts();

    // Update store
    appStore.dispatchAction(actions.setLayout(newLayout));

    // Emit event
    eventBus.emit(Events.DATA_SAVE, {
      type: 'layout',
      id: newLayout.id,
      data: newLayout,
    });

    return newLayout;
  }

  public saveCurrentLayout(name?: string): Layout {
    const currentLayout = appStore.getState().layout;
    
    return this.saveLayout({
      ...currentLayout,
      name: name || currentLayout?.name,
    });
  }

  public loadLayout(layoutId: string): boolean {
    const layout = this.layouts.get(layoutId);
    if (!layout) return false;

    // Update store
    appStore.dispatchAction(actions.setLayout(layout));

    // Emit event
    eventBus.emit(Events.DATA_LOAD, {
      type: 'layout',
      id: layoutId,
      data: layout,
    });

    return true;
  }

  public deleteLayout(layoutId: string): boolean {
    const layout = this.layouts.get(layoutId);
    if (!layout) return false;

    // Remove from storage
    this.layouts.delete(layoutId);
    this.persistLayouts();

    // Clear from store if it's the current layout
    const currentLayout = appStore.getState().layout;
    if (currentLayout?.id === layoutId) {
      appStore.dispatchAction(actions.clearLayout());
    }

    // Emit event
    eventBus.emit('layout:deleted', { layoutId });

    return true;
  }

  public getLayouts(): Layout[] {
    return Array.from(this.layouts.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  public getLayout(layoutId: string): Layout | undefined {
    return this.layouts.get(layoutId);
  }

  public importLayout(layoutData: string): Layout | null {
    try {
      const layout = JSON.parse(layoutData) as Layout;
      
      // Validate layout structure
      if (!layout.id || !layout.name || !Array.isArray(layout.panels)) {
        throw new Error('Invalid layout format');
      }

      // Generate new ID to avoid conflicts
      layout.id = generateId('layout');
      layout.createdAt = new Date();
      layout.updatedAt = new Date();

      // Save the imported layout
      return this.saveLayout(layout);
    } catch (error) {
      console.error('Failed to import layout:', error);
      return null;
    }
  }

  public exportLayout(layoutId: string): string | null {
    const layout = this.layouts.get(layoutId);
    if (!layout) return null;

    // Create a clean copy for export
    const exportData = {
      ...layout,
      id: undefined, // Remove ID so it gets regenerated on import
    };

    return JSON.stringify(exportData, null, 2);
  }

  public exportCurrentLayout(): string | null {
    const currentLayout = appStore.getState().layout;
    if (!currentLayout) return null;

    return this.exportLayout(currentLayout.id);
  }

  private getCurrentViewport(): Viewport {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  public clearAllLayouts(): void {
    this.layouts.clear();
    removeFromLocalStorage(this.options.storageKey);
    appStore.dispatchAction(actions.clearLayout());
  }

  public duplicateLayout(layoutId: string, newName?: string): Layout | null {
    const layout = this.layouts.get(layoutId);
    if (!layout) return null;

    return this.saveLayout({
      ...layout,
      id: undefined, // Generate new ID
      name: newName || `${layout.name} (Copy)`,
      createdAt: undefined, // Will be set to now
    });
  }

  public renameLayout(layoutId: string, newName: string): boolean {
    const layout = this.layouts.get(layoutId);
    if (!layout) return false;

    layout.name = newName;
    layout.updatedAt = new Date();
    
    this.persistLayouts();

    // Update store if it's the current layout
    const currentLayout = appStore.getState().layout;
    if (currentLayout?.id === layoutId) {
      appStore.dispatchAction(actions.setLayout(layout));
    }

    return true;
  }

  public destroy(): void {
    this.stopAutoSave();
    eventBus.off(Events.LAYOUT_SAVE);
    eventBus.off(Events.LAYOUT_LOAD);
    eventBus.off(Events.LAYOUT_DELETE);
  }
}

// Create singleton instance
export const layoutManager = new LayoutManager();