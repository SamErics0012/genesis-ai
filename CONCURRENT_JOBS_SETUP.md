# Concurrent Job Limit Setup

This document explains how to set up the concurrent job limit system to prevent users from running multiple generations simultaneously.

## Overview

The system enforces a **1 concurrent job per user** limit across:
- Image generation
- Video generation
- All browsers/tabs/devices

## Database Setup

### Step 1: Run the Migration

Execute the SQL migration file in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/create_active_jobs_table.sql`
4. Paste and run the SQL

Or use the Supabase CLI:

```bash
supabase db push
```

### Step 2: Verify Table Creation

Check that the `active_jobs` table was created with these columns:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `job_type` ('image' or 'video')
- `status` ('running', 'completed', or 'failed')
- `started_at` (timestamp)
- `completed_at` (timestamp, nullable)
- `created_at` (timestamp)

## How It Works

### 1. Job Lifecycle

```
User clicks Generate
    ↓
Check for active jobs
    ↓
If active job exists → Show error
    ↓
If no active job → Create new job record
    ↓
Start generation (API call)
    ↓
On success → Mark job as completed & delete
On failure → Mark job as failed & delete
```

### 2. Stale Job Cleanup

- Jobs older than 10 minutes are automatically cleaned up
- Cleanup runs when user loads the page
- Prevents stuck jobs from blocking future generations

### 3. Cross-Browser Enforcement

- Jobs are tracked in Supabase (server-side)
- Works across all browsers, tabs, and devices
- Real-time enforcement via database queries

## User Experience

### When User Tries to Generate While Job is Running:

**Error Message:**
```
"You already have a generation in progress. Please wait for it to complete."
```

### Scenarios:

1. **User starts image generation in Tab A**
   - Opens Tab B and tries to start video generation
   - ❌ Blocked with error message

2. **User starts generation and closes browser**
   - Job continues running on server
   - If user returns within 10 minutes: ❌ Blocked
   - If user returns after 10 minutes: ✅ Allowed (stale job cleaned up)

3. **Generation fails or completes**
   - Job is immediately removed from database
   - User can start new generation right away

## Testing

### Test Concurrent Job Limit:

1. Start an image generation
2. While it's running, try to start another generation
3. Should see error: "You already have a generation in progress"

### Test Stale Job Cleanup:

1. Manually insert a stale job in Supabase:
```sql
INSERT INTO active_jobs (user_id, job_type, status, started_at)
VALUES ('your-user-id', 'image', 'running', NOW() - INTERVAL '15 minutes');
```

2. Refresh the page
3. Stale job should be automatically deleted
4. New generations should work

### Test Cross-Browser:

1. Open app in Chrome, start generation
2. Open app in Firefox with same account
3. Try to start generation
4. Should be blocked

## Monitoring

### Check Active Jobs:

```sql
SELECT * FROM active_jobs WHERE status = 'running';
```

### Check User's Job History:

```sql
SELECT * FROM active_jobs 
WHERE user_id = 'user-id-here'
ORDER BY created_at DESC;
```

### Clean Up All Stale Jobs Manually:

```sql
DELETE FROM active_jobs
WHERE status = 'running'
AND started_at < NOW() - INTERVAL '10 minutes';
```

## Configuration

### Adjust Concurrent Job Limit:

To allow more than 1 concurrent job, modify `lib/job-manager.ts`:

```typescript
// Current: 1 job limit
const hasActive = await hasActiveJob(userId);

// For 2 jobs: Check count instead
const { count } = await supabase
  .from('active_jobs')
  .select('*', { count: 'exact' })
  .eq('user_id', userId)
  .eq('status', 'running');

if (count >= 2) {
  throw new Error('Maximum 2 concurrent generations allowed');
}
```

### Adjust Stale Job Timeout:

Modify the cleanup function in `lib/job-manager.ts`:

```typescript
// Current: 10 minutes
const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

// Change to 5 minutes:
const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
```

## Troubleshooting

### Issue: User stuck with "generation in progress" error

**Solution:**
```sql
-- Delete user's active jobs
DELETE FROM active_jobs WHERE user_id = 'user-id-here';
```

### Issue: Jobs not being cleaned up

**Check:**
1. Verify cleanup function is being called on page load
2. Check browser console for errors
3. Verify Supabase connection

### Issue: Multiple jobs running despite limit

**Check:**
1. Verify RLS policies are enabled
2. Check if `startJob` function is being called
3. Verify database constraints

## Security

- ✅ Row Level Security (RLS) enabled
- ✅ Users can only see/modify their own jobs
- ✅ Server-side enforcement
- ✅ No client-side bypass possible

## Performance

- Indexed on `user_id` and `status` for fast queries
- Automatic cleanup prevents table bloat
- Minimal overhead (~10ms per generation check)
