-- Create direct message conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant1_id, participant2_id),
    CONSTRAINT check_different_participants CHECK (participant1_id != participant2_id)
);

-- Add foreign key constraints to user_profiles for PostgREST relationships
-- Note: These depend on user_profiles table existing first
DO $$
BEGIN
    -- Add constraint for participant1_id -> user_profiles if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'conversations_participant1_profile_fkey'
    ) THEN
        ALTER TABLE conversations 
        ADD CONSTRAINT conversations_participant1_profile_fkey 
        FOREIGN KEY (participant1_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
    END IF;

    -- Add constraint for participant2_id -> user_profiles if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'conversations_participant2_profile_fkey'
    ) THEN
        ALTER TABLE conversations 
        ADD CONSTRAINT conversations_participant2_profile_fkey 
        FOREIGN KEY (participant2_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant1_id, participant2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON conversations(participant2_id);