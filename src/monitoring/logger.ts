/**
 * Structured Logging Implementation
 * Provides consistent logging with context and metadata
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

interface LogContext {
  userId?: string;
  sessionId?: string;
  panelId?: string;
  action?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  error?: Error;
  stackTrace?: string;
}

interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  bufferSize: number;
  flushInterval: number;
}

class Logger {
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private context: LogContext = {};
  private flushTimer?: NodeJS.Timer;

  constructor(config: LoggerConfig) {
    this.config = config;
    
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.startRemoteLogging();
    }
  }

  public setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  public clearContext(): void {
    this.context = {};
  }

  public debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  public warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  public error(message: string, error?: Error | string, context?: LogContext): void {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    this.log(LogLevel.ERROR, message, context, errorObj);
  }

  public fatal(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.FATAL, message, context, error);
    // Fatal errors should trigger immediate flush
    this.flush();
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...this.context, ...context },
      error,
      stackTrace: error?.stack
    };

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Buffer for remote logging
    if (this.config.enableRemote) {
      this.buffer.push(entry);
      
      // Check buffer size
      if (this.buffer.length >= this.config.bufferSize) {
        this.flush();
      }
    }
  }

  private logToConsole(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const contextStr = Object.keys(entry.context).length > 0 
      ? ` ${JSON.stringify(entry.context)}` 
      : '';
    
    const message = `[${entry.timestamp}] ${levelName}: ${entry.message}${contextStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message);
        if (entry.error) {
          console.error(entry.error);
        }
        break;
    }
  }

  private startRemoteLogging(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0 || !this.config.remoteEndpoint) {
      return;
    }

    const logs = [...this.buffer];
    this.buffer = [];

    try {
      const response = await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          logs,
          metadata: {
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        // Re-add logs to buffer if send failed
        this.buffer.unshift(...logs);
      }
    } catch (error) {
      // Re-add logs to buffer if send failed
      this.buffer.unshift(...logs);
      console.error('Failed to send logs:', error);
    }
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Create specialized loggers for different components
export class PanelLogger extends Logger {
  constructor(panelId: string, config: LoggerConfig) {
    super(config);
    this.setContext({ panelId });
  }

  public logInteraction(action: string, details?: any): void {
    this.info(`Panel interaction: ${action}`, { action, ...details });
  }

  public logStateChange(oldState: any, newState: any): void {
    this.debug('Panel state changed', {
      oldState: JSON.stringify(oldState),
      newState: JSON.stringify(newState)
    });
  }
}

export class PerformanceLogger extends Logger {
  private marks: Map<string, number> = new Map();

  public mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  public measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    if (!start) {
      this.warn(`Start mark ${startMark} not found`);
      return 0;
    }

    const end = endMark ? this.marks.get(endMark) : performance.now();
    if (!end) {
      this.warn(`End mark ${endMark} not found`);
      return 0;
    }

    const duration = end - start;
    this.info(`Performance measurement: ${name}`, {
      measurement: name,
      duration: `${duration.toFixed(2)}ms`,
      startMark,
      endMark
    });

    return duration;
  }

  public logResourceTiming(resource: PerformanceResourceTiming): void {
    this.debug('Resource loaded', {
      resource: resource.name,
      duration: `${resource.duration.toFixed(2)}ms`,
      size: resource.transferSize,
      type: resource.initiatorType
    });
  }
}

// Default logger instance
let defaultLogger: Logger | null = null;

export function initializeLogger(config: LoggerConfig): Logger {
  if (defaultLogger) {
    defaultLogger.destroy();
  }
  defaultLogger = new Logger(config);
  return defaultLogger;
}

export function getLogger(): Logger {
  if (!defaultLogger) {
    // Create with default config if not initialized
    defaultLogger = new Logger({
      level: LogLevel.INFO,
      enableConsole: true,
      enableRemote: false,
      bufferSize: 100,
      flushInterval: 30000
    });
  }
  return defaultLogger;
}

// Convenience functions
export const log = {
  debug: (message: string, context?: LogContext) => getLogger().debug(message, context),
  info: (message: string, context?: LogContext) => getLogger().info(message, context),
  warn: (message: string, context?: LogContext) => getLogger().warn(message, context),
  error: (message: string, error?: Error | string, context?: LogContext) => getLogger().error(message, error, context),
  fatal: (message: string, error?: Error, context?: LogContext) => getLogger().fatal(message, error, context)
};