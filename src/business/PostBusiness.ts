import { NotFoundError } from './../errors/NotFoundError';
import { UserDatabase } from './../database/UserDatabase';
import { USER_ROLES, UserDB } from './../types';
import { Post } from './../models/Post';
import { BadRequestError } from './../errors/BadRequestError';
import { DeletePostInputDTO, EditPostInputDTO, GetPostsInput, GetPostsOutput, LikeOrDislikePostInputDTO, PostPostInput, PostPostOutput } from './../dtos/postDTO';
import { TokenManager } from './../services/TokenManager';
import { IdGenerator } from '../services/idGenerator';
import { PostDatabase } from './../database/PostDatabase';
import { HashManager } from '../services/HashManager';
import { LikeDislikeDB } from './../types';
import { POST_LIKE } from './../types';


export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) { }

  public getPosts = async (input: GetPostsInput) => {
    const { q, token } = input

    if (typeof q !== "string" && q !== undefined) {
      throw new BadRequestError("'q' deve ser string ou undefined")
    }

    if (typeof token !== "string") {
      throw new BadRequestError("preencha o campo authorization com token válido")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("token inválido")
    }

    const postsDB = await this.postDatabase.findPosts(q)

    const posts = postsDB.map((postDB) => {
      const post = new Post(
        postDB.id,
        postDB.creator_id,
        postDB.content,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        postDB.updated_at
      )
      return post.toBusinessModel()
    })

    const output: GetPostsOutput = posts

    return output

  }

  public PostPost = async (input: PostPostInput) => {
    const { content, token } = input

    if (typeof content !== "string") {
      throw new BadRequestError("'content' deve ser string")
    }

    if (typeof token !== "string") {
      throw new BadRequestError("token ausente")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("token inválido")
    }

    const id = this.idGenerator.generate()
    const created_at = new Date().toISOString()
    const updated_at = new Date().toISOString()
    const creator_id = payload.id
    const likes = 0
    const dislikes = 0

    const newPost = new Post(
      id,
      creator_id,
      content,
      likes,
      dislikes,
      created_at,
      updated_at
    )

    const newPostDB = newPost.toDBModel()
    await this.postDatabase.insertPost(newPostDB)

    const output: PostPostOutput = {
      message: "Post realizado com sucesso",
      content
    }

    return output
  }

  public async editPost(input: EditPostInputDTO) {
    const { idToEdit, token, content } = input

    if (token === undefined) {
      throw new BadRequestError("token ausente")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("token inválido")
    }

    if (typeof content !== "string") {
      throw new BadRequestError("'content' deve ser string")
    }

    const postDB = await this.postDatabase.findPostById(idToEdit)

    if (!postDB) {
      throw new NotFoundError("'id' não encontrado")
    }

    const creatorId = payload.id

    if (postDB.creator_id !== creatorId) {
      throw new BadRequestError("somente quem criou o Post pode editá-lo")
    }

    const post = new Post(
      postDB.id,
      postDB.creator_id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at
    )

    post.setContent(content)
    post.setUpdatedAt(new Date().toISOString())

    const updatedPostDB = post.toDBModel()

    await this.postDatabase.updatePost(idToEdit, updatedPostDB)

  }

  public async deletePost(input: DeletePostInputDTO) {
    const { idToDelete, token } = input

    if (token === undefined) {
      throw new BadRequestError("token ausente")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("token inválido")
    }

    const postDB = await this.postDatabase.findPostById(idToDelete)

    if (!postDB) {
      throw new NotFoundError("'id' não encontrado")
    }

    const creatorId = payload.id

    if (
      payload.role !== USER_ROLES.ADMIN
      && postDB.creator_id !== creatorId
    ) {
      throw new BadRequestError("somente quem criou a playlist pode deletá-la")
    }

    await this.postDatabase.deletePost(idToDelete)
  }

  public async likeOrDislikePost (input: LikeOrDislikePostInputDTO){
    const { idToLikeOrDislike, token, like } = input

    if (token === undefined) {
        throw new BadRequestError("token ausente")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
        throw new BadRequestError("token inválido")
    }

    if (typeof like !== "boolean") {
        throw new BadRequestError("'like' deve ser boolean")
    }

    const postWithCreatorDB = await this.postDatabase
        .findPostWithCreatorById(idToLikeOrDislike)

    if (!postWithCreatorDB) {
        throw new NotFoundError("'id' não encontrado")
    }

    const userId = payload.id
    const likeSQLite = like ? 1 : 0

    const likeDislikeDB: LikeDislikeDB = {
        user_id: userId,
        post_id: postWithCreatorDB.id,
        like: likeSQLite
    }

    const post = new Post(
      postWithCreatorDB.id,
      postWithCreatorDB.name,
      postWithCreatorDB.likes,
      postWithCreatorDB.dislikes,
      postWithCreatorDB.created_at,
      postWithCreatorDB.updated_at,
      postWithCreatorDB.creator_id,
    )

    const likeDislikeExists = await this.postDatabase
        .findLikeDislike(likeDislikeDB)

    if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
        if (like) {
            await this.postDatabase.removeLikeDislike(likeDislikeDB)
            post.removeLike()
        } else {
            await this.postDatabase.updateLikeDislike(likeDislikeDB)
            post.removeLike()
            post.addDislike()
        }

    } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
        if (like) {
            await this.postDatabase.updateLikeDislike(likeDislikeDB)
            post.removeDislike()
            post.addLike()
        } else {
            await this.postDatabase.removeLikeDislike(likeDislikeDB)
            post.removeDislike()
        }

    } else {
        await this.postDatabase.likeOrDislikePost(likeDislikeDB)

        like ? post.addLike() : post.addDislike()
    }

    const updatedPostDB = post.toDBModel()

    await this.postDatabase.updatePost(idToLikeOrDislike, updatedPostDB)
}


}