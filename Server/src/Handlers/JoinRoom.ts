import type { DefaultEventsMap, Server, Socket } from "socket.io";
import { MAX_PLAYERS_PER_ROOM, rooms } from "./Constants";

type JoinProps = {
    socket: Socket
    username: string
    roomCode: string
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
}

export const JoinRoom = ({ socket, username, roomCode, io }: JoinProps): void => {
    const room = rooms.get(roomCode);
    if (!room) {
        socket.emit("error_joining", { message: "Room does not exist." });
        return;
    }

    if (room.users.length >= MAX_PLAYERS_PER_ROOM) {
        socket.emit("error_joining", { message: "Room is full" });
        return;
    }

    const user = { id: socket.id, username, points: 0 };
    room.users.push(user);
    socket.join(roomCode);

    console.log(`👤 ${username} joined room ${roomCode}`);

    io.to(roomCode).emit("room_users", {
        users: room.users,
        hostId: room.hostId,
    });

    socket.emit("joined_room", { roomCode });
}