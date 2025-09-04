export type User = { id: string; username: string, points: number };

export type Room = { hostId: string; users: User[] };

// Types for clarity
export type GameDetail = {
    id: number;
    name: string;
    thumbnail: string;
    pc_requirements?: string;
};

export type Review = {
    code: number;
    appId: number;
    review: string;
};

export type QuestionResult = {
    games: GameDetail[];
    selected: number | null;
    review: Review | null;
};

export type GameState = {
    phase: "question" | "results";
    question: string;
    options: any[];
    gameType: number | null;
    correctIndex: number;
    answers: Record<string, number>; // socket.id -> option index
    // Add a scores property to track points for each player
    scores: Record<string, number>;
};