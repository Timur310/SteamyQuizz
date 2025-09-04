import { readFile } from 'node:fs/promises';
import { cachedAppList } from '.';

// TODO: SECRET, create env file for server port api keys and more
const STEAM_REVIEWS_API = 'https://store.steampowered.com/appreviews'

export const generateRoomCode = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export const getRandomAppIds = () => {
    const apps = [...cachedAppList]; // shallow copy to avoid mutating cache

    // Fisher-Yates shuffle (partial shuffle also possible if only 3 needed)
    for (let i = apps.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [apps[i], apps[j]] = [apps[j], apps[i]];
    }

    const randomApps = apps.slice(0, 3);
    return randomApps;
}

export const loadAppIds = async () => {
    const data = JSON.parse(await readFile(__dirname + '/Files/AppIds.json', 'utf8'));
    return data.applist.apps;
};

const randomInteger = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchReviewsPage(appId: number, cursor: string, pageSize: number) {
    const url = `${STEAM_REVIEWS_API}/${appId}?json=1&filter=all&language=all&purchase_type=all&filter_offtopic_activity=0&day_range=9223372036854775807&num_per_page=${pageSize}&cursor=${encodeURIComponent(cursor)}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.warn(`Failed to fetch reviews page: ${err.message}`);
        return null;
    }
}

export const getSteamAppDetails = async (appIds: number[]) => {
    const STEAM_API_URL = 'https://store.steampowered.com/api/appdetails';

    const requests = appIds.map(async (appid) => {
        try {
            const response = await fetch(`${STEAM_API_URL}?appids=${appid}`);
            const json = await response.json();
            const appData = json[appid];

            if (appData.success && appData.data) {
                return {
                    id: appid,
                    name: appData.data.name,
                    thumbnail: appData.data.header_image, // mid-size image
                    pc_requirements: appData.data.pc_requirements ? appData.data.pc_requirements.recommended ? appData.data.pc_requirements.recommended : appData.data.pc_requirements.minimum : null
                };
            } else {
                return null; // skip if not found or unsuccessful
            }
        } catch (err) {
            console.error(`Error fetching app ${appid}:`, err);
            return null;
        }
    });

    const allResults = await Promise.all(requests);

    // Filter out failed/null results
    const validResults = allResults.filter(Boolean) as {
        id: number;
        name: string;
        thumbnail: string;
        pc_requirements: string;
    }[];

    return validResults;
};

export const getRandomReview = async (appId: number) => {
    const pageSize = randomInteger(5,50);
    const maxPagesToSample = randomInteger(1,15);
    const maxRetries = 10;

    let attempt = 0;

    while (attempt < maxRetries) {
        attempt++;
        let cursor = '*';
        let collectedReviews = [];

        // Sample up to maxPagesToSample pages
        for (let i = 0; i < maxPagesToSample; i++) {
            const data = await fetchReviewsPage(appId, cursor, pageSize);
            if (!data || !data.reviews || data.reviews.length === 0) break;

            collectedReviews.push(...data.reviews);

            if (data.cursor) {
                cursor = data.cursor;
            } else {
                break;
            }
        }

        if (collectedReviews.length === 0) {
            // No reviews found, try again
            continue;
        }

        // Pick a random review from the collected batch
        const randomReview = collectedReviews[Math.floor(Math.random() * collectedReviews.length)];

        // Validate the review content
        if (randomReview && randomReview.review && randomReview.review.trim()) {
            return {
                appId,
                review: randomReview.review,
                code: 1
            };
        }
    }

    // Fallback if no valid review found after retries
    return {
        appId,
        review: 'No valid reviews found for this game after multiple attempts.',
        code: -1
    };
};