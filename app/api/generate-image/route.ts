import { NextRequest, NextResponse } from 'next/server';

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
      
      // Transform response to match expected format
      return NextResponse.json({
        image_url: resultData.data.generated[0],
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
    return NextResponse.json(data);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
