import type { DefaultEventsMap, Server, Socket } from "socket.io";
import type { GameState } from "../types";
import { gameStates, rooms } from "./Constants";
import { RequestReview } from "../requests/RequestReview";
import { RequestRequirement } from "../requests/RequestRequirement";

interface StartGameProps {
    socket: Socket;
    roomCode: string;
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}

// Register all game types in an array for extensibility
const gameTypeHandlers = [
    async () => {
        const round = await RequestReview();
        const { review, games, selected } = round;
        return {
            question: review?.review || "",
            options: games || [],
            correctIndex: selected ?? -1,
        };
    },
    async () => {
        const round = await RequestRequirement();
        const { games, requirement, selectedGame } = round;
        return {
            question: requirement || "",
            options: games || [],
            correctIndex: selectedGame ?? -1,
        };
    },
    // Add more game type handlers here as needed
];

export const StartGame = async ({ socket, roomCode, io }: StartGameProps): Promise<void> => {
    const room = rooms.get(roomCode);
    if (!room) return;
    if (room.hostId !== socket.id) return;

    // Pick a random game type handler
    io.to(roomCode).emit("loading", true);
    const gameType = Math.floor(Math.random() * gameTypeHandlers.length);
    const { question, options, correctIndex } = await gameTypeHandlers[gameType]();

    // Initialize scores if not present
    let scores: Record<string, number> = {};
    if (gameStates.has(roomCode) && gameStates.get(roomCode)?.scores) {
        scores = { ...gameStates.get(roomCode)!.scores };
    } else {
        // Initialize all users to 0 points
        room.users.forEach(u => { scores[u.id] = 0; });
    }

    const gameState: GameState = {
        phase: "question",
        question,
        options,
        gameType: gameType,
        correctIndex,
        answers: {},
        scores,
    };

    gameStates.set(roomCode, gameState);

    io.to(roomCode).emit("loading", false);

    io.to(roomCode).emit("game_started", {
        gameType: gameType,
        phase: gameState.phase,
        question,
        options,
    });

    console.log(`🎮 Game started in ${roomCode}`);
};