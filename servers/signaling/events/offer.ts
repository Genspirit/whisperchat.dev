import type { Socket } from "socket.io";

export function offer(socket: Socket, payload) {
  payload.from = socket.id;
  socket.to(payload.target).emit("offer", payload);
}
