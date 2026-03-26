import { userTypeDefs } from './user.js';
import { postTypeDefs } from './post.js';

// Base type definitions with Query and Mutation roots
const baseTypeDefs = /* GraphQL */ `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [baseTypeDefs, userTypeDefs, postTypeDefs];
