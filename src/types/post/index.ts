// Post type definitions

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  createdAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
  published?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  published?: boolean;
}
