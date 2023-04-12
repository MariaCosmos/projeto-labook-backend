import { LikeDislikeDB, POST_LIKE, PostDB, PostWithCreatorDB, UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"

  public async findPosts(q: string | undefined) {
    let postsDB

    if (q) {
      const result: PostDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .where("content", "LIKE", `%${q}%`)

      postsDB = result
    } else {
      const result: PostDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)

      postsDB = result
    }
    return postsDB
  }

  public async GetPostWithCreator(): Promise<PostWithCreatorDB[]> {
    const result: PostWithCreatorDB[] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        "playlists.id",
        "playlists.creator_id",
        "playlists.content",
        "playlists.likes",
        "playlists.dislikes",
        "playlists.created_at",
        "playlists.updated_at",
        "users.name AS creator_name"
      )
      .join("users", "posts.creator_id", "=", "users.id")

    return result
  }

  public async insertPost(newPost: PostDB) {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .insert(newPost)
  }

  public async findPostById(id: string) {
    const [postDB]: PostDB[] | undefined[] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .where({ id })

    return postDB
  }

  public async deletePost(id: string) {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .delete()
      .where({ id })
  }

  public async updatePost(id: string, postDB: PostDB) {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update(postDB)
      .where({ id })
  }

  public async findPostWithCreatorById(postId: string) {
    const result = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        "posts.id",
        "posts.creator_id",
        "posts.content",
        "posts.likes",
        "posts.dislikes",
        "posts.created_at",
        "posts.updated_at",
        "users.name AS creator_name"
      )
      .join("users", "posts.creator_id", "=", "users.id")
      .where("posts.id", postId)

    return result[0]
  }

  public async likeOrDislikePost(likeDislike: LikeDislikeDB) {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .insert(likeDislike)
  }

  public async findLikeDislike(likeDislikeDBToFind: LikeDislikeDB) {
    const [likeDislikeDB]: LikeDislikeDB[] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select()
      .where({
        user_id: likeDislikeDBToFind.user_id,
        post_id: likeDislikeDBToFind.post_id
      })

    if (likeDislikeDB) {
      return likeDislikeDB.like === 1
        ? POST_LIKE.ALREADY_LIKED
        : POST_LIKE.ALREADY_DISLIKED

    } else {
      return null
    }
  }

  public async removeLikeDislike(likeDislikeDB: LikeDislikeDB): Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })
  }

  public async updateLikeDislike(likeDislikeDB: LikeDislikeDB) {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })
  }


}