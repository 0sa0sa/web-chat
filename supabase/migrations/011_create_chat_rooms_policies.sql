-- Chat Rooms Policies (for future use)
DROP POLICY IF EXISTS "Allow authenticated users to read chat rooms" ON chat_rooms;
CREATE POLICY "Allow authenticated users to read chat rooms"
ON chat_rooms FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to create chat rooms" ON chat_rooms;
CREATE POLICY "Allow authenticated users to create chat rooms"
ON chat_rooms FOR INSERT
TO authenticated
WITH CHECK (true);