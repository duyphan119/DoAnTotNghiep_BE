import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import "reflect-metadata";
import { Server } from "socket.io";
import rootRouter from "./routes";

import getRedisClient from "./configRedis";
import { __prod__ } from "./constantList";
import { AppDataSource } from "./data-source";
import socketService from "./services/socket.service";

require("dotenv").config();
const PORT = process.env.PORT || "8080";

AppDataSource.initialize()
  .then((db) => {
    console.log("CONNECT DB SUCCESSFULLY");
    if (__prod__) db.runMigrations();
  })
  .catch((error) => console.log("CONNECT DB ERROR", error))
  .finally(() => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: true,
        credentials: true,
      },
    });
    global._io = io;
    io.on("connection", socketService.connection);

    global._redisClient = getRedisClient();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "public")));
    app.use(
      cors({
        origin: __prod__
          ? process.env.CORS_ORIGIN_PROD
          : process.env.CORS_ORIGIN_DEV,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      })
    );
    app.use(cookieParser());
    app.use(rootRouter);
    server.listen(PORT, () =>
      console.log(`Server is running on port: ${PORT}`)
    );
  });
