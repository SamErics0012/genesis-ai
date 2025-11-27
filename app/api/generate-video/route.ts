import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { InferenceClient } from '@huggingface/inference';
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
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  
  await ensureUserExists(user);
  return user;
}

// Use InferenceClient with fal-ai provider as shown in the example
const hfClient = new InferenceClient(process.env.HF_TOKEN);

// Helper function to upload to Vercel Blob
async function uploadToBlob(url: string, filename: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch video from ${url}`);
    const blob = await response.blob();
    const { url: blobUrl } = await put(filename, blob, { access: 'public' });
    return blobUrl;
  } catch (error) {
    console.error('Error uploading to blob:', error);
    return url; // Fallback to original URL if upload fails
  }
}

// Helper function to poll Hailuo-2 API for results
async function pollHailuoResult(taskId: string, resolution: string, maxAttempts = 100): Promise<any> {
  const endpoint = resolution === '1080p' 
    ? `https://api.freepik.com/v1/ai/image-to-video/minimax-hailuo-02-1080p/${taskId}`
    : `https://api.freepik.com/v1/ai/image-to-video/minimax-hailuo-02-768p/${taskId}`;

  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(endpoint, {
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
      throw new Error('Video generation failed');
    }

    // Wait 3 seconds before next poll (videos take longer)
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  throw new Error('Polling timeout - video generation took too long');
}

// Helper function to poll Kling 2.5 PRO API for results
async function pollKlingResult(taskId: string, maxAttempts = 100): Promise<any> {
  const endpoint = `https://api.freepik.com/v1/ai/image-to-video/kling-v2-5-pro/${taskId}`;

  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(endpoint, {
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
      throw new Error('Video generation failed');
    }

    // Wait 3 seconds before next poll (videos take longer)
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  throw new Error('Polling timeout - video generation took too long');
}

// Helper function to poll Kling v2.1 PRO API for results
async function pollKlingProResult(taskId: string, maxAttempts = 100): Promise<any> {
  const endpoint = `https://api.freepik.com/v1/ai/image-to-video/kling-v2-1/${taskId}`;

  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(endpoint, {
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
      throw new Error('Video generation failed');
    }

    // Wait 3 seconds before next poll (videos take longer)
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  throw new Error('Polling timeout - video generation took too long');
}

// Helper function to poll Kling v2.1 Master API for results
async function pollKlingMasterResult(taskId: string, maxAttempts = 100): Promise<any> {
  const endpoint = `https://api.freepik.com/v1/ai/image-to-video/kling-v2-1-master/${taskId}`;

  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(endpoint, {
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
      throw new Error('Video generation failed');
    }

    // Wait 3 seconds before next poll (videos take longer)
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  throw new Error('Polling timeout - video generation took too long');
}

export async function POST(request: NextRequest) {
  console.log('Video generation request received - v2');
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
      
      console.log('Video gen - User ID:', user.id);
      console.log('Video gen - Subscription:', JSON.stringify(subscription));
    } finally {
      dbClient.release();
    }
    
    // Allow access if user has active premium/ultra subscription
    const hasAccess = subscription && 
      subscription.status === 'active' && 
      (subscription.plan_type === 'premium' || subscription.plan_type === 'ultra');
    
    if (!hasAccess) {
      console.log('Video gen - Access denied. Status:', subscription?.status, 'Plan:', subscription?.plan_type);
      return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
    }

    const { prompt, duration = 6, resolution = '1080p', model = 'hailuo-02', first_frame_image, image } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Handle Veo 3.1 and Sora models (Hugging Face with fal-ai provider)
    // Using InferenceClient exactly as shown in the Python example
    if (model.startsWith('veo-3-1') || model.startsWith('sora')) {
      try {
        let generatedVideoBlob: Blob;
        let hfModel = '';
        // Check if image is provided - automatically use img2vid mode
        const isImageToVideo = !!image;

        // Map slug to HF model ID - automatically select img2vid model if image is provided
        const textToVideoMap: Record<string, string> = {
          'veo-3-1-fast': 'akhaliq/veo3.1-fast',
          'veo-3-1': 'akhaliq/veo3.1-fast',
          'sora': 'akhaliq/sora-2',
          'sora-2-pro': 'akhaliq/sora-2',
        };
        
        const img2vidMap: Record<string, string> = {
          'veo-3-1-fast': 'akhaliq/veo3.1-fast-image-to-video',
          'veo-3-1': 'akhaliq/veo3.1-fast-image-to-video',
          'sora': 'akhaliq/sora-2-image-to-video',
          'sora-2-pro': 'akhaliq/sora-2-image-to-video',
        };

        // Select the appropriate model based on whether image is provided
        hfModel = isImageToVideo ? img2vidMap[model] : textToVideoMap[model];
        if (!hfModel) {
          throw new Error('Unknown model');
        }

        console.log(`Video gen - Using model: ${hfModel}, isImageToVideo: ${isImageToVideo}`);

        const HF_TOKEN = process.env.HF_TOKEN;
        
        // Create InferenceClient with provider in constructor (matching Python example)
        const { InferenceClient } = await import('@huggingface/inference');
        const client = new InferenceClient(HF_TOKEN);

        // Build parameters based on model type
        const isVeoModel = model.startsWith('veo-3-1');
        const isSoraModel = model.startsWith('sora');
        
        if (isImageToVideo) {
          if (!image) throw new Error('Image is required for this model');
          
          // Convert base64 to Blob
          const imageBuffer = Buffer.from(image, 'base64');
          const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
          
          const params: any = { prompt: prompt };
          
          // Add Veo-specific parameters
          if (isVeoModel) {
            params.duration = `${duration}s`; // "4s", "6s", "8s"
            params.resolution = resolution; // "720p", "1080p"
            params.aspect_ratio = "16:9";
          }
          // Add Sora-specific parameters
          if (isSoraModel) {
            params.duration = String(duration); // "4", "8", "12"
            params.resolution = "720p"; // Sora only supports 720p
            params.aspect_ratio = "16:9";
          }
          
          generatedVideoBlob = await client.imageToVideo({
            model: hfModel,
            inputs: imageBlob,
            parameters: params,
            provider: "fal-ai",
          }) as Blob;
        } else {
          // Build parameters for text-to-video
          const params: any = {};
          
          // Add Veo-specific parameters
          if (isVeoModel) {
            params.duration = `${duration}s`; // "4s", "6s", "8s"
            params.resolution = resolution; // "720p", "1080p"
            params.aspect_ratio = "16:9";
            params.enhance_prompt = true;
            params.generate_audio = true;
          }
          // Add Sora-specific parameters
          if (isSoraModel) {
            params.duration = String(duration); // "4", "8", "12"
            params.resolution = "720p"; // Sora only supports 720p
            params.aspect_ratio = "16:9";
          }
          
          // Use textToVideo with provider parameter
          generatedVideoBlob = await client.textToVideo({
            model: hfModel,
            inputs: prompt,
            parameters: Object.keys(params).length > 0 ? params : undefined,
            provider: "fal-ai",
          }) as Blob;
        }

        // Upload to Vercel Blob
        const { url: blobUrl } = await put(`generated-videos/${model}-${Date.now()}.mp4`, generatedVideoBlob, { access: 'public' });

        return NextResponse.json({
          video_url: blobUrl,
          task_id: `hf-${Date.now()}`
        });

      } catch (error: any) {
        console.error('HF Generation Error:', error);
        
        const errorMessage = error?.message || 'Generation failed';
        return NextResponse.json(
          { error: errorMessage },
          { status: 500 }
        );
      }
    }

    // Handle Hailuo-2 with polling
    if (model === 'hailuo-02') {
      // Determine endpoint based on resolution
      const endpoint = resolution === '1080p'
        ? 'https://api.freepik.com/v1/ai/image-to-video/minimax-hailuo-02-1080p'
        : 'https://api.freepik.com/v1/ai/image-to-video/minimax-hailuo-02-768p';

      // Prepare request body
      const requestBody: any = {
        prompt: prompt,
        prompt_optimizer: true,
        duration: duration
      };

      // Add image data if provided (for image-to-video)
      if (first_frame_image) {
        requestBody.first_frame_image = first_frame_image;
      }

      // Initiate video generation
      const initResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-freepik-api-key': 'FPSX96d3813d494d86d0491167f6673b9185'
        },
        body: JSON.stringify(requestBody)
      });

      if (!initResponse.ok) {
        const errorText = await initResponse.text();
        console.error('Hailuo Init Error:', errorText);
        return NextResponse.json(
          { error: `Hailuo API error: ${initResponse.status}` },
          { status: initResponse.status }
        );
      }

      const initData = await initResponse.json();
      const taskId = initData.data.task_id;

      // Poll for results
      const resultData = await pollHailuoResult(taskId, resolution);
      
      // Upload to Blob
      const originalUrl = resultData.data.generated[0];
      const blobUrl = await uploadToBlob(originalUrl, `generated-videos/hailuo-${taskId}.mp4`);

      // Transform response to match expected format
      return NextResponse.json({
        video_url: blobUrl,
        task_id: taskId
      });
    }

    // Handle Kling 2.5 PRO with polling
    if (model === 'kling-2-5-pro') {
      const endpoint = 'https://api.freepik.com/v1/ai/image-to-video/kling-v2-5-pro';

      // Prepare request body - only include image if it's actual base64 data
      const requestBody: any = {
        webhook_url: "https://www.example.com/webhook",
        prompt: prompt,
        negative_prompt: "<string>",
        duration: duration.toString(),
        cfg_scale: 0.5
      };

      // Only add image parameter if we have actual base64 data
      if (image && image !== "<string>") {
        requestBody.image = image;
      }

      console.log('Kling API Request Body:', JSON.stringify(requestBody, null, 2));

      // Initiate video generation
      const initResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-freepik-api-key': 'FPSX96d3813d494d86d0491167f6673b9185'
        },
        body: JSON.stringify(requestBody)
      });

      if (!initResponse.ok) {
        const errorText = await initResponse.text();
        console.error('Kling Init Error Response:', errorText);
        console.error('Kling Init Status:', initResponse.status);
        console.error('Kling Request Body that failed:', JSON.stringify(requestBody, null, 2));
        return NextResponse.json(
          { error: `Kling API error: ${initResponse.status} - ${errorText}` },
          { status: initResponse.status }
        );
      }

      const initData = await initResponse.json();
      const taskId = initData.data.task_id;

      // Poll for results
      const resultData = await pollKlingResult(taskId);
      
      // Upload to Blob
      const originalUrl = resultData.data.generated[0];
      const blobUrl = await uploadToBlob(originalUrl, `generated-videos/kling-2-5-${taskId}.mp4`);

      // Transform response to match expected format
      return NextResponse.json({
        video_url: blobUrl,
        task_id: taskId
      });
    }

    // Handle Kling v2.1 PRO with polling
    if (model === 'kling-v2-1-pro') {
      const endpoint = 'https://api.freepik.com/v1/ai/image-to-video/kling-v2-1-pro';

      // Prepare request body - same as Kling 2.5 PRO
      const requestBody: any = {
        webhook_url: "https://www.example.com/webhook",
        prompt: prompt,
        negative_prompt: "<string>",
        duration: duration.toString(),
        cfg_scale: 0.5
      };

      // Only add image parameter if we have actual base64 data
      if (image && image !== "<string>") {
        requestBody.image = image;
      }

      console.log('Kling v2.1 PRO API Request Body:', JSON.stringify(requestBody, null, 2));

      // Initiate video generation
      const initResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-freepik-api-key': 'FPSX96d3813d494d86d0491167f6673b9185'
        },
        body: JSON.stringify(requestBody)
      });

      if (!initResponse.ok) {
        const errorText = await initResponse.text();
        console.error('Kling v2.1 PRO Init Error Response:', errorText);
        console.error('Kling v2.1 PRO Init Status:', initResponse.status);
        console.error('Kling v2.1 PRO Request Body that failed:', JSON.stringify(requestBody, null, 2));
        return NextResponse.json(
          { error: `Kling v2.1 PRO API error: ${initResponse.status} - ${errorText}` },
          { status: initResponse.status }
        );
      }

      const initData = await initResponse.json();
      const taskId = initData.data.task_id;

      // Poll for results
      const resultData = await pollKlingProResult(taskId);
      
      // Upload to Blob
      const originalUrl = resultData.data.generated[0];
      const blobUrl = await uploadToBlob(originalUrl, `generated-videos/kling-2-1-pro-${taskId}.mp4`);

      // Transform response to match expected format
      return NextResponse.json({
        video_url: blobUrl,
        task_id: taskId
      });
    }

    // Handle Kling v2.1 Master with polling
    if (model === 'kling-v2-1-master') {
      const endpoint = 'https://api.freepik.com/v1/ai/image-to-video/kling-v2-1-master';

      // Prepare request body - same as Kling 2.5 PRO
      const requestBody: any = {
        webhook_url: "https://www.example.com/webhook",
        prompt: prompt,
        negative_prompt: "<string>",
        duration: duration.toString(),
        cfg_scale: 0.5
      };

      // Only add image parameter if we have actual base64 data
      if (image && image !== "<string>") {
        requestBody.image = image;
      }

      console.log('Kling Master API Request Body:', JSON.stringify(requestBody, null, 2));

      // Initiate video generation
      const initResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-freepik-api-key': 'FPSX96d3813d494d86d0491167f6673b9185'
        },
        body: JSON.stringify(requestBody)
      });

      if (!initResponse.ok) {
        const errorText = await initResponse.text();
        console.error('Kling Master Init Error Response:', errorText);
        console.error('Kling Master Init Status:', initResponse.status);
        console.error('Kling Master Request Body that failed:', JSON.stringify(requestBody, null, 2));
        return NextResponse.json(
          { error: `Kling Master API error: ${initResponse.status} - ${errorText}` },
          { status: initResponse.status }
        );
      }

      const initData = await initResponse.json();
      const taskId = initData.data.task_id;

      // Poll for results
      const resultData = await pollKlingMasterResult(taskId);
      
      // Upload to Blob
      const originalUrl = resultData.data.generated[0];
      const blobUrl = await uploadToBlob(originalUrl, `generated-videos/kling-2-1-master-${taskId}.mp4`);

      // Transform response to match expected format
      return NextResponse.json({
        video_url: blobUrl,
        task_id: taskId
      });
    }

    // For other models (future implementation)
    return NextResponse.json(
      { error: 'Unsupported model' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
