import { supabase } from './supabase';

export interface ActiveJob {
  id: string;
  user_id: string;
  job_type: 'image' | 'video';
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
}

// Check if user has any active jobs
export async function hasActiveJob(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('active_jobs')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'running')
      .limit(1);

    // If there's an error (like table doesn't exist), return false to allow generation
    if (error) {
      console.warn('Could not check active jobs (table may not exist):', error.message);
      return false;
    }

    // Check if any rows were returned
    return data && data.length > 0;
  } catch (error) {
    console.error('Error in hasActiveJob:', error);
    // On any error, return false to not block the user
    return false;
  }
}

// Start a new job
export async function startJob(userId: string, jobType: 'image' | 'video'): Promise<string | null> {
  try {
    // Create new job - database will enforce uniqueness via partial index
    const { data, error } = await supabase
      .from('active_jobs')
      .insert({
        user_id: userId,
        job_type: jobType,
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      // Check if it's a unique constraint violation (23505 = unique_violation)
      if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
        throw new Error('You already have a generation in progress. Please wait for it to complete.');
      }
      
      // If table doesn't exist, log warning and return null (allow generation to proceed)
      console.warn('Could not create job record (table may not exist):', error.message);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error starting job:', error);
    // If it's the "already have generation" error, re-throw it
    if (error instanceof Error && error.message.includes('already have a generation')) {
      throw error;
    }
    // For other errors, return null to allow generation
    return null;
  }
}

// Complete a job
export async function completeJob(jobId: string | null, status: 'completed' | 'failed' = 'completed'): Promise<void> {
  // If jobId is null (table didn't exist when job started), just return
  if (!jobId) return;

  try {
    const { error } = await supabase
      .from('active_jobs')
      .update({
        status: status,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (error) {
      console.warn('Could not update job status:', error.message);
    }

    // Delete completed/failed jobs after updating (cleanup)
    await supabase
      .from('active_jobs')
      .delete()
      .eq('id', jobId);

  } catch (error) {
    console.warn('Error completing job (non-critical):', error);
  }
}

// Cleanup stale jobs (jobs running for more than 10 minutes)
export async function cleanupStaleJobs(userId: string): Promise<void> {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('active_jobs')
      .delete()
      .eq('user_id', userId)
      .eq('status', 'running')
      .lt('started_at', tenMinutesAgo);

    if (error) {
      console.warn('Could not cleanup stale jobs:', error.message);
    }

  } catch (error) {
    console.warn('Error cleaning up stale jobs (non-critical):', error);
  }
}

// Get active job for user
export async function getActiveJob(userId: string): Promise<ActiveJob | null> {
  try {
    const { data, error } = await supabase
      .from('active_jobs')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'running')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting active job:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getActiveJob:', error);
    return null;
  }
}
