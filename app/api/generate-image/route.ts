import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { createClient } from '@supabase/supabase-js';
import { ensureUserExists } from '@/lib/auth-sync';
import pool from '@/lib/db';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function getUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  // Also check for cookie if header is missing (for some clients)
  // But for now, rely on Authorization header as per other routes
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  
  await ensureUserExists(user);
  return user;
}

// Helper function to upload to Vercel Blob
async function uploadToBlob(url: string, filename: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image from ${url}`);
    const blob = await response.blob();
    const { url: blobUrl } = await put(filename, blob, { access: 'public' });
    return blobUrl;
  } catch (error) {
    console.error('Error uploading to blob:', error);
    return url; // Fallback to original URL if upload fails
  }
}

// Helper function to map aspect ratios to Seedream 4 format
function mapAspectRatioForSeedream(ratio: string): string {
  const mapping: Record<string, string> = {
    '1:1': 'square_1_1',
    '16:9': 'widescreen_16_9',
    '9:16': 'social_story_9_16',
    '4:3': 'traditional_3_4',
    '3:4': 'classic_4_3'
  };
  return mapping[ratio] || 'square_1_1';
}

// Helper function to poll Seedream 4 API for results
async function pollSeedreamResult(taskId: string, maxAttempts = 30): Promise<any> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`https://api.freepik.com/v1/ai/text-to-image/seedream-v4/${taskId}`, {
      method: 'GET',
      headers: {
        'x-freepik-api-key': 'FPSX96d3813d494d86d0491167f6673b9185'
      }
    });

    if (!response.ok) {
      throw new Error(`Polling failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data.status === 'COMPLETED') {
      return data;
    } else if (data.data.status === 'FAILED') {
      throw new Error('Image generation failed');
    }

    // Wait 2 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('Polling timeout - image generation took too long');
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify subscription using PostgreSQL pool (same as /api/subscription)
    const dbClient = await pool.connect();
    let subscription: any = null;
    
    try {
      const subResult = await dbClient.query(
        'SELECT * FROM subscriptions WHERE user_id = $1',
        [user.id]
      );
      subscription = subResult.rows[0] || null;
      
      console.log('Image gen - User ID:', user.id);
      console.log('Image gen - Subscription:', JSON.stringify(subscription));
    } finally {
      dbClient.release();
    }
    
    // Allow access if user has active premium/ultra subscription
    const hasAccess = subscription && 
      subscription.status === 'active' && 
      (subscription.plan_type === 'premium' || subscription.plan_type === 'ultra');
    
    if (!hasAccess) {
      console.log('Image gen - Access denied. Status:', subscription?.status, 'Plan:', subscription?.plan_type);
      return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
    }

    const { prompt, aspect_ratio = '1:1', model = 'flux-ultra-raw-1-1' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Handle Seedream 4 separately due to polling requirement
    if (model === 'seedream-4') {
      const seedreamAspectRatio = mapAspectRatioForSeedream(aspect_ratio);
      
      // Initiate image generation
      const initResponse = await fetch('https://api.freepik.com/v1/ai/text-to-image/seedream-v4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-freepik-api-key': 'FPSX96d3813d494d86d0491167f6673b9185'
        },
        body: JSON.stringify({
          prompt: prompt,
          aspect_ratio: seedreamAspectRatio,
          guidance_scale: 2.5,
          seed: Math.floor(Math.random() * 1073741823)
        })
      });

      if (!initResponse.ok) {
        const errorText = await initResponse.text();
        console.error('Seedream Init Error:', errorText);
        return NextResponse.json(
          { error: `Seedream API error: ${initResponse.status}` },
          { status: initResponse.status }
        );
      }

      const initData = await initResponse.json();
      const taskId = initData.data.task_id;

      // Poll for results
      const resultData = await pollSeedreamResult(taskId);
      
      // Upload to Blob
      const originalUrl = resultData.data.generated[0];
      const blobUrl = await uploadToBlob(originalUrl, `generated-images/seedream-${taskId}.png`);

      // Transform response to match expected format
      return NextResponse.json({
        image_url: blobUrl,
        task_id: taskId
      });
    }

    // Map model slugs to API endpoints
    const modelEndpoints: Record<string, string> = {
      'flux-ultra-raw-1-1': 'https://api.deathprixai.online/image/black-forest-labs/flux-ultra-raw-1.1',
      'flux-kontext-pro': 'https://api.deathprixai.online/image/black-forest-labs/flux-kontext-pro',
      'flux-kontext-max': 'https://api.deathprixai.online/image/black-forest-labs/flux-kontext-max',
      'google-nano-banana': 'https://api.deathprixai.online/image/google/nano-banana',
      'google-imagen-3': 'https://api.deathprixai.online/image/google/imagen-3',
      'google-imagen-4': 'https://api.deathprixai.online/image/google/imagen-4',
      'runway-gen-4-image': 'https://api.deathprixai.online/image/runway/gen4-image',
      'ideogram-v3': 'https://api.deathprixai.online/image/ideogram/v3',
      'openai-gpt-image': 'https://api.deathprixai.online/image/openai/gpt-image'
    };

    const apiEndpoint = modelEndpoints[model];
    
    if (!apiEndpoint) {
      return NextResponse.json(
        { error: 'Unsupported model' },
        { status: 400 }
      );
    }

    const formData = new URLSearchParams();
    formData.append('prompt', prompt);
    formData.append('aspect_ratio', aspect_ratio);

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-API-Key': 'dpx_JPL2OOx4v4pIQGC0y1K7syQTiGavCZ6-FCy8R4Se7P0',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Upload to Blob if output URL exists
    if (data.output && data.output.length > 0 && data.output[0].url) {
      const originalUrl = data.output[0].url;
      const filename = `generated-images/${model}-${Date.now()}.png`;
      const blobUrl = await uploadToBlob(originalUrl, filename);
      data.output[0].url = blobUrl;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
