import express from 'express';
import { dbAsync } from '../models/db';
import { searchChannels, getStoredCreators } from '../services/youtube';

const router = express.Router();

// Search YouTube channels
router.get('/channels', async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        // Log search query
        await dbAsync.run(
            'INSERT INTO search_history (query) VALUES (?)',
            [query]
        );

        const results = await searchChannels(query as string);

        // Update search history with results count
        await dbAsync.run(
            'UPDATE search_history SET results_count = ? WHERE query = ? ORDER BY searched_at DESC LIMIT 1',
            [results.length, query]
        );

        res.json(results);
    } catch (error: any) {
        console.error('Search error:', error);
        if (error.message.includes('quota exceeded')) {
            res.status(429).json({ error: 'YouTube API quota exceeded for today' });
        } else {
            res.status(500).json({ error: 'Failed to perform search' });
        }
    }
});

// Get stored creators with filtering and sorting
router.get('/creators', async (req, res) => {
    const { 
        sortBy = 'influence_score',
        order = 'DESC',
        limit = '50',
        offset = '0',
        minSubscribers,
        minViews,
        minFrequency
    } = req.query;

    try {
        let query = 'SELECT * FROM creators WHERE 1=1';
        const params: any[] = [];

        if (minSubscribers) {
            query += ' AND subscriber_count >= ?';
            params.push(minSubscribers);
        }

        if (minViews) {
            query += ' AND avg_view_count >= ?';
            params.push(minViews);
        }

        if (minFrequency) {
            query += ' AND upload_frequency >= ?';
            params.push(minFrequency);
        }

        const validSortColumns = ['subscriber_count', 'avg_view_count', 'upload_frequency', 'influence_score'];
        const sortColumn = validSortColumns.includes(sortBy as string) ? sortBy : 'influence_score';
        const sortOrder = (order as string).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
        params.push(parseInt(limit as string), parseInt(offset as string));

        const creators = await dbAsync.all(query, params);
        res.json(creators);
    } catch (error) {
        console.error('Error fetching creators:', error);
        res.status(500).json({ error: 'Failed to fetch creators' });
    }
});

// Get search history
router.get('/history', async (req, res) => {
    try {
        const history = await dbAsync.all(
            'SELECT * FROM search_history ORDER BY searched_at DESC LIMIT 10'
        );
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch search history' });
    }
});

// Export creators to CSV
router.get('/export', async (req, res) => {
    try {
        const creators = await dbAsync.all('SELECT * FROM creators');
        
        // Convert to CSV format
        const fields = [
            'channel_name',
            'subscriber_count',
            'avg_view_count',
            'upload_frequency',
            'influence_score',
            'channel_description',
            'last_updated'
        ];

        const csv = [
            fields.join(','), // Header
            ...creators.map(creator => 
                fields.map(field => 
                    // Escape commas and quotes in text fields
                    typeof creator[field] === 'string' 
                        ? `"${creator[field].replace(/"/g, '""')}"` 
                        : creator[field]
                ).join(',')
            )
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=creators.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting creators:', error);
        res.status(500).json({ error: 'Failed to export creators' });
    }
});

export default router; 