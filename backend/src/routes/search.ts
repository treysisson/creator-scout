import express from 'express';
import { youtubeService } from '../services/youtube';
import { instagramService } from '../services/instagram';
import { supabase } from '../config/supabase';

const router = express.Router();

// Search YouTube creators
router.get('/youtube', async (req, res) => {
    try {
        const query = req.query.q as string;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const creators = await youtubeService.searchChannels(query);

        // Store search history
        const { error } = await supabase
            .from('search_history')
            .insert({
                query,
                platform: 'youtube',
                results_count: creators.length
            });

        if (error) {
            console.error('Error storing search history:', error);
        }

        res.json(creators);
    } catch (error) {
        console.error('Error in YouTube search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search Instagram creators
router.get('/instagram', async (req, res) => {
    try {
        const username = req.query.username as string;
        if (!username) {
            return res.status(400).json({ error: 'Username parameter is required' });
        }

        const creator = await instagramService.getCreatorInfo(username);
        if (!creator) {
            return res.status(404).json({ error: 'Creator not found' });
        }

        // Store search history
        const { error } = await supabase
            .from('search_history')
            .insert({
                query: username,
                platform: 'instagram',
                results_count: 1
            });

        if (error) {
            console.error('Error storing search history:', error);
        }

        res.json(creator);
    } catch (error) {
        console.error('Error in Instagram search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get search history
router.get('/history', async (req, res) => {
    try {
        const { data: searchHistory, error } = await supabase
            .from('search_history')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            throw error;
        }

        res.json(searchHistory || []);
    } catch (error) {
        console.error('Error fetching search history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 