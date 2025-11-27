import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';
import { ensureUserExists } from '@/lib/auth-sync';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  // Try to sync user if token is provided
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (user && !error && user.id === userId) {
      await ensureUserExists(user);
    }
  }

  const client = await pool.connect();
  
  try {
    const query = 'SELECT * FROM subscriptions WHERE user_id = $1';
    const result = await client.query(query, [userId]);
    
    if (result.rows.length === 0) {
      // Try to create a default free subscription
      try {
        // First check if user exists in public.user to avoid FK violation
        const userCheck = await client.query('SELECT id FROM "user" WHERE id = $1', [userId]);
        
        if (userCheck.rows.length === 0) {
          // User not in public.user, return a temporary free subscription object
          // This happens if the user is in auth.users but not synced to public.user
          return NextResponse.json({ 
            subscription: {
              user_id: userId,
              plan_type: 'free',
              status: 'active'
            } 
          });
        }

        const insertQuery = `
          INSERT INTO subscriptions (user_id, plan_type, status)
          VALUES ($1, 'free', 'active')
          RETURNING *
        `;
        const insertResult = await client.query(insertQuery, [userId]);
        return NextResponse.json({ subscription: insertResult.rows[0] });
      } catch (err) {
        console.error('Error creating default subscription:', err);
        // Fallback
        return NextResponse.json({ 
          subscription: {
            user_id: userId,
            plan_type: 'free',
            status: 'active'
          } 
        });
      }
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
