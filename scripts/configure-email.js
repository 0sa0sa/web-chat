#!/usr/bin/env node
/**
 * Supabase Email Template Configuration Script
 * Deploys email templates via Management API (email templates only)
 * 
 * Usage:
 *   node scripts/configure-email.js
 * 
 * Environment Variables:
 *   SUPABASE_ACCESS_TOKEN - Supabase Management API token
 *   SUPABASE_PROJECT_ID - Project ID
 *   SUPABASE_PROJECT_REF - Project reference (optional, extracted from URL if not provided)
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Email templates configuration
const EMAIL_TEMPLATES = {
  confirmation: {
    subject: '【チャットアプリ】メールアドレスの確認',
    content_path: '../supabase/templates/confirmation.html'
  },
  recovery: {
    subject: '【チャットアプリ】パスワードリセットのご案内',
    content_path: '../supabase/templates/recovery.html'
  },
  magic_link: {
    subject: '【チャットアプリ】ログインリンク',
    content_path: '../supabase/templates/magic_link.html'
  },
  invite: {
    subject: '【チャットアプリ】招待のお知らせ',
    content_path: '../supabase/templates/invite.html'
  },
  email_change: {
    subject: '【チャットアプリ】メールアドレス変更の確認',
    content_path: '../supabase/templates/email_change.html'
  }
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

function loadTemplate(templatePath) {
  try {
    const fullPath = join(__dirname, templatePath);
    return readFileSync(fullPath, 'utf8');
  } catch (error) {
    console.error(`❌ Failed to load template: ${templatePath}`);
    throw error;
  }
}

async function updateEmailTemplates() {
  console.log('📧 Updating all email templates...');
  
  try {
    // Build the template update payload
    const templateData = {};
    
    for (const [templateName, config] of Object.entries(EMAIL_TEMPLATES)) {
      console.log(`   Loading ${templateName} template...`);
      const content = loadTemplate(config.content_path);
      
      // Map template names to API field names
      templateData[`mailer_subjects_${templateName}`] = config.subject;
      templateData[`mailer_templates_${templateName}_content`] = content;
    }

    // Update via auth config endpoint
    await makeRequest('/config/auth', 'PATCH', templateData);
    console.log('✅ All email templates updated successfully');
  } catch (error) {
    console.error('❌ Failed to update email templates:', error.message);
    throw error;
  }
}

async function verifyEmailTemplates() {
  console.log('🔍 Verifying email templates...');
  
  try {
    // Check if all template files exist
    for (const [templateName, config] of Object.entries(EMAIL_TEMPLATES)) {
      try {
        loadTemplate(config.content_path);
        console.log(`✅ Template file found: ${templateName}`);
      } catch (error) {
        console.error(`❌ Template file missing: ${templateName}`);
        throw error;
      }
    }
    
    console.log('✅ All email templates verified');
  } catch (error) {
    console.error('❌ Failed to verify email templates:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Supabase Email template configuration...');
  console.log(`   Project: ${projectRef}`);
  console.log(`   Templates: ${Object.keys(EMAIL_TEMPLATES).join(', ')}`);
  console.log('');

  try {
    // Verify template files exist
    await verifyEmailTemplates();
    console.log('');

    // Update email templates
    await updateEmailTemplates();
    console.log('');

    console.log('🎉 Supabase Email template configuration completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Test email sending in Supabase Dashboard');
    console.log('   2. Configure auth settings using npm run configure:auth');
    console.log('   3. Test user signup and password reset flows');
    console.log('   4. Customize SMTP settings if needed');

  } catch (error) {
    console.error('❌ Email template configuration failed:', error.message);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   1. Check your SUPABASE_ACCESS_TOKEN is valid');
    console.error('   2. Verify project permissions');
    console.error('   3. Ensure all template files exist in supabase/templates/');
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