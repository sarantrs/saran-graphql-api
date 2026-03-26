import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import fs from 'fs';

// Store original fs methods
const originalReadFileSync = fs.readFileSync;
const originalWriteFileSync = fs.writeFileSync;

describe('PostMutations', () => {
  let postMutationResolvers: any;
  let mockContext: { requestId: string };
  let writtenPosts: any[] | null = null;

  const mockUsers = [
    { id: '1', name: 'Alice', email: 'alice@example.com', createdAt: '2024-01-01T00:00:00Z' },
  ];

  const mockPosts = [
    { id: '1', title: 'Post 1', content: 'Content 1', authorId: '1', published: true, createdAt: '2024-01-01T00:00:00Z' },
    { id: '2', title: 'Post 2', content: 'Content 2', authorId: '1', published: false, createdAt: '2024-01-02T00:00:00Z' },
  ];

  beforeEach(async () => {
    jest.resetModules();
    mockContext = { requestId: 'test-request-123' };
    writtenPosts = null;

    // Mock fs.readFileSync to return test data
    (fs.readFileSync as any) = jest.fn((filepath: string) => {
      if (filepath.includes('users.json')) {
        return JSON.stringify(mockUsers);
      }
      if (filepath.includes('posts.json')) {
        return JSON.stringify(writtenPosts || mockPosts);
      }
      return originalReadFileSync(filepath, 'utf-8');
    });

    // Mock fs.writeFileSync to capture written data
    (fs.writeFileSync as any) = jest.fn((filepath: string, data: string) => {
      if (filepath.includes('posts.json')) {
        writtenPosts = JSON.parse(data);
      }
    });

    // Dynamic import after mocking
    const module = await import('../../../src/schema/mutations/post');
    postMutationResolvers = module.postMutationResolvers;
  });

  afterEach(() => {
    fs.readFileSync = originalReadFileSync;
    fs.writeFileSync = originalWriteFileSync;
  });

  describe('Mutation.createPost', () => {
    it('should create a new post', () => {
      const input = { title: 'New Post', content: 'New Content', authorId: '1', published: true };

      const result = postMutationResolvers.Mutation.createPost(null, { input }, mockContext);

      expect(result.title).toBe('New Post');
      expect(result.authorId).toBe('1');
      expect(result.published).toBe(true);
      expect(result.id).toBeDefined();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should default published to false', () => {
      const input = { title: 'Draft', content: 'Draft content', authorId: '1' };

      const result = postMutationResolvers.Mutation.createPost(null, { input }, mockContext);

      expect(result.published).toBe(false);
    });

    it('should throw error for non-existent author', () => {
      const input = { title: 'New Post', content: 'Content', authorId: '999' };

      expect(() => {
        postMutationResolvers.Mutation.createPost(null, { input }, mockContext);
      }).toThrow('Author with id 999 not found');
    });
  });

  describe('Mutation.updatePost', () => {
    it('should update an existing post', () => {
      const input = { title: 'Updated Title' };

      const result = postMutationResolvers.Mutation.updatePost(null, { id: '1', input }, mockContext);

      expect(result?.title).toBe('Updated Title');
      expect(result?.content).toBe('Content 1');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return null for non-existent post', () => {
      const input = { title: 'Updated' };

      const result = postMutationResolvers.Mutation.updatePost(null, { id: '999', input }, mockContext);

      expect(result).toBeNull();
    });
  });

  describe('Mutation.deletePost', () => {
    it('should delete an existing post', () => {
      const result = postMutationResolvers.Mutation.deletePost(null, { id: '1' }, mockContext);

      expect(result).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return false for non-existent post', () => {
      const result = postMutationResolvers.Mutation.deletePost(null, { id: '999' }, mockContext);

      expect(result).toBe(false);
    });
  });

  describe('Mutation.publishPost', () => {
    it('should publish a post', () => {
      const result = postMutationResolvers.Mutation.publishPost(null, { id: '2' }, mockContext);

      expect(result?.published).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return null for non-existent post', () => {
      const result = postMutationResolvers.Mutation.publishPost(null, { id: '999' }, mockContext);

      expect(result).toBeNull();
    });
  });

  describe('Mutation.unpublishPost', () => {
    it('should unpublish a post', () => {
      const result = postMutationResolvers.Mutation.unpublishPost(null, { id: '1' }, mockContext);

      expect(result?.published).toBe(false);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return null for non-existent post', () => {
      const result = postMutationResolvers.Mutation.unpublishPost(null, { id: '999' }, mockContext);

      expect(result).toBeNull();
    });
  });
});
