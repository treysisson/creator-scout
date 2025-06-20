import express from 'express';
import cors from 'cors';
import searchRoutes from './routes/search';
import authRoutes from './routes/auth';
import influencersRoutes from './routes/influencers';
import { config } from './config/config';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/influencers', influencersRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
}); 