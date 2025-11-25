-- Create active_jobs table to track concurrent job limits
CREATE TABLE IF NOT EXISTS active_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,  -- Changed to TEXT to support Better Auth custom user IDs
  job_type TEXT NOT NULL CHECK (job_type IN ('image', 'video')),
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')) DEFAULT 'running',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique partial index to enforce ONE running job per user (prevents race conditions)
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_running_job_per_user 
ON active_jobs(user_id) 
WHERE status = 'running';

-- Create index on user_id and status for faster queries
CREATE INDEX IF NOT EXISTS idx_active_jobs_user_status ON active_jobs(user_id, status);

-- Create index on started_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_active_jobs_started_at ON active_jobs(started_at);

-- Enable Row Level Security
ALTER TABLE active_jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to manage their jobs
-- Note: Better Auth handles authentication separately, so we allow all operations
-- The application layer enforces user_id matching
CREATE POLICY "Allow authenticated users" ON active_jobs
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

-- Optional: Create a scheduled job to run cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-old-jobs', '*/30 * * * *', 'SELECT cleanup_old_jobs()');
