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

// Helper function to poll Fal.ai API for results
async function pollFalResult(requestId: string, falKey: string, queuePath: string = 'fal-ai/recraft', maxAttempts = 30): Promise<any> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`https://queue.fal.run/${queuePath}/requests/${requestId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Key ${falKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Fal.ai polling failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'COMPLETED') {
      // Fetch the final result
      const resultResponse = await fetch(`https://queue.fal.run/${queuePath}/requests/${requestId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Key ${falKey}`
        }
      });
      
      if (!resultResponse.ok) {
        throw new Error(`Fal.ai result fetch failed: ${resultResponse.status}`);
      }
      
      return await resultResponse.json();
    } else if (data.status === 'FAILED') {
      throw new Error(`Fal.ai generation failed: ${data.error || 'Unknown error'}`);
    }

    // Wait 1 second before next poll
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error('Fal.ai polling timeout');
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

    // Handle Together AI models (FLUX.2 Flex)
    if (model === 'flux-2-flex') {
      const togetherResponse = await fetch('https://api.together.xyz/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'black-forest-labs/FLUX.2-flex',
          prompt: prompt,
          steps: 10,
          n: 1
        })
      });

      if (!togetherResponse.ok) {
        const errorText = await togetherResponse.text();
        console.error('Together AI Error:', errorText);
        return NextResponse.json(
          { error: `Together AI error: ${togetherResponse.status}` },
          { status: togetherResponse.status }
        );
      }

      const togetherData = await togetherResponse.json();
      
      // Together AI returns { data: [{ url: "..." }] }
      if (togetherData.data && togetherData.data.length > 0 && togetherData.data[0].url) {
        const originalUrl = togetherData.data[0].url;
        const blobUrl = await uploadToBlob(originalUrl, `generated-images/flux-2-flex-${Date.now()}.png`);
        return NextResponse.json({
          image_url: blobUrl,
          task_id: `together-${Date.now()}`
        });
      }
      
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    // Handle HuggingFace models (Qwen Image, FLUX.2 Dev)
    if (model === 'qwen-image' || model === 'flux-2-dev') {
      const { InferenceClient } = await import('@huggingface/inference');
      const client = new InferenceClient(process.env.HF_TOKEN);

      const hfModelMap: Record<string, string> = {
        'qwen-image': 'Qwen/Qwen-Image',
        'flux-2-dev': 'black-forest-labs/FLUX.2-dev'
      };

      const hfModel = hfModelMap[model];
      
      try {
        const imageBlob = await client.textToImage({
          model: hfModel,
          inputs: prompt,
          provider: "fal-ai",
        }) as Blob;

        // Upload to Vercel Blob
        const { url: blobUrl } = await put(`generated-images/${model}-${Date.now()}.png`, imageBlob, { access: 'public' });

        return NextResponse.json({
          image_url: blobUrl,
          task_id: `hf-${Date.now()}`
        });
      } catch (error: any) {
        console.error('HuggingFace Error:', error);
        return NextResponse.json(
          { error: error?.message || 'HuggingFace generation failed' },
          { status: 500 }
        );
      }
    }

    // Handle Fal.ai models (Recraft V3)
    if (model === 'recraft-v3') {
      const FAL_KEY = process.env.FAL_KEY || '3a4fe662-5eac-4604-af38-037d59e2a31c:d877139d891cf1180358b5cf4ba8f314';
      
      const falResponse = await fetch('https://queue.fal.run/fal-ai/recraft/v3/text-to-image', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          image_size: aspect_ratio === '1:1' ? 'square_hd' : 
                     aspect_ratio === '16:9' ? 'landscape_16_9' : 
                     aspect_ratio === '9:16' ? 'portrait_16_9' : 
                     aspect_ratio === '4:3' ? 'landscape_4_3' : 
                     aspect_ratio === '3:4' ? 'portrait_4_3' : 'square_hd'
        })
      });

      if (!falResponse.ok) {
        const errorText = await falResponse.text();
        console.error('Fal.ai Error:', errorText);
        return NextResponse.json(
          { error: `Fal.ai error: ${falResponse.status}` },
          { status: falResponse.status }
        );
      }

      const falData = await falResponse.json();
      const requestId = falData.request_id;

      // Poll for results
      const resultData = await pollFalResult(requestId, FAL_KEY, 'fal-ai/recraft');
      
      if (resultData.images && resultData.images.length > 0) {
        const originalUrl = resultData.images[0].url;
        const blobUrl = await uploadToBlob(originalUrl, `generated-images/${model}-${Date.now()}.png`);
        return NextResponse.json({
          image_url: blobUrl,
          task_id: `fal-${requestId}`
        });
      }
      
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    // Handle Fal.ai models (Reve)
    if (model === 'reve') {
      const FAL_KEY = process.env.FAL_KEY || '3a4fe662-5eac-4604-af38-037d59e2a31c:d877139d891cf1180358b5cf4ba8f314';
      
      const falResponse = await fetch('https://queue.fal.run/fal-ai/reve/text-to-image', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          aspect_ratio: aspect_ratio,
          num_images: 1,
          output_format: "png"
        })
      });

      if (!falResponse.ok) {
        const errorText = await falResponse.text();
        console.error('Fal.ai (Reve) Error:', errorText);
        return NextResponse.json(
          { error: `Fal.ai error: ${falResponse.status}` },
          { status: falResponse.status }
        );
      }

      const falData = await falResponse.json();
      const requestId = falData.request_id;

      // Poll for results
      const resultData = await pollFalResult(requestId, FAL_KEY, 'fal-ai/reve');
      
      if (resultData.images && resultData.images.length > 0) {
        const originalUrl = resultData.images[0].url;
        const blobUrl = await uploadToBlob(originalUrl, `generated-images/${model}-${Date.now()}.png`);
        return NextResponse.json({
          image_url: blobUrl,
          task_id: `fal-${requestId}`
        });
      }
      
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    // Handle Fal.ai models (Minimax)
    if (model === 'minimax-image-01') {
      const FAL_KEY = process.env.FAL_KEY || '3a4fe662-5eac-4604-af38-037d59e2a31c:d877139d891cf1180358b5cf4ba8f314';
      
      const falResponse = await fetch('https://queue.fal.run/fal-ai/minimax/image-01', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          aspect_ratio: aspect_ratio,
          num_images: 1
        })
      });

      if (!falResponse.ok) {
        const errorText = await falResponse.text();
        console.error('Fal.ai (Minimax) Error:', errorText);
        return NextResponse.json(
          { error: `Fal.ai error: ${falResponse.status}` },
          { status: falResponse.status }
        );
      }

      const falData = await falResponse.json();
      const requestId = falData.request_id;

      // Poll for results
      const resultData = await pollFalResult(requestId, FAL_KEY, 'fal-ai/minimax');
      
      if (resultData.images && resultData.images.length > 0) {
        const originalUrl = resultData.images[0].url;
        const blobUrl = await uploadToBlob(originalUrl, `generated-images/${model}-${Date.now()}.png`);
        return NextResponse.json({
          image_url: blobUrl,
          task_id: `fal-${requestId}`
        });
      }
      
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    // Handle Infip API models (Leonardo)
    if (model === 'lucid-origin' || model === 'phoenix') {
      const INFIP_KEY = process.env.INFIP_API_KEY || 'infip-46fbbfdb';
      
      const infipResponse = await fetch('https://api.infip.pro/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${INFIP_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          n: 1,
          size: "1024x1024"
        })
      });

      if (!infipResponse.ok) {
        const errorText = await infipResponse.text();
        console.error('Infip API Error Status:', infipResponse.status);
        console.error('Infip API Error Body:', errorText);
        return NextResponse.json(
          { error: `Infip API error: ${infipResponse.status} - ${errorText}` },
          { status: infipResponse.status }
        );
      }

      const infipData = await infipResponse.json();
      console.log('Infip API Success Response:', JSON.stringify(infipData));
      
      // Infip returns { data: [{ url: "..." }] }
      if (infipData.data && infipData.data.length > 0 && infipData.data[0].url) {
        const originalUrl = infipData.data[0].url;
        const blobUrl = await uploadToBlob(originalUrl, `generated-images/${model}-${Date.now()}.png`);
        return NextResponse.json({
          image_url: blobUrl,
          task_id: `infip-${Date.now()}`
        });
      }
      
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    // Map model slugs to DeathPrix API endpoints
    const modelEndpoints: Record<string, string> = {
      'midjourney': 'https://api.deathprixai.online/image/midjourney/generate',
      'flux-pro-1-1': 'https://api.deathprixai.online/image/black-forest-labs/flux-pro-1.1',
      'flux-ultra-1-1': 'https://api.deathprixai.online/image/black-forest-labs/flux-ultra-1.1',
      'flux-ultra-raw-1-1': 'https://api.deathprixai.online/image/black-forest-labs/flux-ultra-raw-1.1',
      'flux-kontext-pro': 'https://api.deathprixai.online/image/black-forest-labs/flux-kontext-pro',
      'flux-kontext-max': 'https://api.deathprixai.online/image/black-forest-labs/flux-kontext-max',
      'google-nano-banana-base': 'https://api.deathprixai.online/image/google/nano-banana',
      'google-nano-banana': 'https://api.deathprixai.online/image/google/nano-banana-pro',
      'google-imagen-3': 'https://api.deathprixai.online/image/google/imagen-3',
      'google-imagen-4': 'https://api.deathprixai.online/image/google/imagen-4',
      'runway-gen-4-image': 'https://api.deathprixai.online/image/runway/gen4-image',
      'adobe-firefly-5': 'https://api.deathprixai.online/image/adobe/firefly-image-5-preview',
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

    const DEATHPRIX_API_KEY = process.env.DEATHPRIX_API_KEY || 'dpx_D4XsRSFxKPYdi0ZzfvFIAlAZu245lkOIB6je6KrNCvg';

    const formData = new URLSearchParams();
    formData.append('prompt', prompt);
    formData.append('aspect_ratio', aspect_ratio);

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-API-Key': DEATHPRIX_API_KEY,
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
      return NextResponse.json({
        image_url: blobUrl,
        task_id: data.id || `deathprix-${Date.now()}`
      });
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
