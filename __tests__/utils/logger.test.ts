import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { createTracedLogger, serverLogger } from '../../src/utils/logger';

describe('Logger', () => {
  let consoleOutput: { log: string[]; warn: string[]; error: string[] };
  let originalConsoleLog: typeof console.log;
  let originalConsoleWarn: typeof console.warn;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    // Store original console methods
    originalConsoleLog = console.log;
    originalConsoleWarn = console.warn;
    originalConsoleError = console.error;
    
    // Capture console output
    consoleOutput = { log: [], warn: [], error: [] };
    console.log = jest.fn((msg: string) => consoleOutput.log.push(msg));
    console.warn = jest.fn((msg: string) => consoleOutput.warn.push(msg));
    console.error = jest.fn((msg: string) => consoleOutput.error.push(msg));
  });

  afterEach(() => {
    // Restore console methods
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  });

  describe('createTracedLogger', () => {
    it('should create a logger with the specified context', () => {
      const logger = createTracedLogger('TestContext');
      logger.info('test message');

      expect(consoleOutput.log.length).toBe(1);
      const logEntry = JSON.parse(consoleOutput.log[0]);
      expect(logEntry.context).toBe('TestContext');
      expect(logEntry.message).toBe('test message');
    });

    it('should include traceId when provided', () => {
      const logger = createTracedLogger('TestContext', 'trace-123');
      logger.info('test message');

      const logEntry = JSON.parse(consoleOutput.log[0]);
      expect(logEntry.traceId).toBe('trace-123');
    });

    it('should not include traceId when not provided', () => {
      const logger = createTracedLogger('TestContext');
      logger.info('test message');

      const logEntry = JSON.parse(consoleOutput.log[0]);
      expect(logEntry.traceId).toBeUndefined();
    });
  });

  describe('log levels', () => {
    it('should log debug messages', () => {
      const logger = createTracedLogger('Test');
      logger.debug('debug message', { extra: 'data' });

      expect(consoleOutput.log.length).toBe(1);
      const logEntry = JSON.parse(consoleOutput.log[0]);
      expect(logEntry.level).toBe('DEBUG');
      expect(logEntry.message).toBe('debug message');
      expect(logEntry.data).toEqual({ extra: 'data' });
    });

    it('should log info messages', () => {
      const logger = createTracedLogger('Test');
      logger.info('info message');

      const logEntry = JSON.parse(consoleOutput.log[0]);
      expect(logEntry.level).toBe('INFO');
    });

    it('should log warn messages to console.warn', () => {
      const logger = createTracedLogger('Test');
      logger.warn('warning message');

      expect(consoleOutput.warn.length).toBe(1);
      const logEntry = JSON.parse(consoleOutput.warn[0]);
      expect(logEntry.level).toBe('WARN');
    });

    it('should log error messages to console.error', () => {
      const logger = createTracedLogger('Test');
      logger.error('error message');

      expect(consoleOutput.error.length).toBe(1);
      const logEntry = JSON.parse(consoleOutput.error[0]);
      expect(logEntry.level).toBe('ERROR');
    });
  });

  describe('log entry format', () => {
    it('should include timestamp in ISO format', () => {
      const logger = createTracedLogger('Test');
      logger.info('test');

      const logEntry = JSON.parse(consoleOutput.log[0]);
      expect(logEntry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should include data object when provided', () => {
      const logger = createTracedLogger('Test');
      logger.info('test', { userId: '123', action: 'login' });

      const logEntry = JSON.parse(consoleOutput.log[0]);
      expect(logEntry.data).toEqual({ userId: '123', action: 'login' });
    });

    it('should not include data field when not provided', () => {
      const logger = createTracedLogger('Test');
      logger.info('test');

      const logEntry = JSON.parse(consoleOutput.log[0]);
      expect(logEntry.data).toBeUndefined();
    });
  });

  describe('serverLogger', () => {
    it('should have Server context', () => {
      serverLogger.info('server message');

      const logEntry = JSON.parse(consoleOutput.log[0]);
      expect(logEntry.context).toBe('Server');
    });
  });

  describe('startOperation', () => {
    it('should log operation start and provide completion function', () => {
      const logger = createTracedLogger('Test');
      const complete = logger.startOperation('TestOp', { id: '123' });

      expect(consoleOutput.log.length).toBe(1);
      expect(consoleOutput.log[0]).toContain('TestOp started');

      complete();

      expect(consoleOutput.log.length).toBe(2);
      expect(consoleOutput.log[1]).toContain('TestOp completed');
    });
  });
});
