"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const youtube_1 = require("../services/youtube");
const instagram_1 = require("../services/instagram");
const supabase_1 = require("../config/supabase");
const router = express_1.default.Router();
// Search YouTube creators
router.get('/youtube', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }
        const creators = await youtube_1.youtubeService.searchChannels(query);
        // Store search history
        const { error } = await supabase_1.supabase
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
    }
    catch (error) {
        console.error('Error in YouTube search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Search Instagram creators
router.get('/instagram', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ error: 'Username parameter is required' });
        }
        const creator = await instagram_1.instagramService.getCreatorInfo(username);
        if (!creator) {
            return res.status(404).json({ error: 'Creator not found' });
        }
        // Store search history
        const { error } = await supabase_1.supabase
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
    }
    catch (error) {
        console.error('Error in Instagram search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get search history
router.get('/history', async (req, res) => {
    try {
        const { data: searchHistory, error } = await supabase_1.supabase
            .from('search_history')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
        if (error) {
            throw error;
        }
        res.json(searchHistory || []);
    }
    catch (error) {
        console.error('Error fetching search history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
