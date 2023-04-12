import { UserModel } from './../types';

export type GetUsersOutput = UserModel[]

export interface SingnupInput {
  name: unknown,
  email: unknown,
  password: unknown
}

export interface SignupOutput {
  message: string,
  token: string
}

export interface LoginInput {
  email: string,
  password: string
}

export interface LoginOutput {
  message: string,
  token: string
}

