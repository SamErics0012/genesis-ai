-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own images" ON generated_images;
DROP POLICY IF EXISTS "Users can insert own images" ON generated_images;
DROP POLICY IF EXISTS "Users can delete own images" ON generated_images;

-- Disable RLS temporarily (since we're using Better Auth, not Supabase Auth)
ALTER TABLE generated_images DISABLE ROW LEVEL SECURITY;

-- Note: Security is handled by Better Auth at the application level
-- The user_id field ensures data isolation
-- RLS can be re-enabled later when integrating Better Auth with Supabase Auth
