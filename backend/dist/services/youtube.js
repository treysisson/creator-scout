"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
const supabase_1 = require("../config/supabase");
class YouTubeService {
    constructor() {
        this.quotaUsed = 0;
        this.MAX_RESULTS = 50;
        // Reset quota at midnight
        setInterval(() => {
            this.quotaUsed = 0;
        }, 24 * 60 * 60 * 1000);
    }
    checkQuota(cost) {
        if (this.quotaUsed + cost > config_1.config.youtube.dailyQuota) {
            throw new Error('YouTube API quota exceeded');
        }
        this.quotaUsed += cost;
        return true;
    }
    async searchChannels(query) {
        try {
            this.checkQuota(config_1.config.youtube.searchQuotaCost);
            const response = await axios_1.default.get(`${config_1.config.youtube.baseUrl}/search`, {
                params: {
                    part: 'snippet',
                    type: 'channel',
                    q: query,
                    key: config_1.config.youtube.apiKey,
                    maxResults: this.MAX_RESULTS
                }
            });
            const channels = response.data.items;
            const creators = [];
            for (const channel of channels) {
                const channelStats = await this.getChannelStats(channel.id.channelId);
                if (channelStats) {
                    const creator = {
                        channel_id: channel.id.channelId,
                        channel_name: channel.snippet.title,
                        channel_description: channel.snippet.description,
                        subscriber_count: parseInt(channelStats.subscriberCount),
                        avg_view_count: Math.round(parseInt(channelStats.viewCount) / parseInt(channelStats.videoCount)),
                        upload_frequency: this.calculateUploadFrequency(parseInt(channelStats.videoCount)),
                        influence_score: this.calculateInfluenceScore(parseInt(channelStats.subscriberCount), parseInt(channelStats.viewCount), parseInt(channelStats.videoCount)),
                        platform: 'youtube'
                    };
                    // Store in Supabase
                    const { error } = await supabase_1.supabase
                        .from('creators')
                        .upsert(creator, {
                        onConflict: 'channel_id'
                    });
                    if (error) {
                        console.error('Error storing creator in Supabase:', error);
                    }
                    creators.push(creator);
                }
            }
            return creators;
        }
        catch (error) {
            console.error('Error searching YouTube channels:', error);
            throw error;
        }
    }
    async getChannelStats(channelId) {
        try {
            this.checkQuota(config_1.config.youtube.channelQuotaCost);
            const response = await axios_1.default.get(`${config_1.config.youtube.baseUrl}/channels`, {
                params: {
                    part: 'statistics',
                    id: channelId,
                    key: config_1.config.youtube.apiKey
                }
            });
            if (response.data.items && response.data.items.length > 0) {
                return response.data.items[0].statistics;
            }
            return null;
        }
        catch (error) {
            console.error('Error fetching channel statistics:', error);
            return null;
        }
    }
    calculateUploadFrequency(videoCount) {
        // Assuming the channel has been active for a year
        const daysInYear = 365;
        return videoCount / daysInYear;
    }
    calculateInfluenceScore(subscribers, views, videos) {
        // Normalized metrics (0-1 scale)
        const normalizedSubs = Math.min(subscribers / 1000000, 1); // Cap at 1M subscribers
        const normalizedViews = Math.min((views / videos) / 100000, 1); // Cap at 100K average views
        const normalizedFrequency = Math.min(videos / 365, 1); // Cap at 1 video per day
        // Weighted average (adjust weights as needed)
        const score = (normalizedSubs * 0.4 +
            normalizedViews * 0.4 +
            normalizedFrequency * 0.2) * 100;
        return Math.round(score * 100) / 100; // Round to 2 decimal places
    }
}
exports.youtubeService = new YouTubeService();
