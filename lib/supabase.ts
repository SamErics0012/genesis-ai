import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface GeneratedImage {
  id: string;
  user_id: string;
  image_url: string;
  prompt: string;
  model: string;
  aspect_ratio: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'premium' | 'ultra';
  status: 'active' | 'inactive' | 'cancelled';
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}
