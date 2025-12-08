-- Add image column to chalisa_verses table
ALTER TABLE chalisa_verses 
ADD COLUMN IF NOT EXISTS verse_image TEXT;
