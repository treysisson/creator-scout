import Database from 'better-sqlite3';
import path from 'path';
import { config } from '../config/config';

const dbPath = path.resolve(process.cwd(), config.dbPath);
const db = new Database(dbPath, { verbose: console.log });

// Initialize database with schema if needed
const initDb = () => {
    try {
        // Enable foreign keys
        db.pragma('foreign_keys = ON');
        
        // Create tables if they don't exist
        const schema = `
            CREATE TABLE IF NOT EXISTS creators (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                channel_id TEXT UNIQUE NOT NULL,
                channel_name TEXT NOT NULL,
                subscriber_count INTEGER,
                avg_view_count INTEGER,
                upload_frequency REAL,
                influence_score REAL,
                channel_description TEXT,
                last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS videos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                video_id TEXT UNIQUE NOT NULL,
                creator_id INTEGER,
                title TEXT NOT NULL,
                view_count INTEGER,
                like_count INTEGER,
                comment_count INTEGER,
                published_at DATETIME,
                FOREIGN KEY (creator_id) REFERENCES creators(id)
            );

            CREATE TABLE IF NOT EXISTS search_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS creator_tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                creator_id INTEGER,
                tag TEXT NOT NULL,
                FOREIGN KEY (creator_id) REFERENCES creators(id)
            );
        `;
        
        db.exec(schema);
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
        throw err;
    }
};

// Initialize the database
initDb();

export { db }; 