-- Updated Mantras table with multilingual support

-- Drop existing mantras table if exists
DROP TABLE IF EXISTS mantras CASCADE;

-- Create new mantras table with multilingual fields
CREATE TABLE mantras (
  id SERIAL PRIMARY KEY,
  title_hindi TEXT NOT NULL,
  title_english TEXT NOT NULL,
  subtitle_hindi TEXT,
  subtitle_english TEXT,
  description_hindi TEXT,
  description_english TEXT,
  verses_hindi TEXT[] NOT NULL,
  verses_english TEXT[],
  category TEXT,
  color TEXT DEFAULT 'bg-orange-500',
  icon TEXT DEFAULT '🕉️',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;

-- Policies for mantras
CREATE POLICY "Everyone can view mantras" ON mantras
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Only admins can manage mantras" ON mantras
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Insert sample data
INSERT INTO mantras (
  title_hindi, title_english,
  subtitle_hindi, subtitle_english,
  description_hindi, description_english,
  verses_hindi, verses_english,
  category, color, icon
) VALUES 
(
  'ॐ नमः शिवाय', 'Om Namah Shivaya',
  'शिव मंत्र', 'Shiva Mantra',
  'भगवान शिव का पवित्र मंत्र', 'Sacred mantra of Lord Shiva',
  ARRAY['ॐ नमः शिवाय', 'ॐ नमः शिवाय', 'ॐ नमः शिवाय'],
  ARRAY['Om Namah Shivaya', 'Om Namah Shivaya', 'Om Namah Shivaya'],
  'mantra', 'bg-blue-500', '🕉️'
),
(
  'हरे कृष्ण महामंत्र', 'Hare Krishna Mahamantra',
  'हरे कृष्ण हरे राम', 'Hare Krishna Hare Rama',
  'कृष्ण भगवान का महामंत्र', 'Great mantra of Lord Krishna',
  ARRAY['हरे कृष्ण हरे कृष्ण', 'कृष्ण कृष्ण हरे हरे', 'हरे राम हरे राम', 'राम राम हरे हरे'],
  ARRAY['Hare Krishna Hare Krishna', 'Krishna Krishna Hare Hare', 'Hare Rama Hare Rama', 'Rama Rama Hare Hare'],
  'mantra', 'bg-yellow-500', '🙏'
);