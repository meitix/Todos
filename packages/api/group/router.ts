import { Router } from "express";
import { handlerWrapper } from "../helpers";
import {
  createGroup,
  deleteGroup,
  getGroup,
  getGroups,
  updateGroup,
} from "./handlers";

export const groupRouter = Router();

groupRouter.post("/", handlerWrapper(createGroup));
groupRouter.get("/", handlerWrapper(getGroups));
groupRouter.get("/:id", handlerWrapper(getGroup));
groupRouter.put("/:id", handlerWrapper(updateGroup));
groupRouter.delete("/:id", handlerWrapper(deleteGroup));
