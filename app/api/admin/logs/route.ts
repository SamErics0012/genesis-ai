import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/lib/auth';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  
  if (!session || !session.user || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const images = await pool.query(`
      SELECT id, user_id, prompt, model, created_at, 'image' as type 
      FROM generated_images 
      ORDER BY created_at DESC 
      LIMIT 50
    `);

    const videos = await pool.query(`
      SELECT id, user_id, prompt, model, created_at, 'video' as type 
      FROM generated_videos 
      ORDER BY created_at DESC 
      LIMIT 50
    `);
    
    const logs = [...images.rows, ...videos.rows].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 50);

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
