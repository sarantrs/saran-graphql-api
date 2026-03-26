export const userTypeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    posts: [Post!]!
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }
`;
