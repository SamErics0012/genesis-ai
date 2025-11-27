import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { createClient } from '@supabase/supabase-js';
import { ensureUserExists } from '@/lib/auth-sync';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY!
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

export async function GET(request: Request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM generated_videos WHERE user_id = $1 ORDER BY created_at DESC',
        [user.id]
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { video_url, prompt, model, duration } = body;

    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO generated_videos (user_id, video_url, prompt, model, duration)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [user.id, video_url, prompt, model, duration]
      );
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error saving video:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query(
        'DELETE FROM generated_videos WHERE id = $1 AND user_id = $2',
        [id, user.id]
      );
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
