import type { Socket } from "socket.io";

export function iceCandidate(socket: Socket, incoming) {
  incoming.from = socket.id;
  socket.to(incoming.target).emit("ice-candidate", incoming);
}
