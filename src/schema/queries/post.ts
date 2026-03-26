import { readData } from '../../utils/dataLoader.js';
import { createTracedLogger } from '../../utils/logger.js';
import type { User, Post } from '../../types/index.js';
import type { Context } from '../../context/index.js';

export const postQueryTypeDefs = /* GraphQL */ `
  extend type Query {
    posts: [Post!]!
    post(id: ID!): Post
    publishedPosts: [Post!]!
  }
`;

export const postQueryResolvers = {
  Query: {
    posts: (_: unknown, __: unknown, context: Context): Post[] => {
      const logger = createTracedLogger('PostQuery', context.requestId);
      logger.info('Query: posts');
      try {
        const posts = readData<Post>('posts.json');
        logger.debug('Query posts completed', { count: posts.length });
        return posts;
      } catch (error) {
        logger.error('Query posts failed', { error: (error as Error).message });
        throw error;
      }
    },
    post: (_: unknown, { id }: { id: string }, context: Context): Post | undefined => {
      const logger = createTracedLogger('PostQuery', context.requestId);
      logger.info('Query: post', { id });
      try {
        const posts = readData<Post>('posts.json');
        const post = posts.find(post => post.id === id);
        if (post) {
          logger.debug('Query post found', { id });
        } else {
          logger.warn('Query post not found', { id });
        }
        return post;
      } catch (error) {
        logger.error('Query post failed', { id, error: (error as Error).message });
        throw error;
      }
    },
    publishedPosts: (_: unknown, __: unknown, context: Context): Post[] => {
      const logger = createTracedLogger('PostQuery', context.requestId);
      logger.info('Query: publishedPosts');
      try {
        const posts = readData<Post>('posts.json');
        const published = posts.filter(post => post.published);
        logger.debug('Query publishedPosts completed', { total: posts.length, published: published.length });
        return published;
      } catch (error) {
        logger.error('Query publishedPosts failed', { error: (error as Error).message });
        throw error;
      }
    },
  },
  Post: {
    author: (parent: Post, _: unknown, context: Context): User | undefined => {
      const logger = createTracedLogger('PostQuery', context.requestId);
      logger.debug('Resolving Post.author', { postId: parent.id, authorId: parent.authorId });
      const users = readData<User>('users.json');
      const author = users.find(user => user.id === parent.authorId);
      if (!author) {
        logger.warn('Post.author not found', { postId: parent.id, authorId: parent.authorId });
      }
      return author;
    },
  },
};
