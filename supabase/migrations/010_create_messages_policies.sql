-- Messages Policies
DROP POLICY IF EXISTS "Users can read messages from their conversations" ON messages;
CREATE POLICY "Users can read messages from their conversations"
ON messages FOR SELECT
TO authenticated
USING (
    conversation_id IN (
        SELECT id FROM conversations 
        WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can insert messages to their conversations" ON messages;
CREATE POLICY "Users can insert messages to their conversations"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id AND
    conversation_id IN (
        SELECT id FROM conversations 
        WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Allow users to update their own messages" ON messages;
CREATE POLICY "Allow users to update their own messages"
ON messages FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to delete their own messages" ON messages;
CREATE POLICY "Allow users to delete their own messages"
ON messages FOR DELETE
TO authenticated
USING (auth.uid() = user_id);