# Unit Tests

This folder contains unit tests organized to mirror the `src/` folder structure.

## Structure

```
__tests__/
├── README.md           # This file
├── context/
│   └── index.test.ts   # Tests for context creation and request ID
├── schema/
│   ├── queries/
│   │   ├── user.test.ts    # Tests for user queries (users, user, User.posts)
│   │   └── post.test.ts    # Tests for post queries (posts, post, publishedPosts, Post.author)
│   └── mutations/
│       ├── user.test.ts    # Tests for user mutations (create, update, delete)
│       └── post.test.ts    # Tests for post mutations (create, update, delete, publish, unpublish)
├── types/
│   └── index.test.ts       # Tests for TypeScript type validation
└── utils/
    ├── dataLoader.test.ts  # Tests for data loading utilities (readData, writeData, generateId)
    └── logger.test.ts      # Tests for logger utility (log levels, trace IDs, formatting)
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- __tests__/utils/logger.test.ts
```

## Test Statistics

- **Test Suites**: 8
- **Tests**: 67
- **Coverage Areas**:
  - Utilities: dataLoader, logger
  - Schema: queries, mutations
  - Context: request context creation
  - Types: TypeScript interfaces

## Writing Tests

Each test file uses Jest with ESM TypeScript support. Tests mock the `fs` module to avoid actual file operations.

### Example Pattern

```typescript
import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import fs from 'fs';

const originalReadFileSync = fs.readFileSync;

describe('ModuleName', () => {
  beforeEach(async () => {
    jest.resetModules();
    // Mock fs
    (fs.readFileSync as any) = jest.fn(() => '[]');
    // Dynamic import
    const module = await import('../../src/module');
  });

  afterEach(() => {
    fs.readFileSync = originalReadFileSync;
  });

  it('should do something', () => {
    // Test implementation
  });
});
```

## Notes

- Tests use dynamic imports to allow fs mocking before module initialization
- Mock data is defined in test files to ensure isolation
- Context tests validate request ID generation and auth header handling
