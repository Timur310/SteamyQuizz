import type { Socket } from "socket.io";
import { generateRoomCode } from "../Utils";
import { rooms } from "./Constants";

type CreateProps = {
    socket: Socket,
    username: string,
}

export const CreateRoom = ({socket, username}: CreateProps): void => {
    let roomCode = generateRoomCode();
    while (rooms.has(roomCode)) roomCode = generateRoomCode();

    const user = { id: socket.id, username };
    rooms.set(roomCode, {
        hostId: socket.id,
        users: [user],
        
    });

    socket.join(roomCode);
    console.log(`🏠 ${username} created room ${roomCode}`);

    socket.emit("room_created", {
        roomCode,
        users: [user],
        hostId: socket.id,
    });
}