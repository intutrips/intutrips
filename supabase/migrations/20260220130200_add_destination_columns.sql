-- Add missing columns to destinations table to match the admin form
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS price_from TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS group_size TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'few_spots', 'sold_out'));
