import { IGroup } from "./group";

export interface ITodo {
  title: string;
  group?: IGroup;
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
