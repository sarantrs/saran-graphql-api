import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import type { IncomingMessage } from 'http';
import { createContext, createLambdaContext } from '../../src/context';

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  contextLogger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createContext', () => {
    it('should generate a requestId for each request', async () => {
      const mockReq = {
        headers: {},
        method: 'POST',
        url: '/graphql',
      } as IncomingMessage;

      const context = await createContext({ req: mockReq });

      expect(context.requestId).toBeDefined();
      expect(context.requestId).toMatch(/^req_/);
    });

    it('should generate unique requestIds', async () => {
      const mockReq = {
        headers: {},
        method: 'POST',
        url: '/graphql',
      } as IncomingMessage;

      const context1 = await createContext({ req: mockReq });
      const context2 = await createContext({ req: mockReq });

      expect(context1.requestId).not.toBe(context2.requestId);
    });

    it('should not set user when no auth header', async () => {
      const mockReq = {
        headers: {},
        method: 'POST',
        url: '/graphql',
      } as IncomingMessage;

      const context = await createContext({ req: mockReq });

      expect(context.user).toBeUndefined();
    });

    it('should handle Bearer token in authorization header', async () => {
      const mockReq = {
        headers: {
          authorization: 'Bearer test-token-123',
        },
        method: 'POST',
        url: '/graphql',
      } as unknown as IncomingMessage;

      const context = await createContext({ req: mockReq });

      // Currently returns undefined user (placeholder for JWT implementation)
      expect(context.requestId).toBeDefined();
    });
  });

  describe('createLambdaContext', () => {
    it('should generate a requestId for Lambda requests', async () => {
      const event = {
        headers: {},
      };

      const context = await createLambdaContext({ event });

      expect(context.requestId).toBeDefined();
      expect(context.requestId).toMatch(/^req_/);
    });

    it('should handle lowercase authorization header', async () => {
      const event = {
        headers: {
          authorization: 'Bearer lambda-token',
        },
      };

      const context = await createLambdaContext({ event });

      expect(context.requestId).toBeDefined();
    });

    it('should handle uppercase Authorization header', async () => {
      const event = {
        headers: {
          Authorization: 'Bearer lambda-token',
        },
      };

      const context = await createLambdaContext({ event });

      expect(context.requestId).toBeDefined();
    });
  });
});
