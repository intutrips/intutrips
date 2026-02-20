-- Add topics and checkout_url to guides table
ALTER TABLE guides ADD COLUMN IF NOT EXISTS topics JSONB DEFAULT '[]'::jsonb;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS checkout_url TEXT;
