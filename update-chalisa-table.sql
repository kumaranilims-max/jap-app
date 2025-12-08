-- Add English verse column to chalisa_verses table
ALTER TABLE chalisa_verses 
ADD COLUMN IF NOT EXISTS verse_text_english TEXT;

-- Rename existing columns for clarity
ALTER TABLE chalisa_verses 
RENAME COLUMN verse_text TO verse_text_hindi;

-- Update existing data (optional - set English to empty string if null)
UPDATE chalisa_verses 
SET verse_text_english = '' 
WHERE verse_text_english IS NULL;
