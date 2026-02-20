ALTER TABLE destinations ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;
