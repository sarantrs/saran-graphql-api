export const postTypeDefs = /* GraphQL */ `
  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdAt: String!
    author: User!
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
    published: Boolean
  }

  input UpdatePostInput {
    title: String
    content: String
    published: Boolean
  }
`;
