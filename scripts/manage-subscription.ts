import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

interface SubscriptionOptions {
  userId: string;
  planType: 'free' | 'premium' | 'ultra';
  status?: 'active' | 'inactive' | 'cancelled';
  expiresAt?: Date;
}

class SubscriptionManager {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async upgradeUser(options: SubscriptionOptions): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      const { userId, planType, status = 'active' } = options;
      
      // Auto-set 30-day expiration for paid plans
      let expiresAt = options.expiresAt;
      if (planType !== 'free' && !expiresAt) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now
      }
      
      console.log(`🔄 Upgrading user ${userId} to ${planType} plan...`);

      // Check if user exists
      const userCheck = await client.query('SELECT id FROM "user" WHERE id = $1', [userId]);
      if (userCheck.rows.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Upsert subscription
      const query = `
        INSERT INTO subscriptions (user_id, plan_type, status, expires_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          plan_type = EXCLUDED.plan_type,
          status = EXCLUDED.status,
          expires_at = EXCLUDED.expires_at,
          updated_at = NOW()
        RETURNING *;
      `;

      const result = await client.query(query, [userId, planType, status, expiresAt]);
      
      console.log(`✅ Successfully upgraded user ${userId}:`);
      console.log(`   Plan: ${result.rows[0].plan_type}`);
      console.log(`   Status: ${result.rows[0].status}`);
      console.log(`   Expires: ${result.rows[0].expires_at || 'Never'}`);
      
      if (planType !== 'free') {
        console.log(`   📅 Auto-expires in 30 days: ${expiresAt?.toDateString()}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to upgrade user ${options.userId}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async revokeUser(userId: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      console.log(`🔄 Revoking subscription for user ${userId}...`);

      const query = `
        UPDATE subscriptions 
        SET plan_type = 'free', status = 'cancelled', updated_at = NOW()
        WHERE user_id = $1
        RETURNING *;
      `;

      const result = await client.query(query, [userId]);
      
      if (result.rows.length === 0) {
        throw new Error(`No subscription found for user ${userId}`);
      }

      console.log(`✅ Successfully revoked subscription for user ${userId}`);
      console.log(`   Plan: ${result.rows[0].plan_type}`);
      console.log(`   Status: ${result.rows[0].status}`);
      
    } catch (error) {
      console.error(`❌ Failed to revoke subscription for user ${userId}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserSubscription(userId: string): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      const query = `
        SELECT s.*, u.email, u.name 
        FROM subscriptions s
        JOIN "user" u ON s.user_id = u.id
        WHERE s.user_id = $1;
      `;

      const result = await client.query(query, [userId]);
      
      if (result.rows.length === 0) {
        console.log(`❌ No subscription found for user ${userId}`);
        return null;
      }

      const subscription = result.rows[0];
      console.log(`📋 Subscription details for user ${userId}:`);
      console.log(`   Email: ${subscription.email}`);
      console.log(`   Name: ${subscription.name || 'N/A'}`);
      console.log(`   Plan: ${subscription.plan_type}`);
      console.log(`   Status: ${subscription.status}`);
      console.log(`   Created: ${subscription.created_at}`);
      console.log(`   Updated: ${subscription.updated_at}`);
      console.log(`   Expires: ${subscription.expires_at || 'Never'}`);

      return subscription;
      
    } catch (error) {
      console.error(`❌ Failed to get subscription for user ${userId}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async listAllSubscriptions(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      const query = `
        SELECT s.*, u.email, u.name 
        FROM subscriptions s
        JOIN "user" u ON s.user_id = u.id
        ORDER BY s.updated_at DESC;
      `;

      const result = await client.query(query);
      
      console.log(`📊 Found ${result.rows.length} subscriptions:`);
      console.log('─'.repeat(80));
      
      result.rows.forEach((sub, index) => {
        console.log(`${index + 1}. ${sub.email} (${sub.name || 'No name'})`);
        console.log(`   Plan: ${sub.plan_type} | Status: ${sub.status}`);
        console.log(`   User ID: ${sub.user_id}`);
        console.log(`   Expires: ${sub.expires_at || 'Never'}`);
        console.log('─'.repeat(40));
      });
      
    } catch (error) {
      console.error(`❌ Failed to list subscriptions:`, error);
      throw error;
    } finally {
      client.release();
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log(`
🔧 Subscription Management Tool

Usage:
  npm run manage-subscription <command> [options]

Commands:
  upgrade <userId> <plan> [expires]  - Upgrade user to premium/ultra
  revoke <userId>                    - Revoke user subscription (set to free)
  get <userId>                       - Get user subscription details
  list                               - List all subscriptions

Examples:
  npm run manage-subscription upgrade user123 premium
  npm run manage-subscription upgrade user123 ultra "2024-12-31"
  npm run manage-subscription revoke user123
  npm run manage-subscription get user123
  npm run manage-subscription list
    `);
    process.exit(0);
  }

  const manager = new SubscriptionManager(pool);

  try {
    switch (command) {
      case 'upgrade': {
        const userId = args[1];
        const planType = args[2] as 'premium' | 'ultra';
        const expiresAt = args[3] ? new Date(args[3]) : undefined;

        if (!userId || !planType) {
          console.error('❌ Usage: upgrade <userId> <plan> [expires]');
          process.exit(1);
        }

        if (!['premium', 'ultra'].includes(planType)) {
          console.error('❌ Plan must be "premium" or "ultra"');
          process.exit(1);
        }

        await manager.upgradeUser({ userId, planType, expiresAt });
        break;
      }

      case 'revoke': {
        const userId = args[1];
        if (!userId) {
          console.error('❌ Usage: revoke <userId>');
          process.exit(1);
        }
        await manager.revokeUser(userId);
        break;
      }

      case 'get': {
        const userId = args[1];
        if (!userId) {
          console.error('❌ Usage: get <userId>');
          process.exit(1);
        }
        await manager.getUserSubscription(userId);
        break;
      }

      case 'list': {
        await manager.listAllSubscriptions();
        break;
      }

      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }

  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
