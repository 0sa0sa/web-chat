#!/usr/bin/env node
/**
 * Supabase Auth Configuration Script
 * Deploys auth settings via Management API (auth config only)
 * 
 * Usage:
 *   node scripts/configure-auth.js
 * 
 * Environment Variables:
 *   SUPABASE_ACCESS_TOKEN - Supabase Management API token
 *   SUPABASE_PROJECT_ID - Project ID
 *   SUPABASE_PROJECT_REF - Project reference (optional, extracted from URL if not provided)
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || process.env.SUPABASE_PROJECT_ID;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Extract project ref from URL if not provided
let projectRef = SUPABASE_PROJECT_REF;
if (!projectRef && SUPABASE_URL) {
  const urlMatch = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (urlMatch) {
    projectRef = urlMatch[1];
    console.log(`📡 Extracted project ref from URL: ${projectRef}`);
  }
}

if (!SUPABASE_ACCESS_TOKEN) {
  console.error('❌ Error: SUPABASE_ACCESS_TOKEN is required');
  console.error('Please set your Supabase Management API token in environment variables');
  console.error('Get your token from: https://supabase.com/dashboard/account/tokens');
  process.exit(1);
}

if (!projectRef) {
  console.error('❌ Error: SUPABASE_PROJECT_REF or SUPABASE_PROJECT_ID is required');
  console.error('Please set your Supabase project reference in environment variables');
  process.exit(1);
}

const API_BASE = `https://api.supabase.com/v1/projects/${projectRef}`;

// Auth configuration
const AUTH_CONFIG = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  JWT_EXP: 3600,
  REFRESH_TOKEN_ROTATION_ENABLED: true,
  SECURITY_REFRESH_TOKEN_REUSE_INTERVAL: 10,
  EXTERNAL_EMAIL_ENABLED: true,
  EXTERNAL_ANONYMOUS_USERS_ENABLED: false,
  MAILER_AUTOCONFIRM: false,
  MAILER_SECURE_EMAIL_CHANGE_ENABLED: true,
  SMTP_ADMIN_EMAIL: 'noreply@your-domain.com',
  SMTP_HOST: '',
  SMTP_PORT: 587,
  SMTP_USER: '',
  SMTP_PASS: '',
  SMTP_SENDER_NAME: 'チャットアプリ'
};

async function makeRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error(`❌ Request failed: ${method} ${url}`);
    throw error;
  }
}

async function updateAuthConfig() {
  console.log('🔧 Updating auth configuration...');
  
  try {
    await makeRequest('/auth', 'PATCH', AUTH_CONFIG);
    console.log('✅ Auth configuration updated successfully');
  } catch (error) {
    console.error('❌ Failed to update auth configuration:', error.message);
    throw error;
  }
}

async function verifyAuthConfiguration() {
  console.log('🔍 Verifying auth configuration...');
  
  try {
    const authConfig = await makeRequest('/auth');
    console.log('✅ Auth configuration verified');
    console.log(`   Site URL: ${authConfig.SITE_URL}`);
    console.log(`   Email confirmations: ${authConfig.MAILER_AUTOCONFIRM ? 'Disabled' : 'Enabled'}`);
    console.log(`   Secure email change: ${authConfig.MAILER_SECURE_EMAIL_CHANGE_ENABLED ? 'Enabled' : 'Disabled'}`);
    console.log(`   JWT expiry: ${authConfig.JWT_EXP} seconds`);
  } catch (error) {
    console.error('❌ Failed to verify auth configuration:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Supabase Auth configuration...');
  console.log(`   Project: ${projectRef}`);
  console.log('');

  try {
    // Update auth configuration
    await updateAuthConfig();
    console.log('');

    // Verify configuration
    await verifyAuthConfiguration();
    console.log('');

    console.log('🎉 Supabase Auth configuration completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Configure email templates using npm run configure:email');
    console.log('   2. Update SMTP settings if using custom email provider');
    console.log('   3. Test user signup and password flows');

  } catch (error) {
    console.error('❌ Auth configuration failed:', error.message);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   1. Check your SUPABASE_ACCESS_TOKEN is valid');
    console.error('   2. Verify project permissions');
    console.error('   3. Ensure environment variables are set correctly');
    process.exit(1);
  }
}

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the script
main().catch(console.error);