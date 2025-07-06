-- Enable Realtime for all tables (ignore errors if already added)
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
        WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
        WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
        WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
        WHEN OTHERS THEN NULL;
    END;
END $$;