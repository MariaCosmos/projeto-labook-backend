import { DeletePostInputDTO, EditPostInputDTO, GetPostsInput, LikeOrDislikePostInputDTO, PostPostInput } from './../dtos/postDTO';
import { PostBusiness } from './../business/PostBusiness';
import { Request, Response } from "express"

export class PostController {
  constructor(
    private postBusiness: PostBusiness
  ) { }

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input: GetPostsInput = {
        q: req.query.q,
        token: req.headers.authorization
      }

      const output = await this.postBusiness.getPosts(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
        res.status(500)
      }

      if (error instanceof Error) {
        res.send(error.message)
      } else {
        res.send("Erro inesperado")
      }
    }
  }

  public postPost = async (req: Request, res: Response) => {
    try {
      const input: PostPostInput = {
        content: req.body.content,
        token: req.headers.authorization
      }

      const output = await this.postBusiness.PostPost(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
        res.status(500)
      }

      if (error instanceof Error) {
        res.send(error.message)
      } else {
        res.send("Erro inesperado")
      }
    }
  }

  public editPost = async (req: Request, res: Response) => {
    try {
      const input: EditPostInputDTO = {
        idToEdit: req.params.id,
        content: req.body.content,
        token: req.headers.authorization
      }

      await this.postBusiness.editPost(input)

      res.status(200).end()
    } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
        res.status(500)
      }

      if (error instanceof Error) {
        res.send(error.message)
      } else {
        res.send("Erro inesperado")
      }
    }
  }

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input: DeletePostInputDTO = {
        idToDelete: req.params.id,
        token: req.headers.authorization
      }

      await this.postBusiness.deletePost(input)

      res.status(200).end()
    } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
        res.status(500)
      }

      if (error instanceof Error) {
        res.send(error.message)
      } else {
        res.send("Erro inesperado")
      }
    }
  }

  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
      const input: LikeOrDislikePostInputDTO = {
        idToLikeOrDislike: req.params.id,
        token: req.headers.authorization,
        like: req.body.like
      }

      await this.postBusiness.likeOrDislikePost(input)

      res.status(200).end()
    } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
        res.status(500)
      }

      if (error instanceof Error) {
        res.send(error.message)
      } else {
        res.send("Erro inesperado")
      }
    }
  }


}