import { readData, writeData, generateId } from '../../utils/dataLoader.js';
import { createTracedLogger } from '../../utils/logger.js';
import type { User, CreateUserInput, UpdateUserInput } from '../../types/index.js';
import type { Context } from '../../context/index.js';

export const userMutationTypeDefs = /* GraphQL */ `
  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean!
  }
`;

export const userMutationResolvers = {
  Mutation: {
    createUser: (_: unknown, { input }: { input: CreateUserInput }, context: Context): User => {
      const logger = createTracedLogger('UserMutation', context.requestId);
      logger.info('Mutation: createUser', { email: input.email });
      
      try {
        const users = readData<User>('users.json');
        
        // Check for duplicate email
        if (users.some(u => u.email === input.email)) {
          logger.warn('createUser failed: duplicate email', { email: input.email });
          throw new Error(`User with email ${input.email} already exists`);
        }

        const newUser: User = {
          id: generateId(),
          name: input.name,
          email: input.email,
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        writeData('users.json', users);
        
        logger.info('createUser success', { userId: newUser.id, email: newUser.email });
        return newUser;
      } catch (error) {
        logger.error('createUser error', { error: (error as Error).message, input });
        throw error;
      }
    },

    updateUser: (_: unknown, { id, input }: { id: string; input: UpdateUserInput }, context: Context): User | null => {
      const logger = createTracedLogger('UserMutation', context.requestId);
      logger.info('Mutation: updateUser', { id, input });
      
      try {
        const users = readData<User>('users.json');
        const index = users.findIndex(u => u.id === id);
        
        if (index === -1) {
          logger.warn('updateUser failed: user not found', { id });
          return null;
        }

        // Check for duplicate email if updating email
        if (input.email && input.email !== users[index].email) {
          if (users.some(u => u.email === input.email)) {
            logger.warn('updateUser failed: duplicate email', { id, email: input.email });
            throw new Error(`User with email ${input.email} already exists`);
          }
        }

        const updatedUser: User = {
          ...users[index],
          ...(input.name && { name: input.name }),
          ...(input.email && { email: input.email }),
        };

        users[index] = updatedUser;
        writeData('users.json', users);
        
        logger.info('updateUser success', { id });
        return updatedUser;
      } catch (error) {
        logger.error('updateUser error', { id, error: (error as Error).message });
        throw error;
      }
    },

    deleteUser: (_: unknown, { id }: { id: string }, context: Context): boolean => {
      const logger = createTracedLogger('UserMutation', context.requestId);
      logger.info('Mutation: deleteUser', { id });
      
      try {
        const users = readData<User>('users.json');
        const index = users.findIndex(u => u.id === id);
        
        if (index === -1) {
          logger.warn('deleteUser failed: user not found', { id });
          return false;
        }

        users.splice(index, 1);
        writeData('users.json', users);
        
        logger.info('deleteUser success', { id });
        return true;
      } catch (error) {
        logger.error('deleteUser error', { id, error: (error as Error).message });
        throw error;
      }
    },
  },
};
