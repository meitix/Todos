import { ITodo } from "./todo";
import { IUser } from "./user";

export interface IGroup {
  title: string;
  todos: ITodo[];
  user: IUser;
}

export interface IGroupCreateOrUpdateModel {
  title: string;
}
