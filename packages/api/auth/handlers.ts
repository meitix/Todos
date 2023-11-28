import { User } from "../repo";
import { AuthResult, ICredentials } from "models/auth";
import { logger } from "logger";
import isEmail from "validator/lib/isEmail";
import { HandlerResult, RequestHandler } from "../helpers";
import { StatusCodes } from "http-status-codes";
import {
  InvalidEmailError,
  InvalidLoginCredentialsError,
  InvalidPasswordError,
  UserNotFoundError,
} from "./errors";
import { compare, hash } from "./crypto";
import { generate } from "./token-manager";

export const createRegisterHandler: (jwtSecret: string) => RequestHandler =
  (secretKey) =>
  async ({ username, password }: ICredentials) => {
    if (!isEmail(username)) {
      return new HandlerResult(
        StatusCodes.BAD_REQUEST,
        new InvalidEmailError()
      );
    }
    if (password.length < 6) {
      return new HandlerResult(
        StatusCodes.BAD_REQUEST,
        new InvalidPasswordError()
      );
    }

    try {
      const hashedPassword = await hash(password);
      const user = await User.create({ username, password: hashedPassword });
      const token = await generate(
        { username: user.username, id: user.id },
        secretKey
      );
      const result = new AuthResult(token, "", 0);
      return new HandlerResult(StatusCodes.CREATED, result);
    } catch (e) {
      logger.log("error in creating user", e);
      return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

export const createLoginHandler: (jwtSecret: string) => RequestHandler =
  (jwtSecret: string) =>
  async ({ username, password }: ICredentials) => {
    if (!username || !password) {
      return new HandlerResult(
        StatusCodes.BAD_REQUEST,
        new InvalidLoginCredentialsError()
      );
    }
    try {
      const user = await User.findOne({
        where: { username: username },
      });
      if (!user) {
        return new HandlerResult(
          StatusCodes.NOT_FOUND,
          new UserNotFoundError()
        );
      }

      const isPasswordCorrect = await compare(password, user.password);
      if (!isPasswordCorrect) {
        return new HandlerResult(
          StatusCodes.NOT_FOUND,
          new UserNotFoundError()
        );
      }

      const token = await generate(
        { username: user.username, id: user.id },
        jwtSecret
      );
      const result = new AuthResult(token, "", 0);
      return new HandlerResult(StatusCodes.OK, result);
    } catch (e) {
      logger.log(e);
      return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
