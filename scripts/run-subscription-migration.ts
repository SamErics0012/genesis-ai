import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runSubscriptionMigration() {
  const client = await pool.connect();
  
  try {
    console.log("🔄 Running subscription migration...");
    
    const migrationPath = path.resolve(__dirname, "../supabase/migrations/003_create_subscriptions_table.sql");
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    await client.query(sql);
    
    console.log("✅ Subscription table created successfully!");
    console.log("📋 Migration completed:");
    console.log("   - subscriptions table created");
    console.log("   - RLS policies applied");
    console.log("   - Indexes created");
    console.log("   - Triggers set up");
    console.log("   - Default free subscriptions added for existing users");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runSubscriptionMigration().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
