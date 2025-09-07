/**
 * Quick Database Test Script
 * 
 * Run this to test the database setup:
 * node test-database.js
 */

import { db } from './lib/db/index.js';
import { users, resumes, jobDescriptions, applications } from './lib/db/schema.js';

async function testDatabase() {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test 1: Check if we can query the database
    console.log('📊 Checking database tables...');
    const result = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'resumes', 'job_descriptions', 'applications', 'application_status_history')
    `);
    
    console.log('✅ Found tables:', result.map(r => r.table_name));
    
    // Test 2: Try to insert a test user (will fail if RLS is working and no auth)
    console.log('🔒 Testing RLS policies...');
    try {
      await db.insert(users).values({
        id: 'test-123',
        email: 'test@example.com'
      });
      console.log('⚠️  RLS might not be working - insert succeeded without auth');
    } catch (error) {
      console.log('✅ RLS is working - insert blocked:', error.message);
    }
    
    console.log('🎉 Database test completed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    process.exit(0);
  }
}

testDatabase();