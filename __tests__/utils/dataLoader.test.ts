import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';

// Store original fs methods
const originalReadFileSync = fs.readFileSync;
const originalWriteFileSync = fs.writeFileSync;

describe('DataLoader', () => {
  let readData: <T>(filename: string) => T[];
  let writeData: <T>(filename: string, data: T[]) => void;
  let generateId: () => string;
  let mockData: string = '[]';
  let writtenData: string | null = null;
  let shouldThrowOnRead = false;
  let shouldThrowOnWrite = false;

  beforeEach(async () => {
    jest.resetModules();
    mockData = '[]';
    writtenData = null;
    shouldThrowOnRead = false;
    shouldThrowOnWrite = false;

    // Mock fs.readFileSync
    (fs.readFileSync as any) = jest.fn((filepath: string) => {
      if (shouldThrowOnRead) {
        throw new Error('ENOENT: no such file or directory');
      }
      return mockData;
    });

    // Mock fs.writeFileSync
    (fs.writeFileSync as any) = jest.fn((filepath: string, data: string) => {
      if (shouldThrowOnWrite) {
        throw new Error('EACCES: permission denied');
      }
      writtenData = data;
    });

    // Dynamic import after mocking
    const module = await import('../../src/utils/dataLoader');
    readData = module.readData;
    writeData = module.writeData;
    generateId = module.generateId;
  });

  afterEach(() => {
    fs.readFileSync = originalReadFileSync;
    fs.writeFileSync = originalWriteFileSync;
  });

  describe('readData', () => {
    it('should read and parse JSON data from file', () => {
      const testData = [
        { id: '1', name: 'Test User', email: 'test@example.com' },
      ];
      mockData = JSON.stringify(testData);

      const result = readData<{ id: string; name: string; email: string }>('users.json');

      expect(result).toEqual(testData);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('users.json'),
        'utf-8'
      );
    });

    it('should return empty array for empty JSON array', () => {
      mockData = '[]';

      const result = readData('users.json');

      expect(result).toEqual([]);
    });

    it('should throw error for invalid JSON', () => {
      mockData = 'invalid json';

      expect(() => readData('users.json')).toThrow();
    });

    it('should throw error if file does not exist', () => {
      shouldThrowOnRead = true;

      expect(() => readData('nonexistent.json')).toThrow('ENOENT');
    });
  });

  describe('writeData', () => {
    it('should write data to file as formatted JSON', () => {
      const data = [{ id: '1', name: 'Test' }];

      writeData('users.json', data);

      expect(writtenData).toBe(JSON.stringify(data, null, 2));
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('users.json'),
        JSON.stringify(data, null, 2),
        'utf-8'
      );
    });

    it('should write empty array', () => {
      writeData('users.json', []);

      expect(writtenData).toBe('[]');
    });

    it('should throw error if write fails', () => {
      shouldThrowOnWrite = true;

      expect(() => writeData('users.json', [])).toThrow('EACCES');
    });
  });

  describe('generateId', () => {
    it('should generate a unique string ID', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with alphanumeric characters', () => {
      const id = generateId();

      expect(id).toMatch(/^[a-z0-9]+$/);
    });
  });
});
