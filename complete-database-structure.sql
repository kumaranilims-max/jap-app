-- =====================================================
-- COMPLETE DATABASE STRUCTURE FOR SPIRITUAL JAP APP
-- =====================================================

-- 1. PROFILES TABLE (User Management)
-- =====================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  user_type TEXT DEFAULT 'user' CHECK (user_type IN ('user', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. MANTRAS TABLE (Multilingual Mantras)
-- =======================================
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
  category TEXT DEFAULT 'mantra',
  color TEXT DEFAULT 'bg-orange-500',
  icon TEXT DEFAULT '🕉️',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. USER JAP PROGRESS TABLE (User Chanting Progress)
-- ===================================================
CREATE TABLE user_jap_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mantra_id INTEGER REFERENCES mantras(id) ON DELETE CASCADE,
  total_count INTEGER DEFAULT 0,
  daily_count INTEGER DEFAULT 0,
  last_chanted TIMESTAMP DEFAULT NOW(),
  streak_days INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mantra_id)
);

-- 4. DAILY JAP LOGS TABLE (Daily Tracking)
-- =========================================
CREATE TABLE daily_jap_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mantra_id INTEGER REFERENCES mantras(id) ON DELETE CASCADE,
  jap_count INTEGER DEFAULT 0,
  jap_date DATE DEFAULT CURRENT_DATE,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mantra_id, jap_date)
);

-- 5. CATEGORIES TABLE (Mantra Categories)
-- =======================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name_hindi TEXT NOT NULL,
  name_english TEXT NOT NULL,
  description_hindi TEXT,
  description_english TEXT,
  icon TEXT DEFAULT '🕉️',
  color TEXT DEFAULT 'bg-orange-500',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. USER FAVORITES TABLE (Favorite Mantras)
-- ===========================================
CREATE TABLE user_favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mantra_id INTEGER REFERENCES mantras(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mantra_id)
);

-- 7. NOTIFICATIONS TABLE (User Notifications)
-- ============================================
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_jap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_jap_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- MANTRAS POLICIES
CREATE POLICY "Everyone can view active mantras" ON mantras
  FOR SELECT TO authenticated, anon USING (is_active = true);

CREATE POLICY "Admins can manage mantras" ON mantras
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- USER JAP PROGRESS POLICIES
CREATE POLICY "Users can manage own progress" ON user_jap_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" ON user_jap_progress
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- DAILY JAP LOGS POLICIES
CREATE POLICY "Users can manage own logs" ON daily_jap_logs
  FOR ALL USING (auth.uid() = user_id);

-- CATEGORIES POLICIES
CREATE POLICY "Everyone can view active categories" ON categories
  FOR SELECT TO authenticated, anon USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- USER FAVORITES POLICIES
CREATE POLICY "Users can manage own favorites" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mantras_updated_at BEFORE UPDATE ON mantras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_jap_progress_updated_at BEFORE UPDATE ON user_jap_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert Categories
INSERT INTO categories (name_hindi, name_english, description_hindi, description_english, icon, color) VALUES
('मंत्र', 'Mantras', 'पवित्र मंत्र और जप', 'Sacred mantras and chanting', '🕉️', 'bg-orange-500'),
('चालीसा', 'Chalisa', 'देवी देवताओं की चालीसा', 'Devotional forty-verse prayers', '🙏', 'bg-red-500'),
('स्तुति', 'Stuti', 'भगवान की स्तुति और आरती', 'Praise and worship songs', '🌺', 'bg-pink-500'),
('श्लोक', 'Shlokas', 'संस्कृत श्लोक और मंत्र', 'Sanskrit verses and mantras', '📿', 'bg-purple-500');

-- Insert Sample Mantras
INSERT INTO mantras (
  title_hindi, title_english,
  subtitle_hindi, subtitle_english,
  description_hindi, description_english,
  verses_hindi, verses_english,
  category, color, icon
) VALUES 
(
  'ॐ नमः शिवाय', 'Om Namah Shivaya',
  'पंचाक्षर मंत्र', 'Panchakshar Mantra',
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
),
(
  'गायत्री मंत्र', 'Gayatri Mantra',
  'ॐ भूर्भुवः स्वः', 'Om Bhur Bhuvaḥ Swaḥ',
  'सबसे पवित्र वैदिक मंत्र', 'Most sacred Vedic mantra',
  ARRAY['ॐ भूर्भुवः स्वः', 'तत्सवितुर्वरेण्यम्', 'भर्गो देवस्य धीमहि', 'धियो यो नः प्रचोदयात्'],
  ARRAY['Om Bhur Bhuvaḥ Swaḥ', 'Tat Savitur Vareṇyam', 'Bhargo Devasya Dhīmahi', 'Dhiyo Yo Naḥ Prachodayāt'],
  'mantra', 'bg-green-500', '☀️'
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_mantras_category ON mantras(category);
CREATE INDEX idx_mantras_active ON mantras(is_active);
CREATE INDEX idx_user_jap_progress_user_id ON user_jap_progress(user_id);
CREATE INDEX idx_user_jap_progress_mantra_id ON user_jap_progress(mantra_id);
CREATE INDEX idx_daily_jap_logs_user_date ON daily_jap_logs(user_id, jap_date);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- User Statistics View
CREATE VIEW user_stats AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  COUNT(ujp.id) as mantras_practiced,
  SUM(ujp.total_count) as total_japs,
  MAX(ujp.best_streak) as best_streak,
  COUNT(uf.id) as favorite_mantras
FROM profiles p
LEFT JOIN user_jap_progress ujp ON p.id = ujp.user_id
LEFT JOIN user_favorites uf ON p.id = uf.user_id
GROUP BY p.id, p.email, p.full_name;

-- Popular Mantras View
CREATE VIEW popular_mantras AS
SELECT 
  m.id,
  m.title_hindi,
  m.title_english,
  COUNT(ujp.user_id) as total_users,
  SUM(ujp.total_count) as total_japs,
  COUNT(uf.user_id) as favorites_count
FROM mantras m
LEFT JOIN user_jap_progress ujp ON m.id = ujp.mantra_id
LEFT JOIN user_favorites uf ON m.id = uf.mantra_id
WHERE m.is_active = true
GROUP BY m.id, m.title_hindi, m.title_english
ORDER BY total_japs DESC;