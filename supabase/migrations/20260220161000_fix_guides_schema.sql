-- Update guides table to match the e-books/guides model in the code
ALTER TABLE guides RENAME COLUMN name TO title;
ALTER TABLE guides RENAME COLUMN bio TO description;
ALTER TABLE guides ALTER COLUMN title SET NOT NULL;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS destination TEXT;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS pages TEXT;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS bestseller BOOLEAN DEFAULT false;
