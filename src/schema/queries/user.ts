import { readData } from '../../utils/dataLoader.js';
import { createTracedLogger } from '../../utils/logger.js';
import type { User, Post } from '../../types/index.js';
import type { Context } from '../../context/index.js';

export const userQueryTypeDefs = /* GraphQL */ `
  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }
`;

export const userQueryResolvers = {
  Query: {
    users: (_: unknown, __: unknown, context: Context): User[] => {
      const logger = createTracedLogger('UserQuery', context.requestId);
      logger.info('Query: users');
      try {
        const users = readData<User>('users.json');
        logger.debug('Query users completed', { count: users.length });
        return users;
      } catch (error) {
        logger.error('Query users failed', { error: (error as Error).message });
        throw error;
      }
    },
    user: (_: unknown, { id }: { id: string }, context: Context): User | undefined => {
      const logger = createTracedLogger('UserQuery', context.requestId);
      logger.info('Query: user', { id });
      try {
        const users = readData<User>('users.json');
        const user = users.find(user => user.id === id);
        if (user) {
          logger.debug('Query user found', { id });
        } else {
          logger.warn('Query user not found', { id });
        }
        return user;
      } catch (error) {
        logger.error('Query user failed', { id, error: (error as Error).message });
        throw error;
      }
    },
  },
  User: {
    posts: (parent: User, _: unknown, context: Context): Post[] => {
      const logger = createTracedLogger('UserQuery', context.requestId);
      logger.debug('Resolving User.posts', { userId: parent.id });
      const posts = readData<Post>('posts.json');
      const userPosts = posts.filter(post => post.authorId === parent.id);
      logger.debug('User.posts resolved', { userId: parent.id, count: userPosts.length });
      return userPosts;
    },
  },
};
