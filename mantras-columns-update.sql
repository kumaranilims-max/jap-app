-- Add missing columns to mantras table
-- Run this script in Supabase SQL Editor

-- Add background_image column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mantras' AND column_name = 'background_image') THEN
        ALTER TABLE mantras ADD COLUMN background_image TEXT;
    END IF;
END $$;

-- Add subtitle_hindi column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mantras' AND column_name = 'subtitle_hindi') THEN
        ALTER TABLE mantras ADD COLUMN subtitle_hindi TEXT;
    END IF;
END $$;

-- Add subtitle_english column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mantras' AND column_name = 'subtitle_english') THEN
        ALTER TABLE mantras ADD COLUMN subtitle_english TEXT;
    END IF;
END $$;

-- Add verses_english column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mantras' AND column_name = 'verses_english') THEN
        ALTER TABLE mantras ADD COLUMN verses_english TEXT[];
    END IF;
END $$;

-- Add color column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mantras' AND column_name = 'color') THEN
        ALTER TABLE mantras ADD COLUMN color TEXT DEFAULT 'bg-orange-500';
    END IF;
END $$;

-- Add icon column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mantras' AND column_name = 'icon') THEN
        ALTER TABLE mantras ADD COLUMN icon TEXT DEFAULT '🕉️';
    END IF;
END $$;

-- Add category column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mantras' AND column_name = 'category') THEN
        ALTER TABLE mantras ADD COLUMN category TEXT DEFAULT 'mantra';
    END IF;
END $$;