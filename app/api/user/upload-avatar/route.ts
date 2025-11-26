import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { put } from '@vercel/blob';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB' 
      }, { status: 400 });
    }

    // Check if user exists in "user" table to prevent FK violation
    const userCheck = await client.query('SELECT id FROM "user" WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      console.error(`User ${userId} not found in "user" table`);
      return NextResponse.json({ 
        error: 'User record not found. Please try logging out and back in.' 
      }, { status: 404 });
    }

    // Upload to Vercel Blob
    const filename = `avatars/${userId}-${Date.now()}.${file.name.split('.').pop()}`;
    const blob = await put(filename, file, {
      access: 'public',
    });

    const fileUrl = blob.url;

    // Update user profile picture in database
    const updateQuery = `
      UPDATE "user"
      SET profile_picture_url = $1, "updatedAt" = NOW()
      WHERE id = $2
      RETURNING id, profile_picture_url
    `;
    const updateResult = await client.query(updateQuery, [fileUrl, userId]);

    // Insert into profile_pictures table
    const insertQuery = `
      INSERT INTO profile_pictures (user_id, file_url, file_size, mime_type, is_current)
      VALUES ($1, $2, $3, $4, true)
      RETURNING id
    `;
    await client.query(insertQuery, [userId, fileUrl, file.size, file.type]);

    return NextResponse.json({ 
      success: true,
      fileUrl,
      user: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ 
      error: 'Failed to upload avatar',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    client.release();
  }
}
