import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testProfileUpdate() {
  const userId = 'TrBLsWzHIXyOx9K6AzbMxe85UB8E3P7e';
  
  try {
    // First, check current data
    console.log('Checking current user data...');
    const checkQuery = 'SELECT id, email, name, display_name, first_name, last_name FROM "user" WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [userId]);
    console.log('Current data:', checkResult.rows[0]);
    
    // Update display name
    console.log('\nUpdating display name to "Gautam"...');
    const updateQuery = `
      UPDATE "user"
      SET display_name = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, name, display_name, first_name, last_name
    `;
    const updateResult = await pool.query(updateQuery, ['Gautam', userId]);
    console.log('Updated data:', updateResult.rows[0]);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

testProfileUpdate();
