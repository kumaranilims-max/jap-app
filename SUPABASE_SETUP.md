# Supabase Database Setup

## Create Table: mantra_sessions

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE mantra_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  mantra_id TEXT NOT NULL,
  mantra_name TEXT NOT NULL,
  count INTEGER NOT NULL,
  goal INTEGER NOT NULL,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_mantra_sessions_user_id ON mantra_sessions(user_id);
CREATE INDEX idx_mantra_sessions_date ON mantra_sessions(session_date);
CREATE INDEX idx_mantra_sessions_mantra_id ON mantra_sessions(mantra_id);
CREATE INDEX idx_mantra_sessions_created_at ON mantra_sessions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE mantra_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only their own data
CREATE POLICY "Users can view own sessions" ON mantra_sessions
  FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own sessions" ON mantra_sessions
  FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
```

## Table Structure

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Auto-increment primary key |
| user_id | TEXT | User identifier (unique per user) |
| mantra_id | TEXT | Mantra identifier |
| mantra_name | TEXT | Name of the mantra |
| count | INTEGER | Number of chants in session |
| goal | INTEGER | Target count for session |
| session_date | DATE | Date of session (YYYY-MM-DD) |
| session_time | TIME | Time of session (HH:MM:SS) |
| start_time | TIMESTAMPTZ | Session start timestamp |
| end_time | TIMESTAMPTZ | Session end timestamp |
| duration | INTEGER | Duration in seconds |
| created_at | TIMESTAMPTZ | Record creation timestamp |

## Features

✅ User-wise data isolation
✅ Date-based filtering for reports
✅ Indexed for fast queries
✅ RLS enabled for security
✅ Automatic timestamps
✅ Supports daily/weekly/monthly reports
✅ Each user sees only their own data
