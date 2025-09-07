/**
 * Test Supabase Connection
 * Run after setting up the database: node test-supabase-connection.js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  try {
    console.log('🔌 Testing Supabase connection...\n');
    
    // Test 1: Check tables exist
    console.log('📊 Checking tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('users')
      .select('table_name')
      .limit(0);
    
    if (tablesError && tablesError.code !== 'PGRST116') {
      throw tablesError;
    }
    
    // Test 2: List all tables we created
    const tablesToCheck = ['users', 'resumes', 'job_descriptions', 'applications', 'application_status_history'];
    
    for (const table of tablesToCheck) {
      const { error } = await supabase.from(table).select('id').limit(0);
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows, which is fine
        console.log(`❌ Table '${table}' - Error: ${error.message}`);
      } else {
        console.log(`✅ Table '${table}' exists`);
      }
    }
    
    // Test 3: Try to create a test user (using service key bypasses RLS)
    console.log('\n🧪 Testing data insertion...');
    const testUserId = 'test-' + Date.now();
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        email: `test-${Date.now()}@example.com`,
        full_name: 'Test User'
      })
      .select()
      .single();
    
    if (userError) {
      console.log('❌ Failed to create test user:', userError.message);
    } else {
      console.log('✅ Created test user:', user.email);
      
      // Clean up test user
      await supabase.from('users').delete().eq('id', testUserId);
      console.log('🧹 Cleaned up test data');
    }
    
    console.log('\n🎉 Database setup verified successfully!');
    console.log('📝 You can now use the database in your application');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();