import type { IncomingMessage } from 'http';
import { contextLogger as logger } from '../utils/logger.js';

/**
 * Context interface for GraphQL resolvers
 * Contains authenticated user info (placeholder for JWT auth)
 */
export interface Context {
  user?: {
    id: string;
    email?: string;
  };
  requestId: string;
}

/**
 * Generate a unique request ID for tracing
 */
function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create context for each GraphQL request
 * Parses Authorization header for future JWT support
 */
export async function createContext({ req }: { req: IncomingMessage }): Promise<Context> {
  const requestId = generateRequestId();
  const authHeader = req.headers.authorization;

  logger.info('Processing request', { requestId, method: req.method, url: req.url });

  // Placeholder for JWT authentication
  // In production, you would:
  // 1. Extract the token from "Bearer <token>"
  // 2. Verify the JWT signature
  // 3. Decode the payload to get user info

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    logger.debug('Auth token received', { requestId, tokenPreview: token.substring(0, 10) + '...' });
    
    // TODO: Implement JWT verification
    // const payload = verifyJwt(token);
    // return { user: { id: payload.sub, email: payload.email }, requestId };
  } else {
    logger.debug('No auth token provided', { requestId });
  }

  // Return context with request ID (unauthenticated request)
  return { requestId };
}

/**
 * Create context for Lambda/Vercel handler
 */
export async function createLambdaContext({ event }: { event: { headers: Record<string, string | undefined> } }): Promise<Context> {
  const requestId = generateRequestId();
  const authHeader = event.headers.authorization || event.headers.Authorization;

  logger.info('Processing Lambda request', { requestId });

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    logger.debug('Auth token received', { requestId, tokenPreview: token.substring(0, 10) + '...' });
  } else {
    logger.debug('No auth token provided', { requestId });
  }

  return { requestId };
}
