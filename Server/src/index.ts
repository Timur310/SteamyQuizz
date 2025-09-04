import { Server } from "socket.io";
import { createServer } from "http";
import { CreateRoom } from "./Handlers/CreateRoom";
import { JoinRoom } from "./Handlers/JoinRoom";
import { UserDisconnect } from "./Handlers/UserDisconnect";
import { StartGame } from "./Handlers/StartGame";
import { SubmitAnswer } from "./Handlers/SubmitAnswer";
import { gameStates } from "./Handlers/Constants";
import { loadAppIds } from "./Utils";

// Global cache
export const cachedAppList = await loadAppIds()

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    // basic listeners
    socket.on("create_room", (username: string) => CreateRoom({ socket, username }));
    socket.on("join_room", ({ username, roomCode }) => JoinRoom({ socket, username, roomCode, io }));
    socket.on("disconnecting", () => UserDisconnect({ socket, io }));
    socket.on("disconnect", () => console.log(`❌ Disconnected: ${socket.id}`));

    // game state listeners
    socket.on("start_game", ({ roomCode }) => StartGame({ socket, roomCode, io }));
    socket.on("submit_answer", ({ roomCode, answerIndex }) => SubmitAnswer({ socket, roomCode, answerIndex, io }));
    socket.on("request_next_question", async ({ roomCode }) => {
        await StartGame({ socket, roomCode, io });
    });
    socket.on("reset_game", ({ roomCode }) => gameStates.delete(roomCode));
});

httpServer.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});
