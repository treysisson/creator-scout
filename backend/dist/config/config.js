"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.config = {
    port: process.env.PORT || 3000,
    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_SERVICE_KEY
    },
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
