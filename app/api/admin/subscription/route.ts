import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/lib/auth';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  
  if (!session || !session.user || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId, planType, status } = await req.json();

    if (!userId || !planType || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if subscription exists
    const checkResult = await pool.query('SELECT id FROM subscriptions WHERE user_id = $1', [userId]);

    if (checkResult.rows.length > 0) {
      // Update
      await pool.query(
        'UPDATE subscriptions SET plan_type = $1, status = $2, updated_at = NOW() WHERE user_id = $3',
        [planType, status, userId]
      );
    } else {
      // Insert
      await pool.query(
        'INSERT INTO subscriptions (user_id, plan_type, status) VALUES ($1, $2, $3)',
        [userId, planType, status]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
