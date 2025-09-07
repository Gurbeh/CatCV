/**
 * RLS Policy Application Script
 * 
 * This script applies Row Level Security policies to the database.
 * Run this after running the initial migration.
 * 
 * Usage:
 * npx tsx lib/db/apply-rls.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { client } from './index';

async function applyRLSPolicies() {
  try {
    console.log('🔒 Applying Row Level Security policies...');

    // Read the RLS policies SQL file
    const rlsSQL = readFileSync(join(__dirname, 'rls-policies.sql'), 'utf-8');

    // Split into individual statements (basic split on semicolon + newline)
    const statements = rlsSQL
      .split(';\n')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          await client.unsafe(statement + ';');
          console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
        } catch (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error);
          console.error('Statement:', statement);
        }
      }
    }

    console.log('🎉 RLS policies applied successfully!');

  } catch (error) {
    console.error('❌ Failed to apply RLS policies:', error);
  } finally {
    await client.end();
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  applyRLSPolicies();
}