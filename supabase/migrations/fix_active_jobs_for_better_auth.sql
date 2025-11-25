-- Fix active_jobs table to work with Better Auth
-- Run this if you already created the table with UUID user_id

-- Drop existing table and recreate with correct schema
DROP TABLE IF EXISTS active_jobs CASCADE;

-- Create active_jobs table with TEXT user_id for Better Auth
CREATE TABLE active_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('image', 'video')),
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')) DEFAULT 'running',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique partial index to enforce ONE running job per user
CREATE UNIQUE INDEX idx_one_running_job_per_user 
ON active_jobs(user_id) 
WHERE status = 'running';

-- Create index on user_id and status for faster queries
CREATE INDEX idx_active_jobs_user_status ON active_jobs(user_id, status);

-- Create index on started_at for cleanup queries
CREATE INDEX idx_active_jobs_started_at ON active_jobs(started_at);

-- Enable Row Level Security
ALTER TABLE active_jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations (Better Auth handles auth separately)
CREATE POLICY "Allow all operations" ON active_jobs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to automatically cleanup old completed/failed jobs
CREATE OR REPLACE FUNCTION cleanup_old_jobs()
RETURNS void AS $$
BEGIN
  DELETE FROM active_jobs
  WHERE status IN ('completed', 'failed')
  AND completed_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
