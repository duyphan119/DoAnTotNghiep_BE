import { Server } from "socket.io";

declare global {
  var _io: any;
  var _redisClient: any;
}
