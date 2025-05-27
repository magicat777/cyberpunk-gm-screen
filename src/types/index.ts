// Core types for the Cyberpunk GM Screen application

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  position: Position;
  size: Size;
}

export enum PanelType {
  DICE_ROLLER = 'dice-roller',
  INITIATIVE_TRACKER = 'initiative-tracker',
  NOTES = 'notes',
  CHARACTER_SHEET = 'character-sheet',
  REFERENCE_TABLE = 'reference-table',
  NPC_GENERATOR = 'npc-generator',
  LOOT_GENERATOR = 'loot-generator',
  ENCOUNTER_GENERATOR = 'encounter-generator',
  MAP_VIEWER = 'map-viewer',
  TIMER = 'timer',
}

export interface PanelConfig {
  id: string;
  type: PanelType;
  title: string;
  position: Position;
  size: Size;
  minSize?: Size;
  maxSize?: Size;
  zIndex: number;
  visible: boolean;
  locked?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  closable?: boolean;
  collapsible?: boolean;
  settings?: Record<string, any>;
}

export interface Theme {
  id: string;
  name: string;
  className: string;
  colors: ThemeColors;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface AppSettings {
  theme: string;
  fontSize: number;
  fontFamily: string;
  animations: boolean;
  autoSave: boolean;
  saveInterval: number;
  soundEnabled: boolean;
  language: string;
}

export interface Layout {
  id: string;
  name: string;
  description?: string;
  panels: PanelConfig[];
  viewport: Viewport;
  createdAt: Date;
  updatedAt: Date;
}

export interface Viewport {
  width: number;
  height: number;
}

export enum Breakpoint {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
  WIDE = 'wide',
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
  timestamp: Date;
}

export interface DragState {
  isDragging: boolean;
  startPosition: Position;
  currentPosition: Position;
  offset: Position;
  elementId: string;
}

export interface ResizeState {
  isResizing: boolean;
  startSize: Size;
  currentSize: Size;
  direction: ResizeDirection;
  elementId: string;
}

export enum ResizeDirection {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
}

export interface TouchGesture {
  type: 'swipe' | 'pinch' | 'tap' | 'longpress';
  startTouches: Touch[];
  currentTouches: Touch[];
  timestamp: number;
}

// Panel-specific types
export interface DiceRoll {
  id: string;
  formula: string;
  results: number[];
  total: number;
  timestamp: Date;
  critical?: boolean;
  fumble?: boolean;
}

export interface Character {
  id: string;
  name: string;
  initiative: number;
  type: 'pc' | 'npc';
  conditions: string[];
  notes: string;
}

export interface CharacterStats {
  int: number;
  ref: number;
  dex: number;
  tech: number;
  cool: number;
  will: number;
  luck: number;
  move: number;
  body: number;
  emp: number;
}

export interface Cyberware {
  name: string;
  type: string;
  description: string;
  humanityLoss: number;
}

export interface InitiativeState {
  characters: Character[];
  currentTurn: number;
  round: number;
  isRunning: boolean;
}

// State management types
export interface AppState {
  panels: Record<string, PanelState>;
  settings: AppSettings;
  layout: Layout | null;
  ui: UIState;
  notifications: Notification[];
}

export interface PanelState {
  config: PanelConfig;
  data?: any;
}

export interface UIState {
  activePanel: string | null;
  sidebarOpen: boolean;
  modalOpen: boolean;
  contextMenu: ContextMenuState | null;
  dragState: DragState | null;
  resizeState: ResizeState | null;
  breakpoint: Breakpoint;
}

export interface ContextMenuState {
  x: number;
  y: number;
  targetId: string;
  items: ContextMenuItem[];
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

// Event types
export interface PanelEvent {
  panelId: string;
  type: 'create' | 'update' | 'remove' | 'focus' | 'blur';
  data?: any;
}

export interface LayoutEvent {
  layoutId: string;
  type: 'save' | 'load' | 'delete' | 'export' | 'import';
  data?: any;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Callback<T = void> = (data?: T) => void;
export type AsyncCallback<T = void> = (data?: T) => Promise<void>;
export type Unsubscribe = () => void;