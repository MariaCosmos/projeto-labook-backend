import { NotFoundError } from './../errors/NotFoundError';
import { TokenManager } from './../services/TokenManager';
import { User } from './../models/User';
import { USER_ROLES, TokenPayload } from './../types';
import { BadRequestError } from './../errors/BadRequestError';
import { SingnupInput, SignupOutput, LoginInput, LoginOutput } from './../dtos/userDTO';
import { UserDatabase } from './../database/UserDatabase';
import { IdGenerator } from './../services/idGenerator';
import { HashManager } from '../services/HashManager';

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) { }

  public signup = async (input: SingnupInput) => {
    const { name, email, password } = input

    if (typeof name !== "string") {
      throw new BadRequestError("'name' deve ser string")
    }

    if (typeof email !== "string") {
      throw new BadRequestError("'email' deve ser string")
    }

    if (typeof password !== "string") {
      throw new BadRequestError("'password' deve ser string")
    }

    const id = this.idGenerator.generate()

    const passwordHash = await this.hashManager.hash(password)

    const newUser = new User(
      id,
      name,
      email,
      passwordHash,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    )

    const newUserDB = newUser.toDBModel()
    await this.userDatabase.insertUser(newUserDB)

    const payload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole() as USER_ROLES
    }

    const token = this.tokenManager.createToken(payload)

    const output: SignupOutput = {
      message: "Cadastro realizado com sucesso",
      token
    }
    return output
  }

  public login = async (input: LoginInput) => {
    const { email, password } = input
 
    if (typeof email !== "string") {
      throw new BadRequestError("'email' deve ser string")
    }

    if (typeof password !== "string") {
      throw new BadRequestError("'password' deve ser string")
    }

    const userDB = await this.userDatabase.findUserByEmail(email)

    if (!userDB) {
      throw new NotFoundError("'email' não encontrado")
    }

    const passwordHash = await this.hashManager.compare(password, userDB.password)

    if (!passwordHash) {
      throw new BadRequestError("'email' ou 'password' incorreto")
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    )

    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole() as USER_ROLES
    }

    const token = this.tokenManager.createToken(payload)

    const output: LoginOutput = {
      message: "Login realizado com sucesso",
      token
    }

    return output
  }
}