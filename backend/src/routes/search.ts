import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(async (req: Request, res: Response) => {
    const query = req.query.q as string;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const { data, error } = await supabase
        .from('creators')
        .select('*')
        .ilike('name', `%${query}%`);

    if (error) {
        throw error;
    }

    res.json(data);
}));

export default router; 