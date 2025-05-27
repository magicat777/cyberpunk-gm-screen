# Architecture Documentation - Cyberpunk GM Screen

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │   Panels    │  │  Components  │  │  Error Boundaries  │    │
│  └──────┬──────┘  └──────┬───────┘  └─────────┬──────────┘    │
│         │                 │                     │               │
├─────────┴─────────────────┴───────────────────┴────────────────┤
│                      State Management Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐    │
│  │    Store     │  │   Actions    │  │    Middleware     │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘    │
│         │                 │                    │               │
├─────────┴─────────────────┴────────────────────┴────────────────┤
│                     Event System Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐    │
│  │   EventBus   │  │   Handlers   │  │    Subscribers    │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘    │
│         │                 │                    │               │
├─────────┴─────────────────┴────────────────────┴────────────────┤
│                   Monitoring & Observability                    │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐    │
│  │     RUM      │  │   Metrics    │  │     Logging       │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘    │
│         │                 │                    │               │
└─────────┴─────────────────┴────────────────────┴────────────────┘
                            │
                            ▼
                    External Services
         ┌──────────────────────────────────────┐
         │  Prometheus  │  Grafana  │   APIs    │
         └──────────────────────────────────────┘
```

## Component Architecture

### Core Components

```
src/
├── components/
│   ├── base/
│   │   └── Component.ts        # Base component class
│   ├── panels/
│   │   ├── Panel.ts           # Panel container
│   │   ├── dice-roller/       # Dice rolling panel
│   │   ├── notes/             # Notes panel
│   │   └── initiative-tracker/ # Initiative tracking
│   └── layout/
│       ├── PanelManager.ts    # Panel orchestration
│       └── LayoutManager.ts   # Layout persistence
├── lib/
│   ├── EventBus.ts            # Event system
│   ├── Store.ts               # State management
│   ├── DragHandler.ts         # Drag functionality
│   └── ResizeHandler.ts       # Resize functionality
├── monitoring/
│   ├── rum.ts                 # Real User Monitoring
│   ├── metrics.ts             # Custom metrics
│   ├── prometheus.ts          # Prometheus export
│   ├── logger.ts              # Structured logging
│   ├── error-boundary.ts      # Error handling
│   └── debug-mode.ts          # Debug interface
└── types/
    └── index.ts               # TypeScript definitions
```

### Component Relationships

```
┌─────────────────┐         ┌─────────────────┐
│  PanelManager   │◄────────│    EventBus     │
└────────┬────────┘         └─────────────────┘
         │                           ▲
         │ manages                   │ emits
         ▼                           │
┌─────────────────┐         ┌─────────────────┐
│     Panel       │────────▶│   PanelContent  │
└────────┬────────┘         └─────────────────┘
         │                           │
         │ uses                      │ extends
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  DragHandler    │         │    Component    │
│  ResizeHandler  │         └─────────────────┘
└─────────────────┘
```

## Data Flow Architecture

### State Management Flow

```
User Action
    │
    ▼
┌─────────────┐
│   Dispatch  │
│   Action    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware  │ ◄── Logging, Analytics
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Reducer   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ State Update│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Subscribers │ ──► UI Updates
└─────────────┘
```

### Event Flow

```
Component Event
    │
    ▼
┌─────────────┐
│ Event.emit()│
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  EventBus   │────▶│  Listeners  │
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Wildcard   │────▶│  Monitoring │
│  Listeners  │     └─────────────┘
└─────────────┘
```

## Monitoring Architecture

### Metrics Collection Pipeline

```
Browser Events
    │
    ├─► Performance Observer API
    │        │
    │        ▼
    │   ┌──────────┐
    │   │   RUM    │
    │   └────┬─────┘
    │        │
    ├─► User Actions
    │        │
    │        ▼
    │   ┌──────────┐
    │   │ Metrics  │
    │   └────┬─────┘
    │        │
    └─► Errors │
             │
             ▼
        ┌──────────┐
        │ Exporter │
        └────┬─────┘
             │
             ▼
    ┌────────────────┐
    │  Prometheus    │
    │  Push Gateway  │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │    Grafana     │
    │   Dashboard    │
    └────────────────┘
```

### Error Handling Architecture

```
Component Error
    │
    ▼
┌─────────────────┐
│ Error Boundary  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Recovery   Fallback UI
    │         │
    │         ▼
    │    ┌─────────────┐
    │    │   Logger    │
    │    └──────┬──────┘
    │           │
    │           ▼
    │    ┌─────────────┐
    │    │     RUM     │
    │    └──────┬──────┘
    │           │
    └───────────┴──────► Monitoring
