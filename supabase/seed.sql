-- ========================================
-- SEED DATA FOR CHAT APPLICATION
-- Test data for development and demonstration
-- ========================================

-- ----------------------------------------
-- SEED: User Profiles
-- ----------------------------------------
-- Create user profiles for existing auth.users
-- This will sync any existing authenticated users with the user_profiles table
INSERT INTO user_profiles (id, email, display_name)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'display_name', split_part(au.email, '@', 1)) as display_name
FROM auth.users au
WHERE au.id IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    updated_at = NOW();

-- ----------------------------------------
-- SEED: Demo Users (for development)
-- ----------------------------------------
-- Note: These are example user profiles that would be created
-- when users sign up through authentication. In a real application,
-- these would be created automatically via the trigger function.

-- Example of what user profiles look like:
-- INSERT INTO user_profiles (id, email, display_name) VALUES
-- ('00000000-0000-0000-0000-000000000001', 'alice@example.com', 'Alice Smith'),
-- ('00000000-0000-0000-0000-000000000002', 'bob@example.com', 'Bob Johnson'),
-- ('00000000-0000-0000-0000-000000000003', 'charlie@example.com', 'Charlie Brown');

-- ----------------------------------------
-- SEED: Sample Conversations (for development)
-- ----------------------------------------
-- Note: These will only work if the demo users above exist in auth.users
-- Uncomment and modify the UUIDs to match real user IDs for testing

-- Example conversations:
-- INSERT INTO conversations (participant1_id, participant2_id) VALUES
-- ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
-- ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
-- ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003');

-- ----------------------------------------
-- SEED: Sample Messages (for development)
-- ----------------------------------------
-- Note: These will only work if conversations exist
-- Uncomment and modify to match real conversation IDs for testing

-- Example messages:
-- INSERT INTO messages (content, user_id, conversation_id) VALUES
-- ('Hello Bob! How are you?', '00000000-0000-0000-0000-000000000001', 'conversation-uuid-1'),
-- ('Hi Alice! I am doing great, thanks for asking!', '00000000-0000-0000-0000-000000000002', 'conversation-uuid-1'),
-- ('That sounds wonderful! What have you been up to?', '00000000-0000-0000-0000-000000000001', 'conversation-uuid-1'),
-- ('I have been working on a new project. Very exciting!', '00000000-0000-0000-0000-000000000002', 'conversation-uuid-1');

-- ----------------------------------------
-- SEED: Sample Chat Rooms (for future functionality)
-- ----------------------------------------
-- Basic chat rooms for future group chat functionality
INSERT INTO chat_rooms (name) VALUES
('General Discussion'),
('Tech Talk'),
('Random Chat'),
('Project Updates'),
('Help & Support')
ON CONFLICT DO NOTHING;

-- ----------------------------------------
-- VERIFICATION: Check seed data
-- ----------------------------------------
DO $$
DECLARE
    user_profiles_count INTEGER;
    conversations_count INTEGER;
    messages_count INTEGER;
    chat_rooms_count INTEGER;
BEGIN
    -- Count seeded data
    SELECT COUNT(*) INTO user_profiles_count FROM user_profiles;
    SELECT COUNT(*) INTO conversations_count FROM conversations;
    SELECT COUNT(*) INTO messages_count FROM messages;
    SELECT COUNT(*) INTO chat_rooms_count FROM chat_rooms;
    
    -- Report results
    RAISE NOTICE '=== SEED DATA VERIFICATION ===';
    RAISE NOTICE 'User profiles created: %', user_profiles_count;
    RAISE NOTICE 'Conversations created: %', conversations_count;
    RAISE NOTICE 'Messages created: %', messages_count;
    RAISE NOTICE 'Chat rooms created: %', chat_rooms_count;
    
    IF user_profiles_count > 0 THEN
        RAISE NOTICE 'User profiles seeded successfully!';
    ELSE
        RAISE NOTICE 'No user profiles found. Users need to sign up first.';
    END IF;
    
    IF chat_rooms_count > 0 THEN
        RAISE NOTICE 'Chat rooms seeded successfully!';
    ELSE
        RAISE NOTICE 'No chat rooms created.';
    END IF;
END $$;

-- ----------------------------------------
-- SEED COMPLETION MESSAGE
-- ----------------------------------------
SELECT 
    'Seed data applied successfully!' as status,
    'User profiles synced with auth.users' as user_profiles_status,
    'Sample chat rooms created' as chat_rooms_status,
    'Ready for development and testing' as ready_status,
    NOW() as seeded_at;