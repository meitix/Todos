import { IGroup, ITodo } from "models/todos";
import {
  BelongsTo,
  Column,
  Model,
  Table,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./user";
import { Group } from "./group";

@Table
export class Todo extends Model implements ITodo {
  @Column
  title: string;

  @ForeignKey(() => Group)
  groupId: number;

  @BelongsTo(() => Group)
  group?: Group;

  @Column
  isDone: boolean;

  @Column
  dueDate: Date;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