```

## Security Architecture

### Client-Side Security Layers

```
┌─────────────────────────────────────────┐
│          Content Security Policy         │
├─────────────────────────────────────────┤
│         Input Validation Layer          │
├─────────────────────────────────────────┤
│          State Sanitization             │
├─────────────────────────────────────────┤
│         Secure Communication            │
│              (HTTPS Only)               │
└─────────────────────────────────────────┘
```

### Data Flow Security

```
User Input
    │
    ▼
Validation ──► Rejected
    │
    ▼
Sanitization
    │
    ▼
State Update
    │
    ▼
Persistence ──► Encrypted Storage
```

## Performance Architecture

### Optimization Strategies

```
┌─────────────────────────────────────────┐
│           Code Splitting                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐│
│  │ Core.js │  │Panel.js │  │Theme.js ││
│  └─────────┘  └─────────┘  └─────────┘│
├─────────────────────────────────────────┤
│           Lazy Loading                  │
│  - Components loaded on demand          │
│  - Images with intersection observer    │
├─────────────────────────────────────────┤
│           Caching Strategy              │
│  - Service Worker for assets            │
│  - LocalStorage for user data          │
│  - Memory cache for computations       │
└─────────────────────────────────────────┘
```

### Rendering Pipeline

```
State Change
    │
    ▼
Debounce ──► Batch Updates
    │
    ▼
Virtual DOM Diff
    │
    ▼
DOM Update ──► RequestAnimationFrame
    │
    ▼
Paint ──► Composite
```

## Deployment Architecture

### CI/CD Pipeline

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Commit  │────▶│   Build  │────▶│   Test   │
└──────────┘     └──────────┘     └────┬─────┘
                                        │
                                   Pass │ Fail
                                        │  │
                                        ▼  ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Deploy  │◄────│  Package │     │ Rollback │
└────┬─────┘     └──────────┘     └──────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│  Staging  │  Production  │  DR Site     │
└─────────────────────────────────────────┘
```

### Infrastructure

```
┌─────────────────────────────────────────┐
│              CloudFlare CDN             │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌─────────▼────────┐
│  GitHub Pages  │      │  Netlify Edge   │
│  (Production)  │      │   (Staging)     │
└────────────────┘      └─────────────────┘
```

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    │
    ├─► CDN Node 1 ──► Edge Cache
    │
    ├─► CDN Node 2 ──► Edge Cache
    │
    └─► CDN Node N ──► Edge Cache
```

### Performance Budgets

| Metric | Target | Max |
|--------|--------|-----|
| First Contentful Paint | 1.0s | 1.5s |
| Time to Interactive | 2.5s | 3.5s |
| Bundle Size (gzipped) | 150KB | 200KB |
| Memory Usage | 50MB | 100MB |

## Technology Stack

### Frontend
- **Framework**: Vanilla TypeScript (no framework dependency)
- **Build Tool**: Vite
- **Styling**: CSS Modules + Design System
- **State**: Custom Redux-like Store
- **Events**: Custom EventBus

### Development
- **Language**: TypeScript 5.x
- **Testing**: Vitest + Playwright
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions

### Monitoring
- **RUM**: Custom implementation
- **Metrics**: Prometheus
- **Visualization**: Grafana
- **Logging**: Structured JSON
- **Errors**: Sentry-compatible

### Infrastructure
- **Hosting**: GitHub Pages / Netlify
- **CDN**: CloudFlare
- **Analytics**: Self-hosted
- **Monitoring**: ODIN Stack

## Design Patterns

### Component Pattern
```typescript
class Component {
  render(): string
  mount(element: HTMLElement): void
  unmount(): void
  update(props: any): void
}
```

### Observer Pattern
```typescript
EventBus.on('event', callback)
EventBus.emit('event', data)
Store.subscribe(listener)
```

### Command Pattern
```typescript
Store.dispatch({ type: 'ACTION', payload: data })
```

### Factory Pattern
```typescript
PanelManager.createPanel({ type: 'dice-roller' })
```

### Singleton Pattern
```typescript
GlobalErrorBoundary.getInstance()
MonitoringService.initialize()
```

## Future Architecture Considerations

1. **WebAssembly Integration**: For performance-critical calculations
2. **Web Workers**: For background processing
3. **IndexedDB**: For larger data storage needs
4. **WebRTC**: For real-time collaboration
5. **PWA Enhancement**: For offline capabilities
6. **Module Federation**: For micro-frontend architecture