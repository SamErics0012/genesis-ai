import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const imageUrl = request.nextUrl.searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Fetch the image from the external URL
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    // Get the image data as a buffer
    const imageBuffer = await response.arrayBuffer();
    
    // Get content type from the response or default to png
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // Return the image with proper headers for download
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="genesis-ai-${Date.now()}.png"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download image' },
      { status: 500 }
    );
  }
}
