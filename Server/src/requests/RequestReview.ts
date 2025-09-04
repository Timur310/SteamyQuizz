import type { GameDetail, QuestionResult, Review } from "../types";
import { getRandomAppIds, getRandomReview, getSteamAppDetails } from "../Utils";

export const RequestReview = async (): Promise<QuestionResult> => {
    let review: Review | null = null;
    let details: GameDetail[] = [];
    let selectedGame: GameDetail | null = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        const appIds = getRandomAppIds().map(app => app.appid);
        details = await getSteamAppDetails(appIds);
        if (details.length === 0) {
            attempts++;
            continue;
        }
        // Try each game in the batch
        for (const game of details) {
            review = await getRandomReview(game.id);
            if (review && review.code !== -1 && review.review) {
                selectedGame = game;
                break;
            }
        }
        if (selectedGame && review && review.code !== -1 && review.review) {
            break;
        }
        attempts++;
    }

    if (!selectedGame || !review || review.code === -1 || !review.review) {
        return { games: details, selected: null, review: null };
    }

    return {
        games: details,
        selected: review.appId,
        review: review
    };
};