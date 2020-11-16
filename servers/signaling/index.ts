import { Server, Socket } from "socket.io";

import * as events from "./events";

export default class SignalingServer {
  #server: Server;

  connections: Record<string, Socket> = {};

  rooms: Record<string, string[]> = {};

  connectionToRoomMap: Record<string, string> = {};

  constructor(port?: number) {
    this.#server = new Server(port, {
      cors: {
        origin: "*",
      },
    });

    this.#server.on("connect", this.#connect);

    setInterval(() => {
      console.log("rooms", this.rooms);
    }, 10000);
    console.log("Signaling Server has started.");
  }

  #connect = (socket: Socket) => {
    console.log(`Connected ${socket.id}`);
    this.connections[socket.id] = socket;

    socket.on("join room", events.join.bind(this, socket));
    socket.on("offer", events.offer.bind(this, socket));
    socket.on("response", events.response.bind(this, socket));
    socket.on("ice-candidate", events.iceCandidate.bind(this, socket));
    socket.on("disconnect", events.disconnect.bind(this, socket));
  };

  shutDown() {
    this.#server.close();
  }
}
