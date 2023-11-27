import { expressjwt, Request } from "express-jwt";
import { IAuthenticatedUser } from "./models";

export const createGuard = (secretKey: string) => {
  return expressjwt({
    secret: secretKey,
    credentialsRequired: true,
    algorithms: ["HS256"],
  });
};

export type AuthorizedRequest = Request<IAuthenticatedUser>;
