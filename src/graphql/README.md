# GraphQL Operations

This folder contains GraphQL operation documents organized by type.

## Structure

```
graphql/
├── queries/
│   ├── user.graphql    # User queries
│   └── post.graphql    # Post queries
├── mutations/
│   ├── user.graphql    # User mutations
│   └── post.graphql    # Post mutations
└── fragments/
    └── common.graphql  # Reusable fragments
```

## Usage

### With GraphQL Codegen (optional)

These files can be used with `@graphql-codegen` to generate TypeScript types:

```bash
npm i -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations
```

### Variable Examples

#### GetUser Query
```json
{
  "id": "1"
}
```

#### CreateUser Mutation
```json
{
  "input": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### UpdateUser Mutation
```json
{
  "id": "1",
  "input": {
    "name": "Jane Doe"
  }
}
```

#### CreatePost Mutation
```json
{
  "input": {
    "title": "My Post",
    "content": "Post content here...",
    "authorId": "1",
    "published": true
  }
}
```
