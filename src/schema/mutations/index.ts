import { userMutationTypeDefs, userMutationResolvers } from './user.js';
import { postMutationTypeDefs, postMutationResolvers } from './post.js';

export const mutationTypeDefs = [userMutationTypeDefs, postMutationTypeDefs];

export const mutationResolvers = [userMutationResolvers, postMutationResolvers];
