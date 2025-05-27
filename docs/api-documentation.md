# API Documentation - Cyberpunk GM Screen

## Overview
The Cyberpunk GM Screen provides a comprehensive API for managing panels, state, and user interactions. This document covers all public APIs, events, and integration points.

## Table of Contents
1. [Core Libraries](#core-libraries)
2. [Components](#components)
3. [State Management](#state-management)
4. [Event System](#event-system)
5. [Monitoring](#monitoring)
6. [Panel Types](#panel-types)

---

## Core Libraries

### EventBus

Event-driven communication system for decoupled components.

```typescript
import { EventBus } from '@/lib/EventBus';

const eventBus = new EventBus();
```

#### Methods

##### `on(event: string, callback: Function): Function`
Subscribe to an event. Returns unsubscribe function.

```typescript
const unsubscribe = eventBus.on('panel:opened', (event, data) => {
  console.log('Panel opened:', data.panelId);
});
```

##### `once(event: string, callback: Function): Function`
Subscribe to an event once. Auto-unsubscribes after first trigger.

```typescript
eventBus.once('app:ready', () => {
  console.log('Application initialized');
});
```

##### `emit(event: string, data?: any): void`
Emit an event with optional data.

```typescript
eventBus.emit('dice:rolled', {
  formula: '1d20',
  result: 15,
  critical: false
});
```

##### `off(event: string, callback: Function): void`
Unsubscribe from an event.

```typescript
eventBus.off('panel:opened', callback);
```

#### Wildcard Events

```typescript
// Listen to all events
eventBus.on('*', (event, data) => {
  console.log(`Event: ${event}`, data);
});

// Listen to namespace
eventBus.on('panel:*', (event, data) => {
  console.log(`Panel event: ${event}`, data);
});
```

### Store

Redux-like state management with TypeScript support.

```typescript
import { Store } from '@/lib/Store';

const store = new Store(initialState);
```

#### Methods

##### `getState(): T`
Get current state (immutable).

```typescript
const state = store.getState();
console.log(state.panels);
```

##### `dispatch(action: Action): void`
Dispatch an action to update state.

```typescript
store.dispatch({
  type: 'ADD_PANEL',
  payload: { 
    id: 'dice-1',
    type: 'dice-roller'
  }
});
```

##### `subscribe(listener: Function): Function`
Subscribe to state changes. Returns unsubscribe function.

```typescript
const unsubscribe = store.subscribe((state) => {
  console.log('State updated:', state);
});
```

### DragHandler

Touch-friendly drag implementation.

```typescript
import { DragHandler } from '@/lib/DragHandler';

const dragHandler = new DragHandler({
  element: panelElement,
  handle: headerElement,
  boundary: 'viewport',
  onDragStart: (pos) => console.log('Drag started', pos),
  onDragMove: (pos) => console.log('Dragging', pos),
  onDragEnd: (pos) => console.log('Drag ended', pos)
});
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| element | HTMLElement | Element to drag |
| handle | HTMLElement | Drag handle |
| boundary | 'viewport' \| HTMLElement | Constraint boundary |
| onDragStart | Function | Start callback |
| onDragMove | Function | Move callback |
| onDragEnd | Function | End callback |

### ResizeHandler

Multi-directional resize with constraints.

```typescript
import { ResizeHandler } from '@/lib/ResizeHandler';

const resizeHandler = new ResizeHandler({
  element: panelElement,
  handles: ['right', 'bottom', 'bottom-right'],
  minSize: { width: 200, height: 150 },
  maxSize: { width: 800, height: 600 },
  onResize: (size) => console.log('Resized to', size)
});
```

---

## Components

### Panel

Base panel component with drag/resize capabilities.

```typescript
import { Panel } from '@/components/panels/Panel';

const panel = new Panel({
  id: 'panel-1',
  title: 'Dice Roller',
  position: { x: 100, y: 100 },
  size: { width: 400, height: 300 },
  content: diceRollerComponent,
  draggable: true,
  resizable: true,
  closable: true
});

panel.mount(container);
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| id | string | required | Unique panel ID |
| title | string | required | Panel title |
| position | Position | {x:0,y:0} | Initial position |
| size | Size | {width:400,height:300} | Initial size |
| content | Component | required | Panel content |
| draggable | boolean | true | Enable dragging |
| resizable | boolean | true | Enable resizing |
| closable | boolean | true | Show close button |
| zIndex | number | auto | Stack order |

#### Methods

##### `focus(): void`
Bring panel to front.

##### `close(): void`
Close panel with animation.

##### `minimize(): void`
Minimize panel to taskbar.

##### `maximize(): void`
Maximize panel to viewport.

##### `updatePosition(pos: Position): void`
Update panel position.

##### `updateSize(size: Size): void`
Update panel size.

### PanelManager

Orchestrates panel lifecycle and z-index management.

```typescript
import { PanelManager } from '@/managers/PanelManager';

const panelManager = new PanelManager(eventBus, store);

// Create panel
const panelId = await panelManager.createPanel({
  type: 'dice-roller',
  position: { x: 100, y: 100 }
});

// Focus panel
panelManager.focusPanel(panelId);

// Close panel
panelManager.closePanel(panelId);
```

---

## State Management

### Actions

#### Panel Actions

```typescript
// Add panel
{
  type: 'ADD_PANEL',
  payload: {
    id: string,
    type: PanelType,
    position: Position,
    size: Size
  }
}

// Update panel
{
  type: 'UPDATE_PANEL',
  payload: {
    id: string,
    updates: Partial<PanelConfig>
  }
}

// Remove panel
{
  type: 'REMOVE_PANEL',
  payload: { id: string }
}

// Update panel data
{
  type: 'UPDATE_PANEL_DATA',
  payload: {
    panelId: string,
    data: any
  }
}
```

#### Theme Actions

```typescript
// Change theme
{
  type: 'SET_THEME',
  payload: { theme: 'synthwave' | 'tech-noir' | 'minimal' }
}
```

#### Layout Actions

```typescript
// Save layout
{
  type: 'SAVE_LAYOUT',
  payload: {
    name: string,
    panels: PanelConfig[]
  }
}

// Load layout
{
  type: 'LOAD_LAYOUT',
  payload: { name: string }
}
```

---

## Event System

### Panel Events

| Event | Data | Description |
|-------|------|-------------|
| panel:created | {panelId, panelType} | Panel created |
| panel:opened | {panelId, panelType} | Panel opened |
| panel:closed | {panelId} | Panel closed |
| panel:focused | {panelId} | Panel brought to front |
| panel:blurred | {panelId} | Panel lost focus |
| panel:moved | {panelId, position} | Panel position changed |
| panel:resized | {panelId, size} | Panel size changed |
| panel:minimized | {panelId} | Panel minimized |
| panel:maximized | {panelId} | Panel maximized |
| panel:interaction | {panelId, interactionType} | User interaction |

### Dice Events

| Event | Data | Description |
|-------|------|-------------|
| dice:rolled | {formula, result, rolls, critical, fumble} | Dice rolled |
| dice:cleared | {panelId} | History cleared |

### Theme Events

| Event | Data | Description |
|-------|------|-------------|
| theme:changed | {theme} | Theme changed |

### Layout Events

| Event | Data | Description |
|-------|------|-------------|
| layout:saved | {layoutName, panels} | Layout saved |
| layout:loaded | {layoutName} | Layout loaded |
| layout:deleted | {layoutName} | Layout deleted |

### Error Events

| Event | Data | Description |
|-------|------|-------------|
| error:occurred | {message, stack, type} | Error occurred |

---

## Monitoring

### RUM (Real User Monitoring)

```typescript
import { getRUM } from '@/monitoring';

// Record custom metric
getRUM()?.recordMetric('custom.metric', 42, {
  category: 'gameplay',
  action: 'achievement'
});

// Track user action
getRUM()?.trackAction({
  type: 'button_click',
  target: 'save-layout',
  timestamp: Date.now()
});

// Report error
getRUM()?.trackError({
  message: 'Failed to save',
  type: 'save_error',
  timestamp: Date.now(),
  url: window.location.href,
  userAgent: navigator.userAgent
});
```

### Logger

```typescript
import { log, PanelLogger } from '@/monitoring';

// Basic logging
log.info('Application started');
log.warn('Low memory', { available: memoryMB });
log.error('Save failed', error, { userId: user.id });

// Component logger
const logger = new PanelLogger('dice-roller', config);
logger.logInteraction('roll', { formula: '1d20' });
logger.logStateChange(oldState, newState);
```

### Debug Mode

```typescript
// Enable via URL: ?debug=true
// Or via console:
debug.enable();

// Available commands
debug.getState();        // Current state
debug.getMetrics();      // Metrics summary
debug.getEvents();       // Event log
debug.dispatch(action);  // Dispatch action
debug.emit(event, data); // Emit event
```

---

## Panel Types

### DiceRoller

Cyberpunk-specific dice rolling panel.

```typescript
import { DiceRoller } from '@/components/panels/dice-roller';

const diceRoller = new DiceRoller({
  eventBus,
  store,
  panelId: 'dice-1'
});
```

#### Features
- Formula parsing (1d10!, 2d6+3)
- Critical/fumble detection
- Roll history
- Keyboard shortcuts

#### Events
- `dice:rolled` - Roll performed
- `dice:cleared` - History cleared

### Notes

Markdown-enabled notes panel.

```typescript
import { Notes } from '@/components/panels/notes';

const notes = new Notes({
  eventBus,
  store,
  panelId: 'notes-1'
});
```

#### Features
- Auto-save with debouncing
- Markdown formatting toolbar
- Character counting
- Local storage persistence

### InitiativeTracker

Combat initiative management.

```typescript
import { InitiativeTracker } from '@/components/panels/initiative-tracker';

const tracker = new InitiativeTracker({
  eventBus,
  store,
  panelId: 'initiative-1'
});
```

#### Features
- PC/NPC character management
- Round tracking
- Condition tracking
- Turn management

#### Events
- `combat:started` - Combat initiated
- `combat:ended` - Combat finished
- `combat:turn-changed` - Turn advanced
- `combat:round-started` - New round

---

## Type Definitions

### Core Types

```typescript
interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface Bounds {
  position: Position;
  size: Size;
}

enum PanelType {
  DICE_ROLLER = 'dice-roller',
  INITIATIVE_TRACKER = 'initiative-tracker',
  NOTES = 'notes',
  CHARACTER_SHEET = 'character-sheet',
  REFERENCE_TABLE = 'reference-table'
}

interface PanelConfig {
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
}
```

### State Types

```typescript
interface AppState {
  panels: Record<string, PanelState>;
  settings: AppSettings;
  layout: Layout | null;
  ui: UIState;
  notifications: Notification[];
}

interface PanelState {
  config: PanelConfig;
  data?: any;
}

interface AppSettings {
  theme: string;
  fontSize: number;
  fontFamily: string;
  animations: boolean;
  autoSave: boolean;
  soundEnabled: boolean;
}
```

---

## Integration Examples

### Creating a Custom Panel

```typescript
import { Component } from '@/components/base/Component';
import { EventBus } from '@/lib/EventBus';
import { Store } from '@/lib/Store';

export class CustomPanel extends Component {
  private eventBus: EventBus;
  private store: Store;
  private panelId: string;

  constructor(props: {
    eventBus: EventBus;
    store: Store;
    panelId: string;
  }) {
    super();
    this.eventBus = props.eventBus;
    this.store = props.store;
    this.panelId = props.panelId;
  }

  render(): string {
    return `
      <div class="custom-panel">
        <h3>Custom Panel</h3>
        <button data-action="custom-action">Do Something</button>
      </div>
    `;
  }

  mount(element: HTMLElement): void {
    super.mount(element);
    
    // Add event listeners
    const button = element.querySelector('[data-action="custom-action"]');
    button?.addEventListener('click', this.handleAction.bind(this));
    
    // Subscribe to events
    this.eventBus.on('theme:changed', () => this.render());
  }

  private handleAction(): void {
    // Emit event
    this.eventBus.emit('panel:interaction', {
      panelId: this.panelId,
      interactionType: 'custom-action'
    });
    
    // Update state
    this.store.dispatch({
      type: 'UPDATE_PANEL_DATA',
      payload: {
        panelId: this.panelId,
        data: { lastAction: Date.now() }
      }
    });
  }
}
```

### Subscribing to State Changes

```typescript
const unsubscribe = store.subscribe((state) => {
  // React to theme changes
  if (state.settings.theme !== currentTheme) {
    updateTheme(state.settings.theme);
    currentTheme = state.settings.theme;
  }
  
  // React to panel changes
  const panelCount = Object.keys(state.panels).length;
  updatePanelCounter(panelCount);
});

// Clean up when done
unsubscribe();
```

### Error Handling

```typescript
import { withErrorBoundary } from '@/monitoring';

// Wrap component with error boundary
const boundary = withErrorBoundary(panelContainer, {
  fallbackComponent: (error, errorInfo) => {
    const fallback = document.createElement('div');
    fallback.innerHTML = `
      <div class="error-state">
        <h3>Panel Error</h3>
        <p>${error.message}</p>
        <button onclick="location.reload()">Reload</button>
      </div>
    `;
    return fallback;
  },
  onError: (error, errorInfo) => {
    log.error('Panel crashed', error, {
      component: errorInfo.errorBoundary
    });
  }
});
```

---

## Best Practices

1. **Event Naming**: Use namespace:action format (e.g., `panel:opened`)
2. **State Updates**: Always use actions, never mutate directly
3. **Memory Management**: Unsubscribe from events when components unmount
4. **Error Handling**: Wrap panels in error boundaries
5. **Performance**: Debounce frequent updates (e.g., resize, drag)
6. **Accessibility**: Ensure keyboard navigation for all interactions
7. **Type Safety**: Use TypeScript interfaces for all data structures