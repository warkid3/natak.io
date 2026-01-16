-- Output Library Migration
-- Adds collections (folders) and favorites for organizing generated outputs

-- Collections (Folders)
CREATE TABLE collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collection Items (Many-to-Many: Jobs can be in multiple collections)
CREATE TABLE collection_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES collections ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, job_id)
);

-- Favorites
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Indexes for performance
CREATE INDEX idx_collections_user ON collections(user_id);
CREATE INDEX idx_collection_items_collection ON collection_items(collection_id);
CREATE INDEX idx_collection_items_job ON collection_items(job_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_job ON favorites(job_id);

-- Comments for documentation
COMMENT ON TABLE collections IS 'User-created folders/collections for organizing outputs';
COMMENT ON TABLE collection_items IS 'Many-to-many relationship between collections and jobs';
COMMENT ON TABLE favorites IS 'User favorites for quick access to outputs';
