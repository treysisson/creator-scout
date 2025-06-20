"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config/config");
const dbPath = path_1.default.resolve(process.cwd(), config_1.config.dbPath);
const db = new better_sqlite3_1.default(dbPath, { verbose: console.log });
exports.db = db;
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
    }
    catch (err) {
        console.error('Error initializing database:', err);
        throw err;
    }
};
// Initialize the database
initDb();
