-- User Profiles Policies
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON user_profiles;
CREATE POLICY "Allow authenticated users to read profiles"
ON user_profiles FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile"
ON user_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);