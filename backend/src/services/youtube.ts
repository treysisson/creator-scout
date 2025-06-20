import axios from 'axios';
import { config } from '../config/config';
import { supabase } from '../config/supabase';

interface YouTubeSearchResponse {
    items: Array<{
        id: { channelId: string };
        snippet: {
            title: string;
            description: string;
            thumbnails: { default: { url: string } };
        };
    }>;
}

interface YouTubeChannelResponse {
    items: Array<{
        statistics: {
            subscriberCount: string;
            videoCount: string;
            viewCount: string;
        };
    }>;
}

interface Creator {
    channel_id: string;
    channel_name: string;
    subscriber_count: number;
    avg_view_count: number;
    upload_frequency: number;
    influence_score: number;
    channel_description: string;
    platform: string;
}

class YouTubeService {
    private quotaUsed: number = 0;
    private readonly MAX_RESULTS = 50;

    constructor() {
        // Reset quota at midnight
        setInterval(() => {
            this.quotaUsed = 0;
        }, 24 * 60 * 60 * 1000);
    }

    private checkQuota(cost: number): boolean {
        if (this.quotaUsed + cost > config.youtube.dailyQuota) {
            throw new Error('YouTube API quota exceeded');
        }
        this.quotaUsed += cost;
        return true;
    }

    async searchChannels(query: string): Promise<Creator[]> {
        try {
            this.checkQuota(config.youtube.searchQuotaCost);

            const response = await axios.get<YouTubeSearchResponse>(`${config.youtube.baseUrl}/search`, {
                params: {
                    part: 'snippet',
                    type: 'channel',
                    q: query,
                    key: config.youtube.apiKey,
                    maxResults: this.MAX_RESULTS
                }
            });

            const channels = response.data.items;
            const creators: Creator[] = [];

            for (const channel of channels) {
                const channelStats = await this.getChannelStats(channel.id.channelId);
                if (channelStats) {
                    const creator: Creator = {
                        channel_id: channel.id.channelId,
                        channel_name: channel.snippet.title,
                        channel_description: channel.snippet.description,
                        subscriber_count: parseInt(channelStats.subscriberCount),
                        avg_view_count: Math.round(parseInt(channelStats.viewCount) / parseInt(channelStats.videoCount)),
                        upload_frequency: this.calculateUploadFrequency(parseInt(channelStats.videoCount)),
                        influence_score: this.calculateInfluenceScore(
                            parseInt(channelStats.subscriberCount),
                            parseInt(channelStats.viewCount),
                            parseInt(channelStats.videoCount)
                        ),
                        platform: 'youtube'
                    };

                    // Store in Supabase
                    const { error } = await supabase
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
        } catch (error) {
            console.error('Error searching YouTube channels:', error);
            throw error;
        }
    }

    private async getChannelStats(channelId: string): Promise<{ subscriberCount: string; videoCount: string; viewCount: string; } | null> {
        try {
            this.checkQuota(config.youtube.channelQuotaCost);

            const response = await axios.get<YouTubeChannelResponse>(`${config.youtube.baseUrl}/channels`, {
                params: {
                    part: 'statistics',
                    id: channelId,
                    key: config.youtube.apiKey
                }
            });

            if (response.data.items && response.data.items.length > 0) {
                return response.data.items[0].statistics;
            }

            return null;
        } catch (error) {
            console.error('Error fetching channel statistics:', error);
            return null;
        }
    }

    private calculateUploadFrequency(videoCount: number): number {
        // Assuming the channel has been active for a year
        const daysInYear = 365;
        return videoCount / daysInYear;
    }

    private calculateInfluenceScore(subscribers: number, views: number, videos: number): number {
        // Normalized metrics (0-1 scale)
        const normalizedSubs = Math.min(subscribers / 1000000, 1); // Cap at 1M subscribers
        const normalizedViews = Math.min((views / videos) / 100000, 1); // Cap at 100K average views
        const normalizedFrequency = Math.min(videos / 365, 1); // Cap at 1 video per day

        // Weighted average (adjust weights as needed)
        const score = (
            normalizedSubs * 0.4 +
            normalizedViews * 0.4 +
            normalizedFrequency * 0.2
        ) * 100;

        return Math.round(score * 100) / 100; // Round to 2 decimal places
    }
}

export const youtubeService = new YouTubeService(); 