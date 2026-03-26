import { userQueryTypeDefs, userQueryResolvers } from './user.js';
import { postQueryTypeDefs, postQueryResolvers } from './post.js';

export const queryTypeDefs = [userQueryTypeDefs, postQueryTypeDefs];

export const queryResolvers = [userQueryResolvers, postQueryResolvers];
