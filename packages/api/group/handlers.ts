import { IGroupCreateOrUpdateModel, IUser } from "models/todos";
import { HandlerResult, RequestHandler } from "../helpers";
import { IAuthenticatedUser } from "../auth";
import { Group } from "../repo";
import { StatusCodes } from "http-status-codes";
import { logger } from "logger";
import { InvalidGroupData, GroupNotFoundError } from "./errors";
import { Op, WhereOptions } from "sequelize";

export const createGroup: RequestHandler = async (
  user: IAuthenticatedUser,
  { title }: IGroupCreateOrUpdateModel
) => {
  if (!title || !user) {
    return new HandlerResult(StatusCodes.BAD_REQUEST, new InvalidGroupData());
  }

  try {
    const group = await Group.create({
      title,
      userId: user.id,
    });
    return new HandlerResult(StatusCodes.CREATED, group);
  } catch (e) {
    logger.log("Error on creating group:", e);
    return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getGroups: RequestHandler = async (
  user: IAuthenticatedUser,
  filters: { q?: string }
) => {
  try {
    const where: WhereOptions<Group> = { userId: user.id };
    const q = filters?.q;
    if (q) {
      where.title = { [Op.like]: `%${q}%` };
    }

    const groups = await Group.findAll({
      where,
    });
    return new HandlerResult(StatusCodes.OK, groups);
  } catch (e) {
    logger.log("Error on finding user groups", e);
    return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getGroup: RequestHandler = async (
  user: IAuthenticatedUser,
  { id }: { id: number }
) => {
  try {
    const group = await Group.findOne({
      where: { userId: user.id, id },
    });
    if (!group) {
      return new HandlerResult(StatusCodes.NOT_FOUND, new GroupNotFoundError());
    }
    return new HandlerResult(StatusCodes.OK, group);
  } catch (e) {
    logger.log("Error on finding user groups", e);
    return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const updateGroup: RequestHandler = async (
  user: IAuthenticatedUser,
  { id }: { id: number },
  updatedFields: IGroupCreateOrUpdateModel
) => {
  try {
    let group = await Group.findOne({
      where: { id, userId: user.id },
    });

    if (!group) {
      return new HandlerResult(StatusCodes.NOT_FOUND, new GroupNotFoundError());
    }
    group = await group.update(updatedFields);

    return new HandlerResult(StatusCodes.OK, group);
  } catch (e) {
    logger.log("Error on updating group:", e);
    return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const deleteGroup: RequestHandler = async (
  user: IAuthenticatedUser,
  { id }: { id: number }
) => {
  try {
    const group = await Group.findOne({
      where: { id, userId: user.id },
    });
    if (!group) {
      return new HandlerResult(StatusCodes.NOT_FOUND, new GroupNotFoundError());
    }
    await group.destroy();
    return new HandlerResult(StatusCodes.OK);
  } catch (e) {
    logger.log("Error on deleting group:", e);
    return new HandlerResult(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
