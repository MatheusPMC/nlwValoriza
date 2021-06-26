import { getCustomRepository } from "typeorm"
import { compare } from "bcryptjs";
import { UsersRepositories } from "../repositories/UsersRepositories"
import { sign } from "jsonwebtoken";

interface iAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {

  async execute({ email, password }: iAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories)

    const user = await usersRepositories.findOne({ email });

    if (!user) {
      throw new Error("Email/Password incorrect")
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email/Password incorrect")
    }

    const token = sign(
      { email: user.email },
      "26ea83fd842c68ba5eed0a9e40d54f5f", {
      subject: user.id,
      expiresIn: "1d"
    });

    return token
  }

}

export { AuthenticateUserService }