export interface UserDB {
  id: string,
  name: string,
  email: string,
  password: string,
  role: string,
  created_at: string
}

export interface PostDB {
  id: string,
  creator_id: string,
  content: string,
  likes: number,
  dislikes: number,
  created_at: string,
  updated_at: string
}

export interface PostWithCreatorDB extends PostDB{
  creator_name: string
}

export interface LikeDislikeDB {
  user_id: string,
  post_id: string,
  like: number
}

export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN"
}

export interface TokenPayload {
  id: string,
  name: string,
  role: USER_ROLES
}  


export interface UserModel {
  id: string,
  name: string,
  email: string,
  password: string,
  role: USER_ROLES,
  createdAt: string
}

export interface PostModel{
  id: string,
  creator_id: string,
  content: string,
  likes: number,
  dislikes: number,
  created_at: string,
  updated_at: string
}

export interface LikeDislikeDB {
  user_id: string,
  post_id: string,
  like: number
}

export enum POST_LIKE {
  ALREADY_LIKED = "ALREADY LIKED",
  ALREADY_DISLIKED = "ALREADY DISLIKED"
}