import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const client = await pool.connect();
  
  try {
    const query = 'SELECT * FROM subscriptions WHERE user_id = $1';
    const result = await client.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ subscription: null });
    }
    
    const data = result.rows[0];

    // Check if subscription has expired (except for free plan)
    if (data.plan_type !== 'free' && data.expires_at) {
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (now > expiresAt) {
        // Auto-expire the subscription
        const updateQuery = `
          UPDATE subscriptions 
          SET plan_type = 'free', status = 'cancelled', updated_at = NOW()
          WHERE user_id = $1
        `;
        await client.query(updateQuery, [userId]);
        
        const expiredSubscription = {
          ...data,
          plan_type: 'free',
          status: 'cancelled'
        };
        
        return NextResponse.json({ subscription: expiredSubscription });
      }
    }

    return NextResponse.json({ subscription: data });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
