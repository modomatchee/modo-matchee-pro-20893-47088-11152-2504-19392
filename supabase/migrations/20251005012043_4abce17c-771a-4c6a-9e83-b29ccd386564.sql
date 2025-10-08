-- Fix 1: Update profiles table RLS policy to prevent public data exposure
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Fix 2: Add missing DELETE and UPDATE policies for medication_logs
CREATE POLICY "Users can delete their own medication logs"
ON medication_logs FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own medication logs"
ON medication_logs FOR UPDATE
USING (auth.uid() = user_id);

-- Fix 3: Add DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile"
ON profiles FOR DELETE
USING (auth.uid() = user_id);