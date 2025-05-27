import { Store, loggerMiddleware, thunkMiddleware, eventMiddleware } from '@/lib/Store';
import {
  AppState,
  PanelConfig,
  AppSettings,
  Layout,
  UIState,
  Notification,
  Breakpoint,
  PanelType,
} from '@/types';

// Action types
export const ActionTypes = {
  // Panel actions
  ADD_PANEL: 'ADD_PANEL',
  UPDATE_PANEL: 'UPDATE_PANEL',
  REMOVE_PANEL: 'REMOVE_PANEL',
  SET_ACTIVE_PANEL: 'SET_ACTIVE_PANEL',
  REORDER_PANELS: 'REORDER_PANELS',

  // Settings actions
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RESET_SETTINGS: 'RESET_SETTINGS',

  // Layout actions
  SET_LAYOUT: 'SET_LAYOUT',
  SAVE_LAYOUT: 'SAVE_LAYOUT',
  CLEAR_LAYOUT: 'CLEAR_LAYOUT',

  // UI actions
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_MODAL_OPEN: 'SET_MODAL_OPEN',
  SET_CONTEXT_MENU: 'SET_CONTEXT_MENU',
  SET_DRAG_STATE: 'SET_DRAG_STATE',
  SET_RESIZE_STATE: 'SET_RESIZE_STATE',
  SET_BREAKPOINT: 'SET_BREAKPOINT',

  // Notification actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
} as const;

// Initial state
const initialState: AppState = {
  panels: [],
  settings: {
    theme: 'neon-synthwave',
    fontSize: 16,
    fontFamily: 'Inter',
    animations: true,
    autoSave: true,
    saveInterval: 30000, // 30 seconds
    soundEnabled: true,
    language: 'en',
  },
  layout: null,
  ui: {
    activePanel: null,
    sidebarOpen: false,
    modalOpen: false,
    contextMenu: null,
    dragState: null,
    resizeState: null,
    breakpoint: Breakpoint.DESKTOP,
  },
  notifications: [],
};

// Reducer
const appReducer = (state: AppState, action: any): AppState => {
  switch (action.type) {
    // Panel actions
    case ActionTypes.ADD_PANEL:
      return {
        ...state,
        panels: [...state.panels, action.payload],
        ui: {
          ...state.ui,
          activePanel: action.payload.id,
        },
      };

    case ActionTypes.UPDATE_PANEL:
      return {
        ...state,
        panels: state.panels.map(panel =>
          panel.id === action.payload.id ? { ...panel, ...action.payload.updates } : panel
        ),
      };

    case ActionTypes.REMOVE_PANEL:
      return {
        ...state,
        panels: state.panels.filter(panel => panel.id !== action.payload),
        ui: {
          ...state.ui,
          activePanel: state.ui.activePanel === action.payload ? null : state.ui.activePanel,
        },
      };

    case ActionTypes.SET_ACTIVE_PANEL:
      return {
        ...state,
        ui: {
          ...state.ui,
          activePanel: action.payload,
        },
      };

    case ActionTypes.REORDER_PANELS:
      return {
        ...state,
        panels: action.payload,
      };

    // Settings actions
    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case ActionTypes.RESET_SETTINGS:
      return {
        ...state,
        settings: initialState.settings,
      };

    // Layout actions
    case ActionTypes.SET_LAYOUT:
      return {
        ...state,
        layout: action.payload,
        panels: action.payload?.panels || [],
      };

    case ActionTypes.SAVE_LAYOUT:
      return {
        ...state,
        layout: {
          ...action.payload,
          panels: state.panels,
          updatedAt: new Date(),
        },
      };

    case ActionTypes.CLEAR_LAYOUT:
      return {
        ...state,
        layout: null,
        panels: [],
      };

    // UI actions
    case ActionTypes.SET_SIDEBAR_OPEN:
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: action.payload,
        },
      };

    case ActionTypes.SET_MODAL_OPEN:
      return {
        ...state,
        ui: {
          ...state.ui,
          modalOpen: action.payload,
        },
      };

    case ActionTypes.SET_CONTEXT_MENU:
      return {
        ...state,
        ui: {
          ...state.ui,
          contextMenu: action.payload,
        },
      };

    case ActionTypes.SET_DRAG_STATE:
      return {
        ...state,
        ui: {
          ...state.ui,
          dragState: action.payload,
        },
      };

    case ActionTypes.SET_RESIZE_STATE:
      return {
        ...state,
        ui: {
          ...state.ui,
          resizeState: action.payload,
        },
      };

    case ActionTypes.SET_BREAKPOINT:
      return {
        ...state,
        ui: {
          ...state.ui,
          breakpoint: action.payload,
        },
      };

    // Notification actions
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
};

// Create store instance
export const appStore = new Store<AppState>({
  initialState,
  reducer: appReducer,
  middleware: [
    thunkMiddleware,
    process.env.NODE_ENV === 'development' ? loggerMiddleware : null,
    eventMiddleware,
  ].filter(Boolean) as any[],
  persist: {
    key: 'cyberpunk-gm-screen',
    whitelist: ['settings', 'layout'],
  },
});

