#!/usr/bin/env node
/**
 * Test User Creation Script
 * Creates test users for chat application development
 * 
 * Usage:
 *   node scripts/create-test-users.js
 * 
 * Environment Variables Required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('');
  console.error('Make sure these are set in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test users to create
const testUsers = [
  {
    email: 'osaosajob+3@gmail.com',
    password: 'password123',
    display_name: 'Alice Smith',
    description: 'Product Manager' 
  },
  {
    email: 'osaosajob+4@gmail.com', 
    password: 'password123',
    display_name: 'Bob Johnson',
    description: 'Software Engineer'
  },
  {
    email: 'osaosajob+5@gmail.com',
    password: 'password123', 
    display_name: 'Charlie Brown',
    description: 'UX Designer'
  },
  {
    email: 'osaosajob+6@gmail.com',
    password: 'password123',
    display_name: 'Diana Prince',
    description: 'Marketing Lead'
  },
  {
    email: 'osaosajob+7@gmail.com',
    password: 'password123',
    display_name: 'Eve Wilson',
    description: 'Data Analyst'
  }
];

async function createTestUser(user) {
  console.log(`Creating user: ${user.email}...`);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          display_name: user.display_name,
          description: user.description
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`⚠️  User ${user.email} already exists`);
        return { success: true, existed: true };
      } else {
        console.error(`❌ Error creating ${user.email}:`, error.message);
        return { success: false, error: error.message };
      }
    }

    console.log(`✅ Successfully created ${user.email}`);
    console.log(`   Display Name: ${user.display_name}`);
    console.log(`   User ID: ${data.user?.id}`);
    console.log('');
    
    return { success: true, existed: false, data };
  } catch (err) {
    console.error(`❌ Unexpected error creating ${user.email}:`, err);
    return { success: false, error: err.message };
  }
}

async function createAllTestUsers() {
  console.log('🚀 Creating test users for chat application...\n');
  
  const results = {
    created: 0,
    existed: 0,
    failed: 0,
    total: testUsers.length
  };

  for (const user of testUsers) {
    const result = await createTestUser(user);
    
    if (result.success) {
      if (result.existed) {
        results.existed++;
      } else {
        results.created++;
      }
    } else {
      results.failed++;
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('📊 SUMMARY:');
  console.log(`   Total users: ${results.total}`);
  console.log(`   ✅ Created: ${results.created}`);
  console.log(`   ⚠️  Already existed: ${results.existed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log('');

  if (results.created > 0 || results.existed > 0) {
    console.log('🎉 Test users are ready!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Run the seed.sql script in Supabase Dashboard');
    console.log('   2. User profiles will be automatically created');
    console.log('   3. Start testing the chat functionality');
    console.log('');
    console.log('🔑 Test user credentials:');
    testUsers.forEach(user => {
      console.log(`   ${user.email} / password123`);
    });
  } else {
    console.log('❌ No users were created successfully');
  }
}

async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && !error.message.includes('session_not_found')) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔧 Testing Supabase connection...');
  
  const connected = await checkSupabaseConnection();
  if (!connected) {
    process.exit(1);
  }
  
  console.log('');
  await createAllTestUsers();
}

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the script
main().catch(console.error);