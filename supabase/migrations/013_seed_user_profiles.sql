-- Insert profiles for existing users (run this once)
INSERT INTO user_profiles (id, email, display_name)
SELECT 
    id, 
    email,
    COALESCE(raw_user_meta_data->>'display_name', split_part(email, '@', 1))
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;