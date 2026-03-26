# Saran GraphQL API

A GraphQL API built with Apollo Server 4 and TypeScript, deployable to Vercel.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **GraphQL**: Apollo Server 4
- **Deployment**: Vercel (serverless)
- **Data**: JSON files (mock database)

## Project Structure

```
├── api/
│   └── graphql.ts          # Vercel serverless entry point
├── src/
│   ├── schema/
│   │   ├── types/          # GraphQL type definitions
│   │   ├── queries/        # Query resolvers
│   │   ├── mutations/      # Mutation resolvers
│   │   └── index.ts        # Schema merger
│   ├── graphql/            # GraphQL operation documents
│   │   ├── queries/        # Query documents with variables
│   │   ├── mutations/      # Mutation documents with variables
│   │   └── fragments/      # Reusable fragments
│   ├── dataModel/          # JSON mock database
│   ├── context/            # Request context (auth placeholder)
│   ├── types/              # TypeScript interfaces
│   └── utils/              # Utility functions
│   └── server.ts           # Standalone local server
├── package.json
├── tsconfig.json
└── vercel.json
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Server starts at http://localhost:4000

### Type Check

```bash
npm run type-check
```

### Build

```bash
npm run build
```

## Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## API Examples

### Using Variables (Recommended)

GraphQL variables make queries reusable and type-safe. Always use variables instead of inline values in production.

---

### Queries with Variables

#### Get User by ID
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    posts {
      title
      published
    }
  }
}
```
**Variables:**
```json
{
  "id": "1"
}
```

#### Get All Users
```graphql
query GetUsers {
  users {
    id
    name
    email
    posts {
      title
    }
  }
}
```

#### Get Post by ID
```graphql
query GetPost($id: ID!) {
  post(id: $id) {
    id
    title
    content
    published
    author {
      name
    }
  }
}
```
**Variables:**
```json
{
  "id": "1"
}
```

#### Get All Posts
```graphql
query GetPosts {
  posts {
    id
    title
    content
    published
    author {
      name
    }
  }
}
```

#### Get Published Posts Only
```graphql
query GetPublishedPosts {
  publishedPosts {
    id
    title
    author {
      name
    }
  }
}
```

---

### Mutations with Variables

#### Create User
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
    createdAt
  }
}
```
**Variables:**
```json
{
  "input": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Update User
```graphql
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    name
    email
  }
}
```
**Variables:**
```json
{
  "id": "1",
  "input": {
    "name": "Alice Updated"
  }
}
```

#### Delete User
```graphql
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
```
**Variables:**
```json
{
  "id": "1"
}
```

#### Create Post
```graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    content
    published
    author {
      name
    }
  }
}
```
**Variables:**
```json
{
  "input": {
    "title": "My New Post",
    "content": "This is the content of my post.",
    "authorId": "1",
    "published": true
  }
}
```

#### Update Post
```graphql
mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
  updatePost(id: $id, input: $input) {
    id
    title
    published
  }
}
```
**Variables:**
```json
{
  "id": "1",
  "input": {
    "title": "Updated Title",
    "published": true
  }
}
```

#### Publish/Unpublish Post
```graphql
mutation PublishPost($id: ID!) {
  publishPost(id: $id) {
    id
    title
    published
  }
}
```
**Variables:**
```json
{
  "id": "4"
}
```

---

### Postman Usage

**POST** `http://localhost:4000/`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "query": "query GetUser($id: ID!) { user(id: $id) { id name email } }",
  "variables": {
    "id": "1"
  }
}
```

**Mutation Example:**
```json
{
  "query": "mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { id name email } }",
  "variables": {
    "input": {
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

---

### Operation Names

Always use descriptive operation names for better tracing and debugging:

| Operation | Name Pattern | Example |
|-----------|--------------|---------|
| Query single | `Get{Entity}` | `GetUser`, `GetPost` |
| Query list | `Get{Entities}` | `GetUsers`, `GetPosts` |
| Create | `Create{Entity}` | `CreateUser`, `CreatePost` |
| Update | `Update{Entity}` | `UpdateUser`, `UpdatePost` |
| Delete | `Delete{Entity}` | `DeleteUser`, `DeletePost` |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port (local dev) | `4000` |
| `NODE_ENV` | Environment mode | `development` |
| `LOG_LEVEL` | Logging level | `DEBUG` |

## License

ISC
