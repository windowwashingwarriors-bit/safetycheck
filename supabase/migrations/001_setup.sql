-- SafetyCheck Database Schema
-- Run this in the Supabase SQL Editor before running the seed script.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables for a clean setup
DROP TABLE IF EXISTS question_history CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT        NOT NULL,
  role         TEXT        NOT NULL CHECK (role IN ('technician', 'manager', 'admin')),
  pin          TEXT        NOT NULL,
  hire_date    DATE        NOT NULL DEFAULT CURRENT_DATE,
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  push_token   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  category         TEXT        NOT NULL CHECK (category IN ('safety', 'summer_service', 'winter_service', 'policy')),
  season           TEXT        NOT NULL CHECK (season IN ('year_round', 'summer', 'winter')),
  type             TEXT        NOT NULL CHECK (type IN ('multiple_choice', 'short_answer')),
  question         TEXT        NOT NULL,
  options          JSONB,
  correct_answer   TEXT,
  grading_guidance TEXT,
  reference        TEXT,
  video_url        TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quotes table
CREATE TABLE quotes (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote      TEXT        NOT NULL,
  author     TEXT        NOT NULL,
  translation TEXT,
  sort_order INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sessions table (one per user per day)
CREATE TABLE sessions (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date         DATE        NOT NULL,
  questions    JSONB       NOT NULL DEFAULT '[]',
  answers      JSONB       NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  signature    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date)
);

-- Question history (tracks which questions each user has been assigned)
-- A row is deleted when the user's full bank is cycled (reset)
CREATE TABLE question_history (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID        NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  used_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, question_id)
);

-- Notifications log
CREATE TABLE notifications (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT        NOT NULL CHECK (type IN ('reminder', 'report', 'push')),
  title      TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  sent_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (permissive — app uses custom PIN auth, not Supabase Auth)
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON users            FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON questions        FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON quotes           FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON sessions         FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON question_history FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON notifications    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX idx_sessions_user_date      ON sessions (user_id, date);
CREATE INDEX idx_question_history_user   ON question_history (user_id);
CREATE INDEX idx_sessions_date           ON sessions (date);
