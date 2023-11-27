import { IUser } from "models/todos";
import { IUser as AuthUser } from "models/auth";
import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { Todo } from "./todo";
import { Group } from "./group";

@Table
export class User extends Model implements IUser, AuthUser {
  @Column
  name: string;
  @Column
  password: string;

  @HasMany(() => Todo)
  todos: Todo[];

  @HasMany(() => Group)
  groups: Group[];
}
