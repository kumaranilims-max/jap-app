-- Complete Database Setup for Spiritual App

-- 1. Profiles table (User/Admin management)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  user_type TEXT DEFAULT 'user' CHECK (user_type IN ('user', 'admin')),
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Mantras table (Admin manages mantras)
CREATE TABLE mantras (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  verses TEXT[] NOT NULL,
  category TEXT,
  color TEXT DEFAULT 'bg-orange-500',
  icon TEXT DEFAULT '🕉️',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. User Jap Progress table (Track user's chanting)
CREATE TABLE user_jap_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  mantra_id INTEGER REFERENCES mantras(id),
  total_count INTEGER DEFAULT 0,
  last_chanted TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mantra_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_jap_progress ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

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

-- Policies for user_jap_progress
CREATE POLICY "Users can view own progress" ON user_jap_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_jap_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_jap_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all progress
CREATE POLICY "Admins can view all progress" ON user_jap_progress
  FOR SELECT TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );