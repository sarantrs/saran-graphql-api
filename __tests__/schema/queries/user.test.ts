import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import fs from 'fs';

// Store original readFileSync
const originalReadFileSync = fs.readFileSync;

describe('UserQueries', () => {
  let userQueryResolvers: any;
  let mockContext: { requestId: string };

  const mockUsers = [
    { id: '1', name: 'Alice', email: 'alice@example.com', createdAt: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Bob', email: 'bob@example.com', createdAt: '2024-01-02T00:00:00Z' },
  ];

  const mockPosts = [
    { id: '1', title: 'Post 1', content: 'Content 1', authorId: '1', published: true, createdAt: '2024-01-01T00:00:00Z' },
    { id: '2', title: 'Post 2', content: 'Content 2', authorId: '1', published: false, createdAt: '2024-01-02T00:00:00Z' },
    { id: '3', title: 'Post 3', content: 'Content 3', authorId: '2', published: true, createdAt: '2024-01-03T00:00:00Z' },
  ];

  beforeEach(async () => {
    jest.resetModules();
    mockContext = { requestId: 'test-request-123' };  

    // Mock fs.readFileSync to return test data
    (fs.readFileSync as any) = jest.fn((filepath: string) => {
      if (filepath.includes('users.json')) {
        return JSON.stringify(mockUsers);
      }
      if (filepath.includes('posts.json')) {
        return JSON.stringify(mockPosts);
      }
      return originalReadFileSync(filepath, 'utf-8');
    });

    // Dynamic import after mocking
    const module = await import('../../../src/schema/queries/user');
    userQueryResolvers = module.userQueryResolvers;
  });

  afterEach(() => {
    fs.readFileSync = originalReadFileSync;
  });

  describe('Query.users', () => {
    it('should return all users', () => {
      const result = userQueryResolvers.Query.users(null, null, mockContext);
      expect(result).toEqual(mockUsers);
    });

    it('should return array of users', () => {
      const result = userQueryResolvers.Query.users(null, null, mockContext);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe('Query.user', () => {
    it('should return user by ID', () => {
      const result = userQueryResolvers.Query.user(null, { id: '1' }, mockContext);
      expect(result).toEqual(mockUsers[0]);
    });

    it('should return undefined for non-existent user', () => {
      const result = userQueryResolvers.Query.user(null, { id: '999' }, mockContext);
      expect(result).toBeUndefined();
    });
  });

  describe('User.posts', () => {
    it('should return posts for a user', () => {
      const user = mockUsers[0];
      const result = userQueryResolvers.User.posts(user, null, mockContext);
      expect(result.length).toBe(2);
      expect(result.every((post: any) => post.authorId === '1')).toBe(true);
    });

    it('should return empty array if user has no posts', () => {
      const user = { id: '999', name: 'NoPostsUser', email: 'no@posts.com' };
      const result = userQueryResolvers.User.posts(user, null, mockContext);
      expect(result).toEqual([]);
    });
  });
});
