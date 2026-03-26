import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import fs from 'fs';

// Store original fs methods
const originalReadFileSync = fs.readFileSync;
const originalWriteFileSync = fs.writeFileSync;

describe('UserMutations', () => {
  let userMutationResolvers: any;
  let mockContext: { requestId: string };
  let writtenData: any[] | null = null;

  const mockUsers = [
    { id: '1', name: 'Alice', email: 'alice@example.com', createdAt: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Bob', email: 'bob@example.com', createdAt: '2024-01-02T00:00:00Z' },
  ];

  beforeEach(async () => {
    jest.resetModules();
    mockContext = { requestId: 'test-request-123' };
    writtenData = null;

    // Mock fs.readFileSync to return test data
    (fs.readFileSync as any) = jest.fn((filepath: string) => {
      if (filepath.includes('users.json')) {
        return JSON.stringify(writtenData || mockUsers);
      }
      return originalReadFileSync(filepath, 'utf-8');
    });

    // Mock fs.writeFileSync to capture written data
    (fs.writeFileSync as any) = jest.fn((filepath: string, data: string) => {
      if (filepath.includes('users.json')) {
        writtenData = JSON.parse(data);
      }
    });

    // Dynamic import after mocking
    const module = await import('../../../src/schema/mutations/user');
    userMutationResolvers = module.userMutationResolvers;
  });

  afterEach(() => {
    fs.readFileSync = originalReadFileSync;
    fs.writeFileSync = originalWriteFileSync;
  });

  describe('Mutation.createUser', () => {
    it('should create a new user', () => {
      const input = { name: 'Charlie', email: 'charlie@example.com' };

      const result = userMutationResolvers.Mutation.createUser(null, { input }, mockContext);

      expect(result.name).toBe('Charlie');
      expect(result.email).toBe('charlie@example.com');
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should throw error for duplicate email', () => {
      const input = { name: 'Duplicate', email: 'alice@example.com' };

      expect(() => {
        userMutationResolvers.Mutation.createUser(null, { input }, mockContext);
      }).toThrow('User with email alice@example.com already exists');
    });
  });

  describe('Mutation.updateUser', () => {
    it('should update an existing user', () => {
      const input = { name: 'Alice Updated' };

      const result = userMutationResolvers.Mutation.updateUser(null, { id: '1', input }, mockContext);

      expect(result?.name).toBe('Alice Updated');
      expect(result?.email).toBe('alice@example.com');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return null for non-existent user', () => {
      const input = { name: 'Updated' };

      const result = userMutationResolvers.Mutation.updateUser(null, { id: '999', input }, mockContext);

      expect(result).toBeNull();
    });

    it('should throw error when updating to existing email', () => {
      const input = { email: 'bob@example.com' };

      expect(() => {
        userMutationResolvers.Mutation.updateUser(null, { id: '1', input }, mockContext);
      }).toThrow('User with email bob@example.com already exists');
    });
  });

  describe('Mutation.deleteUser', () => {
    it('should delete an existing user', () => {
      const result = userMutationResolvers.Mutation.deleteUser(null, { id: '1' }, mockContext);

      expect(result).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return false for non-existent user', () => {
      const result = userMutationResolvers.Mutation.deleteUser(null, { id: '999' }, mockContext);

      expect(result).toBe(false);
    });
  });
});
