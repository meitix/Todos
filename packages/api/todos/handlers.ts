import { ITodoCreateModel, ITodoUpdateModel, IUser } from "models/todos";
import { HandlerResult, RequestHandler } from "../helpers";
import { IAuthenticatedUser } from "../auth";
import { Todo } from "../repo";
import { StatusCodes } from "http-status-codes";
import { logger } from "logger";
import { InvalidTodoData, TodoNotFoundError } from "./errors";
import { Op, WhereOptions } from "sequelize";

export const createTodo: RequestHandler = async (
  user: IAuthenticatedUser,
  { title, dueDate, groupId }: ITodoCreateModel
) => {
  if (!title || !user) {
    return new HandlerResult(StatusCodes.BAD_REQUEST, new InvalidTodoData());
  }

  try {
    const todo = await Todo.create({
      groupId,
      title,
      userId: user.id,
      dueDate,
    });
    return new HandlerResult(StatusCodes.CREATED, todo);
  } catch (e) {
    logger.log("Error on creating todo:", e);
    return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getTodos: RequestHandler = async (
  user: IAuthenticatedUser,
  filters: { q?: string }
) => {
  try {
    const where: WhereOptions<Todo> = { userId: user.id };
    const q = filters?.q;
    if (q) {
      where.title = { [Op.like]: `%${q}%` };
    }

    const todos = await Todo.findAll({
      where,
    });
    return new HandlerResult(StatusCodes.OK, todos);
  } catch (e) {
    logger.log("Error on finding user todos", e);
    return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getTodo: RequestHandler = async (
  user: IAuthenticatedUser,
  { id }: { id: number }
) => {
  try {
    const todo = await Todo.findOne({
      where: { userId: user.id, id },
    });
    if (!todo) {
      return new HandlerResult(StatusCodes.NOT_FOUND, new TodoNotFoundError());
    }
    return new HandlerResult(StatusCodes.OK, todo);
  } catch (e) {
    logger.log("Error on finding user todos", e);
    return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateTodo: RequestHandler = async (
  user: IAuthenticatedUser,
  id: { id: number },
  updatedFields: ITodoUpdateModel
) => {
  try {
    let todo = await Todo.findOne({ where: { id, userId: user.id } });

    if (!todo) {
      return new HandlerResult(StatusCodes.NOT_FOUND, new TodoNotFoundError());
    }
    todo = await todo.update(updatedFields);

    return new HandlerResult(StatusCodes.OK, todo);
  } catch (e) {
    logger.log("Error on updating todo:", e);
    return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteTodo: RequestHandler = async (
  user: IAuthenticatedUser,
  todoId: number
) => {
  try {
    const todo = await Todo.findOne({ where: { id: todoId, userId: user.id } });
    if (!todo) {
      return new HandlerResult(StatusCodes.NOT_FOUND, new TodoNotFoundError());
    }
    await todo.destroy();
    return new HandlerResult(StatusCodes.OK);
  } catch (e) {
    logger.log("Error on deleting todo:", e);
    return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
