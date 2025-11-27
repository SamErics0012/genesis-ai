import pool from '@/lib/db';
import { User } from '@supabase/supabase-js';

export async function ensureUserExists(user: User) {
  const client = await pool.connect();
  try {
    // Check if user exists
    // We don't return early anymore so we can always check/update the subscription
    // const check = await client.query('SELECT id FROM "user" WHERE id = $1', [user.id]);
    // if (check.rows.length > 0) return;

    // Insert user
    await client.query(
      `INSERT INTO "user" (id, email, "emailVerified", "createdAt", "updatedAt", display_name)
       VALUES ($1, $2, $3, NOW(), NOW(), $4)
       ON CONFLICT (id) DO NOTHING`,
      [
        user.id,
        user.email,
        user.email_confirmed_at ? true : false,
        user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
      ]
    );

    // Ensure user has a subscription (default to free if not ultra user)
    const isUltraUser = user.email?.toLowerCase() === 'cosmiccreation106@gmail.com';
    const planType = isUltraUser ? 'ultra' : 'free';
    
    // Check if subscription exists
    const subCheck = await client.query(
      'SELECT id, plan_type FROM subscriptions WHERE user_id = $1',
      [user.id]
    );
    
    if (subCheck.rows.length === 0) {
      // Create subscription for user
      await client.query(
        `INSERT INTO subscriptions (user_id, plan_type, status, expires_at)
         VALUES ($1, $2, 'active', NULL)
         ON CONFLICT (user_id) DO NOTHING`,
        [user.id, planType]
      );
      console.log(`Created ${planType} subscription for ${user.email}`);
    } else if (isUltraUser && subCheck.rows[0].plan_type !== 'ultra') {
      // Upgrade ultra user if not already ultra
      await client.query(
        `UPDATE subscriptions SET plan_type = 'ultra', status = 'active' WHERE user_id = $1`,
        [user.id]
      );
      console.log(`Upgraded subscription to ultra for ${user.email}`);
    }

    console.log(`Synced user ${user.id} to database, subscription: ${subCheck.rows[0]?.plan_type || planType}`);
  } catch (error) {
    console.error('Error syncing user:', error);
  } finally {
    client.release();
  }
}
