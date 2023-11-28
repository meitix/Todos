import { IGroup } from "./group";

export interface ITodo {
  id: number;
  title: string;
  group?: IGroup;
  groupId?: number;
  isDone: boolean;
  dueDate: Date;
}

export interface ITodoCreateModel {
  title: string;
  dueDate: Date;
  groupId?: number;
}
export interface ITodoUpdateModel extends ITodoCreateModel {
  isDone: boolean;
}
