import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    dbPath: process.env.DB_PATH || path.join(__dirname, '../../database/creatorscout.db'),
    instagram: {
        clientId: process.env.INSTAGRAM_CLIENT_ID,
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
        redirectUri: process.env.INSTAGRAM_REDIRECT_URI
    },
    youtube: {
        apiKey: process.env.YOUTUBE_API_KEY,
        baseUrl: 'https://www.googleapis.com/youtube/v3',
        searchQuotaCost: 100,
        channelQuotaCost: 1,
        videoQuotaCost: 1,
        dailyQuota: 10000
    }
}; 