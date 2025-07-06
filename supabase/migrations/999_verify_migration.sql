-- Verify migration completed successfully
-- This script checks that all tables, functions, and policies are in place

-- Check tables exist
SELECT 
    'user_profiles' as table_name, 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') 
         THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'conversations' as table_name, 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversations') 
         THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'messages' as table_name, 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') 
         THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'chat_rooms' as table_name, 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_rooms') 
         THEN 'EXISTS' ELSE 'MISSING' END as status;

-- Check functions exist
SELECT 
    routine_name as function_name,
    'EXISTS' as status
FROM information_schema.routines 
WHERE routine_type = 'FUNCTION' 
  AND routine_name IN (
    'update_updated_at_column',
    'get_or_create_conversation', 
    'create_user_profile',
    'update_conversation_timestamp'
  );

-- Check RLS is enabled
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE t.tablename IN ('user_profiles', 'conversations', 'messages', 'chat_rooms')
  AND t.schemaname = 'public';

-- Count existing data
SELECT 
    'user_profiles' as table_name, 
    count(*) as row_count 
FROM user_profiles
UNION ALL
SELECT 
    'conversations' as table_name, 
    count(*) as row_count 
FROM conversations
UNION ALL
SELECT 
    'messages' as table_name, 
    count(*) as row_count 
FROM messages
UNION ALL
SELECT 
    'chat_rooms' as table_name, 
    count(*) as row_count 
FROM chat_rooms;