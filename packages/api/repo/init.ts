import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Group, Todo, User } from "./models";

export type DatabaseTypes = Dialect;

export interface DatabaseConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  databaseType: DatabaseTypes;
}

export const initDatabase: (
  cfg: DatabaseConfig,
  onSuccess: () => any,
  onError: (err: Error) => any
) => void = (
  { database, username, password, host, databaseType },
  onSuccess,
  onError
) => {
  const sequelize = new Sequelize({
    database,
    username,
    password,
    host: host,
    dialect: databaseType,
    models: [User, Group, Todo],
  });

  sequelize.authenticate().then(onSuccess).catch(onError);
  sequelize.sync();
};
