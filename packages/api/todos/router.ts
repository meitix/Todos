import { Router } from "express";
import { handlerWrapper } from "../helpers";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "./handlers";

export const todoRouter = Router();

todoRouter.post("/", handlerWrapper(createTodo));
todoRouter.get("/", handlerWrapper(getTodos));
todoRouter.get("/:id", handlerWrapper(getTodo));
todoRouter.put("/:id", handlerWrapper(updateTodo));
todoRouter.delete("/:id", handlerWrapper(deleteTodo));
