-- Drop and recreate mantra_sessions table with correct structure
DROP TABLE IF EXISTS mantra_sessions CASCADE;

CREATE TABLE mantra_sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  mantra_id TEXT NOT NULL,
  mantra_name TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  goal INTEGER NOT NULL DEFAULT 108,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mantra_sessions ENABLE ROW LEVEL SECURITY;

-- Simple policy - allow all
CREATE POLICY "Enable all for mantra_sessions" ON mantra_sessions FOR ALL USING (true);

-- Indexes
CREATE INDEX idx_mantra_sessions_user_id ON mantra_sessions(user_id);
CREATE INDEX idx_mantra_sessions_mantra_id ON mantra_sessions(mantra_id);
CREATE INDEX idx_mantra_sessions_date ON mantra_sessions(session_date);
