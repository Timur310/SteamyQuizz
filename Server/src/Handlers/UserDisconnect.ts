import type { DefaultEventsMap, Server, Socket } from "socket.io";
import { rooms } from "./Constants";

type DisconnectProps = {
    socket: Socket
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
}

export const UserDisconnect = ({socket, io}: DisconnectProps): void => {
    for (const roomCode of socket.rooms) {
        const room = rooms.get(roomCode);
        if (!room) continue;

        room.users = room.users.filter((u) => u.id !== socket.id);

        // If host left, assign new host
        if (room.hostId === socket.id) {
            room.hostId = room.users[0]?.id || "";
        }

        if (room.users.length === 0) {
            rooms.delete(roomCode);
            console.log(`🧹 Deleted empty room: ${roomCode}`);
        } else {
            io.to(roomCode).emit("room_users", {
                users: room.users,
                hostId: room.hostId,
            });
        }
    }
}