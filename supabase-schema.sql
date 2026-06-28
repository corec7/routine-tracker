-- Supabase schema for Routine Tracker v2 (time-based)
-- Run this in Supabase SQL Editor to set up the database

-- If upgrading from v1, drop the old table first:
-- DROP TABLE IF EXISTS task_completions;

CREATE TABLE IF NOT EXISTS task_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  date DATE NOT NULL,
  actual_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, task_id, date)
);

CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  time TEXT NOT NULL DEFAULT '07:00',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_records_user_date ON task_records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_records_user_range ON task_records(user_id, date, task_id);

ALTER TABLE task_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for now" ON task_records FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON notification_settings FOR ALL USING (true);
