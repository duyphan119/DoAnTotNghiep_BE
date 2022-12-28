import "reflect-metadata";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { __prod__ } from "./constants";
import { AppDataSource } from "./data-source";
import rootRouter from "./routes";
require("dotenv").config();
let PORT = "8080";
if (process.env.PORT) {
  PORT = process.env.PORT;
}

const main = async () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "../")));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  try {
    const db = await AppDataSource.initialize();
    console.log("CONNECT DB SUCCESSFULLY");
    if (__prod__) await db.runMigrations();
  } catch (error) {
    console.log("CONNECT DB ERROR", error);
  }
  app.use(rootRouter);
  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
};
main();
