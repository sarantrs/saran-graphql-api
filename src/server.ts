import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { schema } from './schema/index.js';
import { createContext, type Context } from './context/index.js';
import { serverLogger as logger } from './utils/logger.js';

logger.info('Initializing Apollo Server...');

const server = new ApolloServer<Context>({
  schema,
  introspection: true, // Enable introspection for development
  plugins: [
    {
      async requestDidStart({ request }) {
        const operationName = request.operationName || 'anonymous';
        logger.info('GraphQL request started', { operationName });
        
        return {
          async didEncounterErrors({ errors }) {
            for (const error of errors) {
              logger.error('GraphQL error', {
                message: error.message,
                path: error.path,
                extensions: error.extensions,
              });
            }
          },
          async willSendResponse({ response }) {
            const hasErrors = response.body.kind === 'single' && response.body.singleResult.errors;
            logger.info('GraphQL request completed', {
              operationName,
              hasErrors: !!hasErrors,
            });
          },
        };
      },
    },
  ],
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

logger.info(`Starting server on port ${PORT}...`);

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: createContext,
});

logger.info(`Server ready at ${url}`);
logger.info(`GraphQL Playground available at ${url}`);
