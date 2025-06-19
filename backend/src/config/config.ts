import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    database: {
        path: process.env.DB_PATH || './database/creatorscout.db'
    },
    instagram: {
        clientId: process.env.INSTAGRAM_CLIENT_ID,
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
        redirectUri: process.env.INSTAGRAM_REDIRECT_URI
    },
    youtube: {
        apiKey: process.env.YOUTUBE_API_KEY,
        maxResults: 50, // Maximum results per search
        quotaUnitsPerDay: 10000, // Default quota units per day
        searchQuotaCost: 100, // Cost per search operation
        videoQuotaCost: 1, // Cost per video details fetch
        channelQuotaCost: 1 // Cost per channel details fetch
    }
}; 