import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { schema } from '../src/schema/index.js';
import { createTracedLogger } from '../src/utils/logger.js';
import type { NextApiRequest, NextApiResponse } from 'next';

const server = new ApolloServer({
  schema,
  introspection: true,
});

// Type assertion to handle ESM/CJS module mismatch
const handler = startServerAndCreateNextHandler(
  server as unknown as Parameters<typeof startServerAndCreateNextHandler>[0],
  {
    context: async (req: NextApiRequest) => {
      const requestId = `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      const logger = createTracedLogger('GraphQL', requestId);
      logger.info('Request received');
      
      return {
        requestId,
        user: undefined, // Auth placeholder
      };
    },
  }
);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  return handler(req, res);
}
