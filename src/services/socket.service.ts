import { Socket } from "socket.io";

class SocketService {
  connection(socket: Socket<any>) {
    // console.log(`${socket.id} connect`);
    socket.join("APP");
    // on events
    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnect`);
    });

    socket.on("join room", (name: string) => {
      console.log(`${socket.id} joined room ${name}`);
      socket.join(name);
    });

    socket.on("Add to cart", (data: string) => {
      socket
        .to("APP")
        .emit("Has notify", `Client add to cart with data: ${data}`);
    });
  }
}

const socketService = new SocketService();

export default socketService;
