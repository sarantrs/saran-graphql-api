import { readData, writeData, generateId } from '../../utils/dataLoader.js';
import { createTracedLogger } from '../../utils/logger.js';
import type { Post, User, CreatePostInput, UpdatePostInput } from '../../types/index.js';
import type { Context } from '../../context/index.js';

export const postMutationTypeDefs = /* GraphQL */ `
  extend type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post
    deletePost(id: ID!): Boolean!
    publishPost(id: ID!): Post
    unpublishPost(id: ID!): Post
  }
`;

export const postMutationResolvers = {
  Mutation: {
    createPost: (_: unknown, { input }: { input: CreatePostInput }, context: Context): Post => {
      const logger = createTracedLogger('PostMutation', context.requestId);
      logger.info('Mutation: createPost', { title: input.title, authorId: input.authorId });
      
      try {
        const posts = readData<Post>('posts.json');
        const users = readData<User>('users.json');
        
        // Verify author exists
        if (!users.some(u => u.id === input.authorId)) {
          logger.warn('createPost failed: author not found', { authorId: input.authorId });
          throw new Error(`Author with id ${input.authorId} not found`);
        }

        const newPost: Post = {
          id: generateId(),
          title: input.title,
          content: input.content,
          authorId: input.authorId,
          published: input.published ?? false,
          createdAt: new Date().toISOString(),
        };

        posts.push(newPost);
        writeData('posts.json', posts);
        
        logger.info('createPost success', { postId: newPost.id, title: newPost.title });
        return newPost;
      } catch (error) {
        logger.error('createPost error', { error: (error as Error).message, input });
        throw error;
      }
    },

    updatePost: (_: unknown, { id, input }: { id: string; input: UpdatePostInput }, context: Context): Post | null => {
      const logger = createTracedLogger('PostMutation', context.requestId);
      logger.info('Mutation: updatePost', { id, input });
      
      try {
        const posts = readData<Post>('posts.json');
        const index = posts.findIndex(p => p.id === id);
        
        if (index === -1) {
          logger.warn('updatePost failed: post not found', { id });
          return null;
        }

        const updatedPost: Post = {
          ...posts[index],
          ...(input.title !== undefined && { title: input.title }),
          ...(input.content !== undefined && { content: input.content }),
          ...(input.published !== undefined && { published: input.published }),
        };

        posts[index] = updatedPost;
        writeData('posts.json', posts);
        
        logger.info('updatePost success', { id });
        return updatedPost;
      } catch (error) {
        logger.error('updatePost error', { id, error: (error as Error).message });
        throw error;
      }
    },

    deletePost: (_: unknown, { id }: { id: string }, context: Context): boolean => {
      const logger = createTracedLogger('PostMutation', context.requestId);
      logger.info('Mutation: deletePost', { id });
      
      try {
        const posts = readData<Post>('posts.json');
        const index = posts.findIndex(p => p.id === id);
        
        if (index === -1) {
          logger.warn('deletePost failed: post not found', { id });
          return false;
        }

        posts.splice(index, 1);
        writeData('posts.json', posts);
        
        logger.info('deletePost success', { id });
        return true;
      } catch (error) {
        logger.error('deletePost error', { id, error: (error as Error).message });
        throw error;
      }
    },

    publishPost: (_: unknown, { id }: { id: string }, context: Context): Post | null => {
      const logger = createTracedLogger('PostMutation', context.requestId);
      logger.info('Mutation: publishPost', { id });
      
      try {
        const posts = readData<Post>('posts.json');
        const index = posts.findIndex(p => p.id === id);
        
        if (index === -1) {
          logger.warn('publishPost failed: post not found', { id });
          return null;
        }

        posts[index].published = true;
        writeData('posts.json', posts);
        
        logger.info('publishPost success', { id });
        return posts[index];
      } catch (error) {
        logger.error('publishPost error', { id, error: (error as Error).message });
        throw error;
      }
    },

    unpublishPost: (_: unknown, { id }: { id: string }, context: Context): Post | null => {
      const logger = createTracedLogger('PostMutation', context.requestId);
      logger.info('Mutation: unpublishPost', { id });
      
      try {
        const posts = readData<Post>('posts.json');
        const index = posts.findIndex(p => p.id === id);
        
        if (index === -1) {
          logger.warn('unpublishPost failed: post not found', { id });
          return null;
        }

        posts[index].published = false;
        writeData('posts.json', posts);
        
        logger.info('unpublishPost success', { id });
        return posts[index];
      } catch (error) {
        logger.error('unpublishPost error', { id, error: (error as Error).message });
        throw error;
      }
    },
  },
};
