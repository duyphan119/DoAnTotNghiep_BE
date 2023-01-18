import "reflect-metadata";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import rootRouter from "./routes";
import http from "http";
import { Server } from "socket.io";

import { __prod__ } from "./constants";
import { AppDataSource } from "./data-source";
import socketService from "./services/socket.service";

require("dotenv").config();
let PORT = process.env.PORT || "8080";

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
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "../")));
    app.use(
      cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE"],
      })
    );
    app.use(cookieParser());
    app.use(rootRouter);
    server.listen(PORT, () =>
      console.log(`Server is running on port: ${PORT}`)
    );
  });
