# Monitoring & Observability Guide - Cyberpunk GM Screen

## Overview
The Cyberpunk GM Screen includes comprehensive monitoring and observability features integrated with the ODIN stack (Prometheus + Grafana).

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│   Browser   │────▶│     RUM      │────▶│ Prometheus │
└─────────────┘     └──────────────┘     └────────────┘
       │                    │                     │
       │            ┌──────────────┐              │
       └───────────▶│   Metrics    │              │
                    └──────────────┘              │
                            │                     ▼
                    ┌──────────────┐       ┌────────────┐
                    │   Logger     │       │  Grafana   │
                    └──────────────┘       └────────────┘
```

## Components

### 1. Real User Monitoring (RUM)
Tracks user behavior and performance metrics in real-time.

**Initialization:**
```typescript
import { initializeRUM } from './monitoring/rum';

const rum = initializeRUM({
  apiEndpoint: 'https://your-api.com/rum',
  apiKey: 'your-api-key',
  sampleRate: 1.0, // 100% sampling
  environment: 'production',
  version: '1.0.0'
});
```

**Tracked Metrics:**
- Page load performance
- Resource loading times
- Core Web Vitals (LCP, FID, CLS)
- User interactions (clicks, form submissions)
- JavaScript errors
- Session duration

### 2. Custom Metrics Collection
Application-specific metrics for panel usage and gameplay.

**Initialization:**
```typescript
import { initializeMetrics } from './monitoring/metrics';

const metrics = initializeMetrics(eventBus);
```

**Tracked Metrics:**
- Panel opens/closes
- Panel focus time
- Dice roll statistics
- Error counts
- User engagement

### 3. Prometheus Integration
Exports metrics in Prometheus format for ODIN stack.

**Configuration:**
```typescript
import { initializePrometheus } from './monitoring/prometheus';

const prometheus = initializePrometheus({
  endpoint: 'https://prometheus-pushgateway.odin.local',
  pushInterval: 30000, // 30 seconds
  jobName: 'cyberpunk-gm-screen',
  instance: window.location.hostname,
  username: 'prometheus',
  password: 'secure-password'
});
```

**Available Metrics:**
```
# User Metrics
cyberpunk_gm_active_users
cyberpunk_gm_session_duration_seconds

# Panel Metrics
cyberpunk_gm_panel_opens_total{panel_type, panel_id}
cyberpunk_gm_panel_focus_duration_seconds{panel_type, panel_id}
cyberpunk_gm_panel_interactions_total{panel_type, interaction_type}

# Dice Metrics
cyberpunk_gm_dice_rolls_total{formula}
cyberpunk_gm_dice_result_value{formula}
cyberpunk_gm_dice_critical_total
cyberpunk_gm_dice_fumble_total

# Performance Metrics
cyberpunk_gm_page_load_duration_seconds{page}
cyberpunk_gm_lcp_duration_seconds{page}
cyberpunk_gm_fid_duration_seconds{event_type}
cyberpunk_gm_resource_load_duration_seconds{resource_type, resource_name}

# Error Metrics
cyberpunk_gm_errors_total{error_type, severity}
cyberpunk_gm_memory_usage_bytes
```

### 4. Structured Logging
Consistent logging with context and metadata.

**Usage:**
```typescript
import { log, PanelLogger, PerformanceLogger } from './monitoring/logger';

// Basic logging
log.info('Application started', { version: '1.0.0' });
log.error('Failed to load panel', new Error('Network error'), { panelId: 'dice-roller' });

// Component-specific logging
const panelLogger = new PanelLogger('dice-roller', logConfig);
panelLogger.logInteraction('roll', { formula: '1d20' });

// Performance logging
const perfLogger = new PerformanceLogger(logConfig);
perfLogger.mark('panel-render-start');
// ... render panel ...
perfLogger.measure('panel-render', 'panel-render-start');
```

**Log Levels:**
- `DEBUG`: Detailed debugging information
- `INFO`: General information
- `WARN`: Warning messages
- `ERROR`: Error messages
- `FATAL`: Critical errors

### 5. Error Boundaries
Catches and reports component errors gracefully.

**Usage:**
```typescript
import { withErrorBoundary } from './monitoring/error-boundary';

