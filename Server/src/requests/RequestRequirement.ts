import { getRandomAppIds, getSteamAppDetails } from "../Utils";
import type { GameDetail } from "../types";

export const RequestRequirement = async () => {
    // Try to find a requirement that is not null, retrying with new batches if needed
    let attempts = 0;
    const maxAttempts = 5;
    let details: GameDetail[] = [];
    let selectedGame: GameDetail | null = null;
    let requirement: string | null = null;

    while (attempts < maxAttempts) {
        const appIds = getRandomAppIds().map(app => app.appid);
        details = await getSteamAppDetails(appIds);
        if (details.length === 0) {
            attempts++;
            continue;
        }
        // Try each game in the batch
        for (const game of details) {
            if (game.pc_requirements) {
                selectedGame = game;
                requirement = game.pc_requirements;
                break;
            }
        }
        if (selectedGame && requirement) {
            break;
        }
        attempts++;
    }

    return {
        games: details,
        requirement: requirement || null,
        selectedGame: selectedGame ? selectedGame.id : null
    };
};