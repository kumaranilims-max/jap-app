-- Simple Mantra Sessions Table Setup
-- Copy and paste this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS mantra_sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  mantra_id TEXT NOT NULL,
  mantra_name TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  goal INTEGER NOT NULL DEFAULT 108,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mantra_sessions ENABLE ROW LEVEL SECURITY;

-- Allow all operations (simple policy)
CREATE POLICY "Enable all for mantra_sessions" ON mantra_sessions FOR ALL USING (true);
