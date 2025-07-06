-- Cleanup script to remove conflicting objects from old migrations
-- Run this BEFORE running the new migration files if you have existing objects

-- Drop old triggers
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
DROP TRIGGER IF EXISTS update_conversation_on_message ON messages;

-- Drop old functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS get_or_create_conversation(UUID, UUID);
DROP FUNCTION IF EXISTS create_user_profile();
DROP FUNCTION IF EXISTS update_conversation_timestamp();

-- Note: Tables, policies, and realtime settings will be handled by IF NOT EXISTS or DROP/CREATE patterns