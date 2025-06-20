import axios from 'axios';
import { config } from '../config/config';
import { supabase } from '../config/supabase';

interface InstagramCreator {
    instagram_id: string;
    username: string;
    follower_count: number;
    engagement_rate: number;
    post_frequency: number;
    influence_score: number;
    bio: string;
    platform: string;
}

class InstagramService {
    async getCreatorInfo(username: string): Promise<InstagramCreator | null> {
        try {
            // Note: This is a placeholder for Instagram API integration
            // You'll need to implement the actual Instagram API calls here
            const mockData = {
                instagram_id: `mock_${username}`,
                username: username,
                follower_count: Math.floor(Math.random() * 1000000),
                post_count: Math.floor(Math.random() * 1000),
                total_likes: Math.floor(Math.random() * 10000000),
                bio: `Mock bio for ${username}`,
            };

            const creator: InstagramCreator = {
                instagram_id: mockData.instagram_id,
                username: mockData.username,
                follower_count: mockData.follower_count,
                engagement_rate: this.calculateEngagementRate(mockData.total_likes, mockData.post_count, mockData.follower_count),
                post_frequency: this.calculatePostFrequency(mockData.post_count),
                influence_score: this.calculateInfluenceScore(mockData.follower_count, mockData.total_likes / mockData.post_count),
                bio: mockData.bio,
                platform: 'instagram'
            };

            // Store in Supabase
            const { error } = await supabase
                .from('instagram_creators')
                .upsert(creator, {
                    onConflict: 'instagram_id'
                });

            if (error) {
                console.error('Error storing Instagram creator in Supabase:', error);
            }

            return creator;
        } catch (error) {
            console.error('Error fetching Instagram creator info:', error);
            return null;
        }
    }

    private calculateEngagementRate(totalLikes: number, postCount: number, followers: number): number {
        if (postCount === 0 || followers === 0) return 0;
        return Math.round((totalLikes / postCount / followers) * 10000) / 100;
    }

    private calculatePostFrequency(postCount: number): number {
        // Assuming the account has been active for a year
        const daysInYear = 365;
        return Math.round((postCount / daysInYear) * 100) / 100;
    }

    private calculateInfluenceScore(followers: number, avgLikes: number): number {
        // Normalized metrics (0-1 scale)
        const normalizedFollowers = Math.min(followers / 1000000, 1); // Cap at 1M followers
        const normalizedEngagement = Math.min(avgLikes / followers, 1); // Cap at 100% engagement

        // Weighted average (adjust weights as needed)
        const score = (normalizedFollowers * 0.6 + normalizedEngagement * 0.4) * 100;

        return Math.round(score * 100) / 100; // Round to 2 decimal places
    }
}

export const instagramService = new InstagramService(); 