// Action creators
export const actions = {
  // Panel actions
  addPanel: (panel: PanelConfig) => ({
    type: ActionTypes.ADD_PANEL,
    payload: panel,
  }),

  updatePanel: (id: string, updates: Partial<PanelConfig>) => ({
    type: ActionTypes.UPDATE_PANEL,
    payload: { id, updates },
  }),

  removePanel: (id: string) => ({
    type: ActionTypes.REMOVE_PANEL,
    payload: id,
  }),

  setActivePanel: (id: string | null) => ({
    type: ActionTypes.SET_ACTIVE_PANEL,
    payload: id,
  }),

  reorderPanels: (panels: PanelConfig[]) => ({
    type: ActionTypes.REORDER_PANELS,
    payload: panels,
  }),

  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => ({
    type: ActionTypes.UPDATE_SETTINGS,
    payload: settings,
  }),

  resetSettings: () => ({
    type: ActionTypes.RESET_SETTINGS,
  }),

  // Layout actions
  setLayout: (layout: Layout | null) => ({
    type: ActionTypes.SET_LAYOUT,
    payload: layout,
  }),

  saveLayout: (layout: Partial<Layout>) => ({
    type: ActionTypes.SAVE_LAYOUT,
    payload: layout,
  }),

  clearLayout: () => ({
    type: ActionTypes.CLEAR_LAYOUT,
  }),

  // UI actions
  setSidebarOpen: (open: boolean) => ({
    type: ActionTypes.SET_SIDEBAR_OPEN,
    payload: open,
  }),

  setModalOpen: (open: boolean) => ({
    type: ActionTypes.SET_MODAL_OPEN,
    payload: open,
  }),

  setContextMenu: (menu: UIState['contextMenu']) => ({
    type: ActionTypes.SET_CONTEXT_MENU,
    payload: menu,
  }),

  setDragState: (state: UIState['dragState']) => ({
    type: ActionTypes.SET_DRAG_STATE,
    payload: state,
  }),

  setResizeState: (state: UIState['resizeState']) => ({
    type: ActionTypes.SET_RESIZE_STATE,
    payload: state,
  }),

  setBreakpoint: (breakpoint: Breakpoint) => ({
    type: ActionTypes.SET_BREAKPOINT,
    payload: breakpoint,
  }),

  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => ({
    type: ActionTypes.ADD_NOTIFICATION,
    payload: {
      ...notification,
      id: `notification-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    },
  }),

  removeNotification: (id: string) => ({
    type: ActionTypes.REMOVE_NOTIFICATION,
    payload: id,
  }),

  clearNotifications: () => ({
    type: ActionTypes.CLEAR_NOTIFICATIONS,
  }),
};

// Selectors
export const selectors = {
  // Panel selectors
  getPanels: (state: AppState) => state.panels,
  getPanelById: (state: AppState, id: string) => state.panels.find(p => p.id === id),
  getActivePanel: (state: AppState) => state.panels.find(p => p.id === state.ui.activePanel),
  getPanelsByType: (state: AppState, type: PanelType) => state.panels.filter(p => p.type === type),
  getVisiblePanels: (state: AppState) => state.panels.filter(p => p.visible),

  // Settings selectors
  getSettings: (state: AppState) => state.settings,
  getTheme: (state: AppState) => state.settings.theme,
  getFontSize: (state: AppState) => state.settings.fontSize,

  // Layout selectors
  getLayout: (state: AppState) => state.layout,

  // UI selectors
  getUIState: (state: AppState) => state.ui,
  isSidebarOpen: (state: AppState) => state.ui.sidebarOpen,
  isModalOpen: (state: AppState) => state.ui.modalOpen,
  getBreakpoint: (state: AppState) => state.ui.breakpoint,
  isDragging: (state: AppState) => state.ui.dragState?.isDragging || false,
  isResizing: (state: AppState) => state.ui.resizeState?.isResizing || false,

  // Notification selectors
  getNotifications: (state: AppState) => state.notifications,
};

// Thunk actions for async operations
export const thunks = {
  createPanel: (type: PanelType, title?: string) => (dispatch: any, getState: any) => {
    const state = getState();
    const panelCount = state.panels.length;
    
    const newPanel: PanelConfig = {
      id: `panel-${type}-${Date.now()}`,
      type,
      title: title || `${type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      position: {
        x: 50 + (panelCount * 20),
        y: 50 + (panelCount * 20),
      },
      size: {
        width: 400,
        height: 300,
      },
      zIndex: panelCount + 1,
      visible: true,
      resizable: true,
      draggable: true,
      closable: true,
      collapsible: true,
    };

    dispatch(actions.addPanel(newPanel));
    return newPanel;
  },

  showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => (dispatch: any) => {
    const action = actions.addNotification(notification);
    dispatch(action);

    // Auto-remove after duration
    if (notification.duration) {
      setTimeout(() => {
        dispatch(actions.removeNotification(action.payload.id));
      }, notification.duration);
    }
  },
};