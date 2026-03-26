import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs as baseTypeDefs } from './types/index.js';
import { queryTypeDefs, queryResolvers } from './queries/index.js';
import { mutationTypeDefs, mutationResolvers } from './mutations/index.js';

// Merge all type definitions
export const typeDefs = mergeTypeDefs([
  ...baseTypeDefs,
  ...queryTypeDefs,
  ...mutationTypeDefs,
]);

// Merge all resolvers
export const resolvers = mergeResolvers([
  ...queryResolvers,
  ...mutationResolvers,
]);

// Create executable schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
