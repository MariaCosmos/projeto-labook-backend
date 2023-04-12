import { PostModel } from './../types';

export interface GetPostsInput {
  q: unknown,
  token: unknown
}

export type GetPostsOutput = PostModel[]

export interface PostPostInput {
  content: string,
  token: unknown
}

export interface PostPostOutput {
  message: string,
  content: string
}

export interface EditPostInputDTO {
  idToEdit: string,
  token: string | undefined,
  content: unknown
}

export interface DeletePostInputDTO {
  idToDelete: string,
  token: string | undefined
}

export interface LikeOrDislikePostInputDTO {
  idToLikeOrDislike: string,
  token: string | undefined,
  like: unknown
}