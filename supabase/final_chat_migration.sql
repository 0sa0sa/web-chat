-- ========================================
-- FINAL CHAT MIGRATION SCRIPT
-- Complete database setup for 1-on-1 chat functionality
-- This file consolidates all SQL migrations into a single, production-ready script
-- ========================================

-- ----------------------------------------
-- CLEANUP: Remove old migrations if they exist
-- ----------------------------------------
BEGIN;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
DROP TRIGGER IF EXISTS update_conversation_on_message ON messages;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS get_or_create_conversation(UUID, UUID);
DROP FUNCTION IF EXISTS create_user_profile();
DROP FUNCTION IF EXISTS update_conversation_timestamp();

-- Drop existing tables (CASCADE to handle dependencies)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chat_rooms CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

COMMIT;

-- ----------------------------------------
-- TABLES: Create core schema
-- ----------------------------------------
BEGIN;

-- User profiles table - extends auth.users with additional profile info
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table - handles 1-on-1 chat rooms
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant1_id, participant2_id),
    CONSTRAINT check_different_participants CHECK (participant1_id != participant2_id)
);

-- Add foreign key constraints to user_profiles for PostgREST relationships
ALTER TABLE conversations 
ADD CONSTRAINT conversations_participant1_profile_fkey 
FOREIGN KEY (participant1_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE conversations 
ADD CONSTRAINT conversations_participant2_profile_fkey 
FOREIGN KEY (participant2_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Messages table - stores chat messages
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat rooms table - for future group chat functionality
CREATE TABLE chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMIT;

-- ----------------------------------------
-- INDEXES: Optimize query performance
-- ----------------------------------------
BEGIN;

-- User profiles indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Conversations indexes
CREATE INDEX idx_conversations_participants ON conversations(participant1_id, participant2_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX idx_conversations_participant2 ON conversations(participant2_id);

-- Messages indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at DESC);

COMMIT;

-- ----------------------------------------
-- FUNCTIONS: Business logic
-- ----------------------------------------
BEGIN;

-- Generic function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to ensure consistent participant ordering and get/create conversation
CREATE OR REPLACE FUNCTION get_or_create_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID AS $$
DECLARE
    conversation_id UUID;
    p1_id UUID;
    p2_id UUID;
BEGIN
    -- Ensure consistent ordering (smaller UUID first)
    IF user1_id < user2_id THEN
        p1_id := user1_id;
        p2_id := user2_id;
    ELSE
        p1_id := user2_id;
        p2_id := user1_id;
    END IF;
    
    -- Try to find existing conversation
    SELECT id INTO conversation_id
    FROM conversations
    WHERE participant1_id = p1_id AND participant2_id = p2_id;
    
    -- If not found, create new conversation
    IF conversation_id IS NULL THEN
        INSERT INTO conversations (participant1_id, participant2_id)
        VALUES (p1_id, p2_id)
        RETURNING id INTO conversation_id;
    END IF;
    
    RETURN conversation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, display_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update conversation timestamp when message is sent
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- ----------------------------------------
-- TRIGGERS: Automated processes
-- ----------------------------------------
BEGIN;

-- Update timestamps automatically
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile when user signs up
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- Update conversation timestamp when new message is sent
CREATE TRIGGER update_conversation_on_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

COMMIT;

-- ----------------------------------------
-- SECURITY: Row Level Security (RLS)
-- ----------------------------------------
BEGIN;

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON conversations FOR SELECT 
    USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT 
    WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- Messages policies
CREATE POLICY "Users can view messages from their conversations" ON messages FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert messages to their conversations" ON messages FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own messages" ON messages FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" ON messages FOR DELETE 
    USING (auth.uid() = user_id);

-- Chat rooms policies (basic - for future expansion)
CREATE POLICY "Users can view all chat rooms" ON chat_rooms FOR SELECT USING (true);
CREATE POLICY "Users can create chat rooms" ON chat_rooms FOR INSERT WITH CHECK (true);

COMMIT;

-- ----------------------------------------
-- REALTIME: Enable real-time subscriptions
-- ----------------------------------------
BEGIN;

-- Add all tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;

COMMIT;

-- ----------------------------------------
-- SEED DATA: Create profiles for existing users
-- ----------------------------------------
BEGIN;

-- Create user profiles for any existing auth.users
INSERT INTO user_profiles (id, email, display_name)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'display_name', split_part(au.email, '@', 1)) as display_name
FROM auth.users au
WHERE au.id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- ----------------------------------------
-- VERIFICATION: Check migration success
-- ----------------------------------------
DO $$
DECLARE
    table_count INTEGER;
    function_count INTEGER;
    trigger_count INTEGER;
    policy_count INTEGER;
    user_profile_count INTEGER;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('user_profiles', 'conversations', 'messages', 'chat_rooms');
    
    -- Count functions
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name IN ('update_updated_at_column', 'get_or_create_conversation', 'create_user_profile', 'update_conversation_timestamp');
    
    -- Count triggers
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers 
    WHERE trigger_schema = 'public';
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    -- Count user profiles
    SELECT COUNT(*) INTO user_profile_count
    FROM user_profiles;
    
    -- Report results
    RAISE NOTICE '=== MIGRATION VERIFICATION ===';
    RAISE NOTICE 'Tables created: % (expected: 4)', table_count;
    RAISE NOTICE 'Functions created: % (expected: 4)', function_count;
    RAISE NOTICE 'Triggers created: % (expected: 4)', trigger_count;
    RAISE NOTICE 'Policies created: % (expected: 11)', policy_count;
    RAISE NOTICE 'User profiles seeded: %', user_profile_count;
    
    IF table_count = 4 AND function_count = 4 AND trigger_count = 4 AND policy_count = 11 THEN
        RAISE NOTICE '✅ MIGRATION COMPLETED SUCCESSFULLY!';
    ELSE
        RAISE NOTICE '❌ MIGRATION INCOMPLETE - Please check the logs above';
    END IF;
END $$;

-- ----------------------------------------
-- FINAL STATUS
-- ----------------------------------------
SELECT 
    'Chat database migration completed successfully!' as status,
    'Ready for 1-on-1 chat functionality with real-time updates' as description,
    NOW() as completed_at;