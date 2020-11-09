import type { Socket } from "socket.io";

export function disconnect(socket: Socket) {
  console.log(`disconnecting ${socket.id}`);

  this.connections[socket.id] = undefined;

  const room = this.connectionToRoomMap[socket.id];

  if (room) {
    this.connectionToRoomMap[socket.id] = undefined;

    const roomParticipants = this.rooms[room];

    this.rooms[room] = roomParticipants.filter((user) => user !== socket.id);
  }
}
