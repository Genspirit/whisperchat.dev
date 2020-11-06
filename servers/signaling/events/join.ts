export function join(socket, roomId) {
  let room = this.rooms[roomId];

  const roomExists = room !== undefined;

  if (!roomExists) {
    this.rooms[roomId] = [socket.id];
    return;
  }

  const roomisFull = roomExists && room.length > 1;

  if (roomisFull) {
    socket.emit("room full");
    return;
  }

  const otherUser = room.length === 1 && room[0];

  room.push(socket.id);

  if (otherUser) {
    socket.emit("other user", otherUser);
    socket.to(otherUser).emit("user joined", socket.id);
  }
}