const boundary = withErrorBoundary(panelContainer, {
  fallbackComponent: (error, errorInfo) => {
    return createCustomErrorUI(error);
  },
  onError: (error, errorInfo) => {
    console.error('Panel crashed:', error);
  },
  enableReporting: true,
  enableRecovery: true
});
```

### 6. Debug Mode
Development tools for troubleshooting.

**Activation:**
- Add `?debug=true` to URL
- Press `Ctrl+Shift+D`
- Run `debug.enable()` in console

**Features:**
- Real-time metrics display
- Event log viewer
- State inspector
- Performance profiler
- Console API

**Console Commands:**
```javascript
debug.getState()          // Current application state
debug.getMetrics()        // Metrics summary
debug.getEvents()         // Recent events
debug.dispatch(action)    // Dispatch store action
debug.emit(event, data)   // Emit event
```

## Grafana Dashboards

### Main Dashboard
Import `/monitoring/grafana/dashboard.json` into Grafana.

**Panels:**
- Active Users
- Panel Usage Over Time
- Dice Roll Statistics
- Error Rate
- Page Load Performance
- Core Web Vitals
- Top Dice Formulas
- Recent Errors

### Custom Queries
```promql
# Average session duration
avg(cyberpunk_gm_session_duration_seconds)

# Panel popularity
topk(5, sum by (panel_type) (cyberpunk_gm_panel_opens_total))

# Error rate per minute
sum(rate(cyberpunk_gm_errors_total[5m])) * 60

# 95th percentile page load time
histogram_quantile(0.95, 
  sum(rate(cyberpunk_gm_page_load_duration_seconds_bucket[5m])) by (le)
)
```

## Alert Configuration

### Critical Alerts
- **High Error Rate**: >50 errors/min
- **Page Load Time**: >5 seconds
- **SLO Violations**: <99% availability

### Warning Alerts
- **Moderate Error Rate**: >10 errors/min
- **Memory Usage**: >500MB
- **Poor Web Vitals**: LCP >2.5s, FID >100ms

### Info Alerts
- **No Active Users**: 30min inactivity
- **Unusual Activity**: Statistical anomalies

## Best Practices

### 1. Sampling Strategy
```typescript
// Full sampling for errors
if (isError) {
  rum.trackError(error); // Always track
}

// Sample regular metrics
if (Math.random() < 0.1) { // 10% sampling
  rum.recordMetric('routine.metric', value);
}
```

### 2. Context Enrichment
```typescript
// Add context to all logs
logger.setContext({
  userId: currentUser.id,
  sessionId: session.id,
  environment: config.env
});
```

### 3. Performance Budget
```typescript
// Monitor performance budget
if (metrics.pageLoadTime > PERFORMANCE_BUDGET) {
  logger.warn('Performance budget exceeded', {
    actual: metrics.pageLoadTime,
    budget: PERFORMANCE_BUDGET
  });
}
```

### 4. Error Recovery
```typescript
// Implement graceful degradation
boundary.onError = (error) => {
  // Log error
  logger.error('Component failed', error);
  
  // Show fallback UI
  showFallbackPanel();
  
  // Attempt recovery
  setTimeout(() => boundary.resetError(), 5000);
};
```

## Troubleshooting

### Missing Metrics
1. Check RUM initialization
2. Verify Prometheus endpoint
3. Check network requests
4. Enable debug mode

### High Error Rate
1. Check error logs
2. Review error boundaries
3. Check component health
4. Monitor memory usage

### Performance Issues
1. Review performance metrics
2. Check resource loading
3. Analyze render times
4. Profile with debug mode

## Security Considerations

### Data Privacy
- No PII in metrics
- Anonymized user IDs
- Secure transmission (HTTPS)
- Data retention policies

### Access Control
- API key authentication
- Basic auth for Prometheus
- Role-based Grafana access
- Encrypted credentials

## Integration Checklist

- [ ] RUM configured with API endpoint
- [ ] Prometheus push gateway accessible
- [ ] Grafana dashboards imported
- [ ] Alert rules configured
- [ ] Debug mode tested
- [ ] Error boundaries implemented
- [ ] Logging configured
- [ ] Security review completed

## Maintenance

### Daily
- Check error rates
- Monitor performance
- Review alerts

### Weekly
- Analyze user patterns
- Review metrics trends
- Update dashboards

### Monthly
- Performance optimization
- Alert threshold review
- Security audit