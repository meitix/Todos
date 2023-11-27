import { IGroup } from "models/todos";
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Todo } from "./todo";
import { User } from "./user";

@Table
export class Group extends Model implements IGroup {
  @Column
  title: string;

  @HasMany(() => Todo)
  todos: Todo[];

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
