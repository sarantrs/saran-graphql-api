import { describe, it, expect } from '@jest/globals';
import type { User, Post, CreateUserInput, UpdateUserInput, CreatePostInput, UpdatePostInput } from '../../src/types/index.js';

describe('Types', () => {
  describe('User', () => {
    it('should have correct structure', () => {
      const user: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
      };

      expect(user.id).toBe('1');
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.createdAt).toBe('2024-01-01T00:00:00Z');
    });
  });

  describe('Post', () => {
    it('should have correct structure', () => {
      const post: Post = {
        id: '1',
        title: 'Test Post',
        content: 'Test content',
        authorId: '1',
        published: true,
        createdAt: '2024-01-01T00:00:00Z',
      };

      expect(post.id).toBe('1');
      expect(post.title).toBe('Test Post');
      expect(post.content).toBe('Test content');
      expect(post.authorId).toBe('1');
      expect(post.published).toBe(true);
    });

    it('should allow published to be false', () => {
      const post: Post = {
        id: '1',
        title: 'Draft',
        content: 'Draft content',
        authorId: '1',
        published: false,
        createdAt: '2024-01-01T00:00:00Z',
      };

      expect(post.published).toBe(false);
    });
  });

  describe('CreateUserInput', () => {
    it('should require name and email', () => {
      const input: CreateUserInput = {
        name: 'New User',
        email: 'new@example.com',
      };

      expect(input.name).toBe('New User');
      expect(input.email).toBe('new@example.com');
    });
  });

  describe('UpdateUserInput', () => {
    it('should allow partial updates', () => {
      const input1: UpdateUserInput = { name: 'Updated Name' };
      const input2: UpdateUserInput = { email: 'updated@example.com' };
      const input3: UpdateUserInput = { name: 'New', email: 'new@example.com' };
      const input4: UpdateUserInput = {};

      expect(input1.name).toBe('Updated Name');
      expect(input1.email).toBeUndefined();
      expect(input2.email).toBe('updated@example.com');
      expect(input2.name).toBeUndefined();
      expect(input3.name).toBe('New');
      expect(input3.email).toBe('new@example.com');
      expect(Object.keys(input4)).toHaveLength(0);
    });
  });

  describe('CreatePostInput', () => {
    it('should require title, content, and authorId', () => {
      const input: CreatePostInput = {
        title: 'New Post',
        content: 'Post content',
        authorId: '1',
      };

      expect(input.title).toBe('New Post');
      expect(input.content).toBe('Post content');
      expect(input.authorId).toBe('1');
      expect(input.published).toBeUndefined();
    });

    it('should allow optional published field', () => {
      const input: CreatePostInput = {
        title: 'New Post',
        content: 'Post content',
        authorId: '1',
        published: true,
      };

      expect(input.published).toBe(true);
    });
  });

  describe('UpdatePostInput', () => {
    it('should allow partial updates', () => {
      const input1: UpdatePostInput = { title: 'Updated Title' };
      const input2: UpdatePostInput = { published: true };
      const input3: UpdatePostInput = {};

      expect(input1.title).toBe('Updated Title');
      expect(input2.published).toBe(true);
      expect(Object.keys(input3)).toHaveLength(0);
    });
  });
});
