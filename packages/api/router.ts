import { Router } from "express";
import { createAuthRouter, createGuard } from "./auth";
import { todoRouter } from "./todos";
import { groupRouter } from "./group";

export const createAppRouter = (jwtSecret: string) => {
  const appRouter = Router();
  const guard = createGuard(jwtSecret);

  appRouter.use("/auth", createAuthRouter(jwtSecret));
  appRouter.use("/todos", guard, todoRouter);
  appRouter.use("/groups", guard, groupRouter);
  return appRouter;
};
