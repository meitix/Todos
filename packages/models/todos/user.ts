import { IGroup } from "./group";
import { ITodo } from "./todo";

export interface IUser {
  todos: ITodo[];
  groups: IGroup[];
}
