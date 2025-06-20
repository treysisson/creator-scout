-- Create creators table
CREATE TABLE creators (
    id BIGSERIAL PRIMARY KEY,
    channel_id VARCHAR(255) UNIQUE,
    channel_name VARCHAR(255),
    subscriber_count INTEGER,
    avg_view_count INTEGER,
    upload_frequency FLOAT,
    influence_score FLOAT,
    channel_description TEXT,
    platform VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create instagram_creators table
CREATE TABLE instagram_creators (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    follower_count INTEGER,
    following_count INTEGER,
    post_count INTEGER,
    engagement_rate FLOAT,
    bio TEXT,
    profile_pic_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create search_history table
CREATE TABLE search_history (
    id BIGSERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    platform VARCHAR(50),
    results_count INTEGER DEFAULT 0,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS and create policies
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON creators FOR SELECT USING (true);
CREATE POLICY "Service role insert" ON creators FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role update" ON creators FOR UPDATE USING (true);

ALTER TABLE instagram_creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON instagram_creators FOR SELECT USING (true);
CREATE POLICY "Service role insert" ON instagram_creators FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role update" ON instagram_creators FOR UPDATE USING (true);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role select" ON search_history FOR SELECT USING (true);
CREATE POLICY "Service role insert" ON search_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role update" ON search_history FOR UPDATE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_creators_updated_at
    BEFORE UPDATE ON creators
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instagram_creators_updated_at
    BEFORE UPDATE ON instagram_creators
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 