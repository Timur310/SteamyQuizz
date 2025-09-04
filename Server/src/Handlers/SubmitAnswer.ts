import type { DefaultEventsMap, Server, Socket } from "socket.io";
import { gameStates, POINTS_PER_CORRECT_ANSWER, POINTS_PER_WRONG_ANSWER, rooms } from "./Constants";

type SubmitAnswerProps = {
    socket: Socket
    roomCode: string
    answerIndex: number
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
}

export const SubmitAnswer = ({socket, roomCode, answerIndex, io}: SubmitAnswerProps): void => {
    const game = gameStates.get(roomCode);
    if (!game || game.phase !== "question") return;

    game.answers[socket.id] = answerIndex;

    // Inform all players of the current answers (who voted for what, but not the correct answer yet)
    io.to(roomCode).emit("player_answered", {
        answers: game.answers,
    });

    const totalPlayers = rooms.get(roomCode)?.users.length ?? 0;
    const totalAnswers = Object.keys(game.answers).length;

    if (totalAnswers >= totalPlayers) {
        game.phase = "results";

        // Award points for correct answers, remove for wrong answers
        Object.entries(game.answers).forEach(([socketId, answerIdx]) => {
            if (!game.scores[socketId]) game.scores[socketId] = 0;
            if (answerIdx === game.correctIndex) {
                game.scores[socketId] += POINTS_PER_CORRECT_ANSWER;
            } else {
                game.scores[socketId] -= POINTS_PER_WRONG_ANSWER;
            }
        });

        io.to(roomCode).emit("game_results", {
            phase: game.phase,
            correctIndex: game.correctIndex,
            scores: game.scores,
        });

        console.log(`📊 Game over in ${roomCode}. Results sent.`);
    }
}