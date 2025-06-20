"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramService = void 0;
const supabase_1 = require("../config/supabase");
class InstagramService {
    async getCreatorInfo(username) {
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
            const creator = {
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
            const { error } = await supabase_1.supabase
                .from('instagram_creators')
                .upsert(creator, {
                onConflict: 'instagram_id'
            });
            if (error) {
                console.error('Error storing Instagram creator in Supabase:', error);
            }
            return creator;
        }
        catch (error) {
            console.error('Error fetching Instagram creator info:', error);
            return null;
        }
    }
    calculateEngagementRate(totalLikes, postCount, followers) {
        if (postCount === 0 || followers === 0)
            return 0;
        return Math.round((totalLikes / postCount / followers) * 10000) / 100;
    }
    calculatePostFrequency(postCount) {
        // Assuming the account has been active for a year
        const daysInYear = 365;
        return Math.round((postCount / daysInYear) * 100) / 100;
    }
    calculateInfluenceScore(followers, avgLikes) {
        // Normalized metrics (0-1 scale)
        const normalizedFollowers = Math.min(followers / 1000000, 1); // Cap at 1M followers
        const normalizedEngagement = Math.min(avgLikes / followers, 1); // Cap at 100% engagement
        // Weighted average (adjust weights as needed)
        const score = (normalizedFollowers * 0.6 + normalizedEngagement * 0.4) * 100;
        return Math.round(score * 100) / 100; // Round to 2 decimal places
    }
}
exports.instagramService = new InstagramService();
