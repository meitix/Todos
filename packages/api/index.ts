import express from "express";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import { initDatabase, DatabaseTypes } from "./repo";
import { createAppRouter } from "./router";

const app = express();
app.use(cors());
app.use(express.json());

dotenvConfig();

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  API_PORT,
  DB_HOST,
  DB_TYPE,
  JWT_SECRET_KEY,
} = process.env;

console.log({
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  API_PORT,
  DB_HOST,
  DB_TYPE,
  JWT_SECRET_KEY,
});

if (
  !DB_NAME ||
  !DB_USERNAME ||
  !DB_PASSWORD ||
  !API_PORT ||
  !DB_HOST ||
  !DB_TYPE ||
  !JWT_SECRET_KEY
) {
  throw new Error(`Required configuration(s) is missing.`);
}

app.use(createAppRouter(JWT_SECRET_KEY));
initDatabase(
  {
    host: DB_HOST,
    databaseType: DB_TYPE as DatabaseTypes,
    database: DB_NAME,
    password: DB_PASSWORD,
    username: DB_USERNAME,
  },
  () => {
    console.log("Connection has been established successfully.");
  },
  (error) => {
    console.error("Unable to connect to the database:", error);
  }
);

app.listen(API_PORT, () =>
  console.log(`Todos api is listening to port ${API_PORT}`)
);
