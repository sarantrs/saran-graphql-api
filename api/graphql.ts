import { ApolloServer } from '@apollo/server';
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from '@as-integrations/aws-lambda';
import { schema } from '../src/schema/index.js';
import { createLambdaContext } from '../src/context/index.js';

const server = new ApolloServer({
  schema,
  introspection: process.env.NODE_ENV !== 'production',
});

// Using double assertion to work around ESM/CJS module mismatch
export default startServerAndCreateLambdaHandler(
  server as unknown as Parameters<typeof startServerAndCreateLambdaHandler>[0],
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: createLambdaContext,
  }
);
