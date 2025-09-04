import type { GameState, Room } from "../types";

export const MAX_PLAYERS_PER_ROOM = 2;
export const POINTS_PER_CORRECT_ANSWER = 1000;
export const POINTS_PER_WRONG_ANSWER = 100;

export const rooms = new Map<string, Room>();
export const gameStates = new Map<string, GameState>();