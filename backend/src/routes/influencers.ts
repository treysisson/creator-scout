import express from 'express';
import { dbAsync } from '../models/db';

const router = express.Router();

// Get all influencers
router.get('/', async (req, res) => {
    try {
        const influencers = await dbAsync.all('SELECT * FROM influencers ORDER BY followers DESC');
        res.json(influencers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch influencers' });
    }
});

// Get influencer by ID
router.get('/:id', async (req, res) => {
    try {
        const influencer = await dbAsync.get('SELECT * FROM influencers WHERE id = ?', [req.params.id]);
        if (!influencer) {
            return res.status(404).json({ error: 'Influencer not found' });
        }
        res.json(influencer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch influencer' });
    }
});

// Create new influencer
router.post('/', async (req, res) => {
    const { username, platform, followers, engagement_rate } = req.body;
    try {
        const result = await dbAsync.run(
            'INSERT INTO influencers (username, platform, followers, engagement_rate) VALUES (?, ?, ?, ?)',
            [username, platform, followers, engagement_rate]
        );
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create influencer' });
    }
});

// Update influencer
router.put('/:id', async (req, res) => {
    const { followers, engagement_rate, niche_relevance_score } = req.body;
    try {
        await dbAsync.run(
            'UPDATE influencers SET followers = ?, engagement_rate = ?, niche_relevance_score = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?',
            [followers, engagement_rate, niche_relevance_score, req.params.id]
        );
        res.json({ message: 'Influencer updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update influencer' });
    }
});

export default router; 