// Logger utility with different log levels, structured output, and trace ID support

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  context: string;
  traceId?: string;
  message: string;
  data?: unknown;
}

class Logger {
  private minLevel: LogLevel;
  private context: string;
  private traceId?: string;

  constructor(context: string = 'App', traceId?: string) {
    this.context = context;
    this.traceId = traceId;
    // Set log level based on environment
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    this.minLevel = envLevel ? (LogLevel[envLevel as keyof typeof LogLevel] ?? LogLevel.INFO) : LogLevel.DEBUG;
  }

  /**
   * Create a child logger with a specific context
   */
  child(context: string): Logger {
    const childLogger = new Logger(context, this.traceId);
    childLogger.minLevel = this.minLevel;
    return childLogger;
  }

  /**
   * Create a logger with a trace ID for request tracing
   */
  withTrace(traceId: string): Logger {
    const tracedLogger = new Logger(this.context, traceId);
    tracedLogger.minLevel = this.minLevel;
    return tracedLogger;
  }

  private formatMessage(level: string, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      ...(this.traceId && { traceId: this.traceId }),
      message,
      ...(data !== undefined && { data }),
    };
  }

  private log(level: LogLevel, levelName: string, message: string, data?: unknown): void {
    if (level < this.minLevel) return;

    const entry = this.formatMessage(levelName, message, data);
    const output = JSON.stringify(entry);

    switch (level) {
      case LogLevel.ERROR:
        console.error(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }

  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, 'INFO', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, 'WARN', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, 'ERROR', message, data);
  }

  /**
   * Log the start of an operation (returns a function to log completion)
   */
  startOperation(operation: string, data?: unknown): () => void {
    const startTime = Date.now();
    this.debug(`${operation} started`, data);
    
    return () => {
      const duration = Date.now() - startTime;
      this.debug(`${operation} completed`, { duration: `${duration}ms` });
    };
  }
}

// Default logger instance
export const logger = new Logger('App');

// Pre-configured loggers for different contexts
export const serverLogger = new Logger('Server');

/**
 * Create a traced logger from a context object
 * Use this in resolvers to maintain trace ID across logs
 */
export function createTracedLogger(context: string, traceId?: string): Logger {
  return new Logger(context, traceId);
}
export const resolverLogger = new Logger('Resolver');
export const dataLogger = new Logger('DataLoader');
export const contextLogger = new Logger('Context');

export default Logger;
