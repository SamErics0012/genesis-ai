import { NextRequest, NextResponse } from 'next/server';

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
  try {
    const { prompt, duration = 6, resolution = '1080p', model = 'hailuo-02', first_frame_image, image } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
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
      
      // Transform response to match expected format
      return NextResponse.json({
        video_url: resultData.data.generated[0],
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
      
      // Transform response to match expected format
      return NextResponse.json({
        video_url: resultData.data.generated[0],
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
      
      // Transform response to match expected format
      return NextResponse.json({
        video_url: resultData.data.generated[0],
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
      
      // Transform response to match expected format
      return NextResponse.json({
        video_url: resultData.data.generated[0],
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
