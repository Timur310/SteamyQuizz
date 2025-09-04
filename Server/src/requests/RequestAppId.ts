import { STEAM_API } from "../Utils";

export const RequestAppId = async () => {
    const apiKey = STEAM_API
    const url = `http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=${apiKey}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}