import { PostBusiness } from './../business/PostBusiness';
import express from "express"
import { PostController } from './../controller/PostController';
import { IdGenerator } from '../services/idGenerator';
import { TokenManager } from '../services/TokenManager';
import { PostDatabase } from '../database/PostDatabase';

export const postRouter = express.Router()

const postController = new PostController(
  new PostBusiness(
    new PostDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
)

postRouter.get("/", postController.getPosts)
postRouter.post("/", postController.postPost)
postRouter.put("/:id", postController.editPost)
postRouter.delete("/:id", postController.deletePost)
postRouter.put("/:id/like", postController.likeOrDislikePost)
