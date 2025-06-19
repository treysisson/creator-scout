import axios from 'axios';
import { config } from '../config/config';
import { dbAsync } from '../models/db';

interface InstagramPost {
    id: string;
    caption: string;
    media_type: string;
    media_url: string;
    permalink: string;
    timestamp: string;
    username: string;
}

interface InstagramUser {
    id: string;
    username: string;
    followers_count: number;
    media_count: number;
}

export async function searchInstagram(query: string) {
    try {
        // Note: Instagram Basic Display API doesn't support hashtag search directly
        // This is a placeholder for the actual implementation that would use
        // Instagram Graph API with appropriate permissions
        
        // For MVP, we'll simulate the search with a basic API call
        // In production, you would need to:
        // 1. Implement proper OAuth flow
        // 2. Use Instagram Graph API with appropriate permissions
        // 3. Handle rate limiting and pagination
        
        const mockResults = [
            {
                username: 'example_user',
                platform: 'instagram',
                followers: 10000,
                engagement_rate: 0.05,
                niche_relevance_score: 0.8,
                last_updated: new Date().toISOString()
            }
        ];

        return mockResults;
    } catch (error) {
        console.error('Instagram search error:', error);
        throw error;
    }
}

export async function getInstagramUserProfile(accessToken: string): Promise<InstagramUser> {
    try {
        const response = await axios.get(`https://graph.instagram.com/me?fields=id,username,followers_count,media_count&access_token=${accessToken}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Instagram profile:', error);
        throw error;
    }
}

export async function getRecentPosts(accessToken: string): Promise<InstagramPost[]> {
    try {
        const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,username&access_token=${accessToken}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        throw error;
    }
}

export async function calculateEngagementRate(posts: InstagramPost[]): Promise<number> {
    if (!posts.length) return 0;
    
    // Simple engagement rate calculation
    // (likes + comments) / followers * 100
    // This is a placeholder since the Basic Display API doesn't provide engagement metrics
    return 0.05; // 5% engagement rate placeholder
} 