import { ITodo } from "./todo";
import { IUser } from "./user";

export interface IGroup {
  id: number;
  title: string;
  todos: ITodo[];
  user: IUser;
}

export interface IGroupCreateOrUpdateModel {
  title: string;
}
