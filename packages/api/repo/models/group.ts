import { IGroup } from "models/todos";
import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Todo } from "./todo";
import { User } from "./user";

@Table
export class Group extends Model implements IGroup {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  title: string;

  @HasMany(() => Todo)
  todos: Todo[];

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
