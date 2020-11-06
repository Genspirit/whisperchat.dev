import type { Socket } from "socket.io";

export function response(socket: Socket, payload) {
  payload.from = socket.id;
  socket.to(payload.target).emit("response", payload);
}
