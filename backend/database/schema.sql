-- Creators table
CREATE TABLE IF NOT EXISTS creators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_id TEXT NOT NULL UNIQUE,
    channel_name TEXT NOT NULL,
    subscriber_count INTEGER DEFAULT 0,
    total_view_count INTEGER DEFAULT 0,
    video_count INTEGER DEFAULT 0,
    avg_view_count INTEGER DEFAULT 0,
    upload_frequency REAL DEFAULT 0, -- Average uploads per month
    influence_score REAL DEFAULT 0,
    niche_keywords TEXT,
    channel_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Videos table for tracking recent content performance
CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id TEXT NOT NULL UNIQUE,
    creator_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES creators(id)
);

-- Search history table
CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creator tags for categorization
CREATE TABLE IF NOT EXISTS creator_tags (
    creator_id INTEGER,
    tag TEXT NOT NULL,
    PRIMARY KEY (creator_id, tag),
    FOREIGN KEY (creator_id) REFERENCES creators(id)
); 