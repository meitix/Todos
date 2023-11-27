import { Router } from "express";
import { handlerWrapper } from "../helpers";
import { createLoginHandler, createRegisterHandler } from "./handlers";

export const createAuthRouter = (secretKey: string) => {
  const authRouter = Router();

  authRouter.post(
    "/register",
    handlerWrapper(createRegisterHandler(secretKey))
  );
  authRouter.post("/login", handlerWrapper(createLoginHandler(secretKey)));

  return authRouter;
};
