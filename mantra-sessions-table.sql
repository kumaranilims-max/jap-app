-- =====================================================
-- MANTRA SESSIONS TABLE (User-wise Session Tracking)
-- =====================================================

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mantra_sessions_user_id ON mantra_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mantra_sessions_mantra_id ON mantra_sessions(mantra_id);
CREATE INDEX IF NOT EXISTS idx_mantra_sessions_date ON mantra_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_mantra_sessions_user_date ON mantra_sessions(user_id, session_date);

-- Enable RLS
ALTER TABLE mantra_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sessions" ON mantra_sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own sessions" ON mantra_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own sessions" ON mantra_sessions
  FOR UPDATE USING (true);

-- View for session analytics
CREATE OR REPLACE VIEW session_analytics AS
SELECT 
  user_id,
  mantra_id,
  mantra_name,
  COUNT(*) as total_sessions,
  SUM(count) as total_count,
  AVG(count) as avg_count_per_session,
  SUM(duration) as total_duration_seconds,
  MIN(session_date) as first_session,
  MAX(session_date) as last_session
FROM mantra_sessions
GROUP BY user_id, mantra_id, mantra_name;
