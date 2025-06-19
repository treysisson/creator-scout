import axios from 'axios';
import { config } from '../config/config';
import { dbAsync } from '../models/db';

// Rate limiting setup
let quotaUsedToday = 0;
let lastQuotaReset = new Date();

// Reset quota at midnight
setInterval(() => {
    const now = new Date();
    if (now.getDate() !== lastQuotaReset.getDate()) {
        quotaUsedToday = 0;
        lastQuotaReset = now;
    }
}, 1000 * 60); // Check every minute

interface YouTubeChannel {
    id: string;
    title: string;
    description: string;
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
    publishedAt: string;
}

interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    viewCount: string;
    likeCount: string;
    commentCount: string;
    publishedAt: string;
}

async function checkQuota(cost: number): Promise<boolean> {
    if (quotaUsedToday + cost > config.youtube.quotaUnitsPerDay) {
        throw new Error('YouTube API quota exceeded for today');
    }
    quotaUsedToday += cost;
    return true;
}

export async function searchChannels(query: string) {
    try {
        await checkQuota(config.youtube.searchQuotaCost);

        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: 'channel',
                maxResults: config.youtube.maxResults,
                key: config.youtube.apiKey
            }
        });

        const channelIds = response.data.items.map((item: any) => item.id.channelId);
        const channels = await getChannelDetails(channelIds);

        // Store channels in database
        for (const channel of channels) {
            await storeChannelData(channel);
        }

        return channels;
    } catch (error) {
        console.error('YouTube search error:', error);
        throw error;
    }
}

async function getChannelDetails(channelIds: string[]): Promise<YouTubeChannel[]> {
    try {
        await checkQuota(config.youtube.channelQuotaCost * Math.ceil(channelIds.length / 50));

        const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
            params: {
                part: 'snippet,statistics,contentDetails',
                id: channelIds.join(','),
                key: config.youtube.apiKey
            }
        });

        return response.data.items.map((item: any) => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            subscriberCount: item.statistics.subscriberCount,
            videoCount: item.statistics.videoCount,
            viewCount: item.statistics.viewCount,
            publishedAt: item.snippet.publishedAt
        }));
    } catch (error) {
        console.error('Error fetching channel details:', error);
        throw error;
    }
}

async function getChannelVideos(channelId: string, maxResults = 10): Promise<YouTubeVideo[]> {
    try {
        await checkQuota(config.youtube.searchQuotaCost);

        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                channelId,
                order: 'date',
                type: 'video',
                maxResults,
                key: config.youtube.apiKey
            }
        });

        const videoIds = response.data.items.map((item: any) => item.id.videoId);
        return await getVideoDetails(videoIds);
    } catch (error) {
        console.error('Error fetching channel videos:', error);
        throw error;
    }
}

async function getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
    try {
        await checkQuota(config.youtube.videoQuotaCost * Math.ceil(videoIds.length / 50));

        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,statistics',
                id: videoIds.join(','),
                key: config.youtube.apiKey
            }
        });

        return response.data.items.map((item: any) => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            viewCount: item.statistics.viewCount,
            likeCount: item.statistics.likeCount,
            commentCount: item.statistics.commentCount,
            publishedAt: item.snippet.publishedAt
        }));
    } catch (error) {
        console.error('Error fetching video details:', error);
        throw error;
    }
}

async function storeChannelData(channel: YouTubeChannel) {
    try {
        // Calculate upload frequency and average views
        const recentVideos = await getChannelVideos(channel.id);
        const uploadFrequency = calculateUploadFrequency(recentVideos);
        const avgViewCount = calculateAverageViews(recentVideos);
        const influenceScore = calculateInfluenceScore(channel, avgViewCount, uploadFrequency);

        await dbAsync.run(`
            INSERT INTO creators (
                channel_id, channel_name, subscriber_count, total_view_count,
                video_count, avg_view_count, upload_frequency, influence_score,
                channel_description, last_updated
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(channel_id) DO UPDATE SET
                subscriber_count = excluded.subscriber_count,
                total_view_count = excluded.total_view_count,
                video_count = excluded.video_count,
                avg_view_count = excluded.avg_view_count,
                upload_frequency = excluded.upload_frequency,
                influence_score = excluded.influence_score,
                last_updated = CURRENT_TIMESTAMP
        `, [
            channel.id,
            channel.title,
            parseInt(channel.subscriberCount),
            parseInt(channel.viewCount),
            parseInt(channel.videoCount),
            avgViewCount,
            uploadFrequency,
            influenceScore,
            channel.description
        ]);

        // Store recent videos
        for (const video of recentVideos) {
            await dbAsync.run(`
                INSERT OR REPLACE INTO videos (
                    video_id, creator_id, title, description,
                    view_count, like_count, comment_count,
                    published_at
                ) VALUES (
                    ?, (SELECT id FROM creators WHERE channel_id = ?),
                    ?, ?, ?, ?, ?, ?
                )
            `, [
                video.id,
                channel.id,
                video.title,
                video.description,
                parseInt(video.viewCount),
                parseInt(video.likeCount),
                parseInt(video.commentCount),
                video.publishedAt
            ]);
        }
    } catch (error) {
        console.error('Error storing channel data:', error);
        throw error;
    }
}

function calculateUploadFrequency(videos: YouTubeVideo[]): number {
    if (videos.length < 2) return 0;
    
    const dates = videos.map(v => new Date(v.publishedAt)).sort((a, b) => b.getTime() - a.getTime());
    const daysBetween = (dates[0].getTime() - dates[dates.length - 1].getTime()) / (1000 * 60 * 60 * 24);
    return (videos.length / daysBetween) * 30; // Average uploads per month
}

function calculateAverageViews(videos: YouTubeVideo[]): number {
    if (!videos.length) return 0;
    const totalViews = videos.reduce((sum, video) => sum + parseInt(video.viewCount), 0);
    return Math.round(totalViews / videos.length);
}

function calculateInfluenceScore(
    channel: YouTubeChannel,
    avgViewCount: number,
    uploadFrequency: number
): number {
    const subscriberCount = parseInt(channel.subscriberCount);
    const viewCount = parseInt(channel.viewCount);
    
    // Normalized scores (0-1)
    const subScore = Math.min(subscriberCount / 1000000, 1); // Normalize to 1M subscribers
    const viewScore = Math.min(avgViewCount / 100000, 1); // Normalize to 100K views
    const freqScore = Math.min(uploadFrequency / 30, 1); // Normalize to daily uploads
    
    // Weighted average (adjust weights as needed)
    return (subScore * 0.4 + viewScore * 0.4 + freqScore * 0.2) * 100;
}

export async function getStoredCreators(
    sortBy: string = 'influence_score',
    order: string = 'DESC',
    limit: number = 50,
    offset: number = 0
) {
    try {
        const validSortColumns = ['subscriber_count', 'avg_view_count', 'upload_frequency', 'influence_score'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'influence_score';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        return await dbAsync.all(`
            SELECT * FROM creators
            ORDER BY ${sortColumn} ${sortOrder}
            LIMIT ? OFFSET ?
        `, [limit, offset]);
    } catch (error) {
        console.error('Error fetching stored creators:', error);
        throw error;
    }
} 