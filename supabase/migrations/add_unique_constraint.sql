-- Add unique partial index to enforce ONE running job per user
-- This prevents race conditions when multiple tabs try to start jobs simultaneously

-- First, clean up any duplicate running jobs (if any exist)
DELETE FROM active_jobs a
USING active_jobs b
WHERE a.id < b.id 
  AND a.user_id = b.user_id 
  AND a.status = 'running' 
  AND b.status = 'running';

-- Now create the unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_running_job_per_user 
ON active_jobs(user_id) 
WHERE status = 'running';

-- This index ensures that:
-- 1. Only ONE row with status='running' can exist per user_id
-- 2. Database enforces this at the lowest level (no race conditions)
-- 3. Any attempt to insert a second running job will fail with unique violation error
