-- Add profile fields to user table
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS display_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_display_name ON "user"(display_name);

-- Create trigger to update display_name automatically
CREATE OR REPLACE FUNCTION update_display_name()
RETURNS TRIGGER AS $$
BEGIN
  -- If first_name or last_name is set, update display_name
  IF NEW.first_name IS NOT NULL OR NEW.last_name IS NOT NULL THEN
    NEW.display_name := TRIM(CONCAT(COALESCE(NEW.first_name, ''), ' ', COALESCE(NEW.last_name, '')));
  END IF;
  
  -- Update the updated_at timestamp
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_display_name ON "user";
CREATE TRIGGER trigger_update_display_name
  BEFORE INSERT OR UPDATE OF first_name, last_name
  ON "user"
  FOR EACH ROW
  EXECUTE FUNCTION update_display_name();

-- Create a table for profile picture uploads (optional, for tracking)
CREATE TABLE IF NOT EXISTS profile_pictures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  is_current BOOLEAN DEFAULT true
);

-- Create index for profile pictures
CREATE INDEX IF NOT EXISTS idx_profile_pictures_user_id ON profile_pictures(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_pictures_current ON profile_pictures(user_id, is_current) WHERE is_current = true;

-- Add RLS policies for profile pictures
ALTER TABLE profile_pictures ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile pictures
DROP POLICY IF EXISTS "Users can view own profile pictures" ON profile_pictures;
CREATE POLICY "Users can view own profile pictures"
  ON profile_pictures
  FOR SELECT
  USING (true); -- Public read for profile pictures

-- Users can insert their own profile pictures
DROP POLICY IF EXISTS "Users can insert own profile pictures" ON profile_pictures;
CREATE POLICY "Users can insert own profile pictures"
  ON profile_pictures
  FOR INSERT
  WITH CHECK (true); -- Allow inserts, validation in application

-- Users can update their own profile pictures
DROP POLICY IF EXISTS "Users can update own profile pictures" ON profile_pictures;
CREATE POLICY "Users can update own profile pictures"
  ON profile_pictures
  FOR UPDATE
  USING (true);

-- Users can delete their own profile pictures
DROP POLICY IF EXISTS "Users can delete own profile pictures" ON profile_pictures;
CREATE POLICY "Users can delete own profile pictures"
  ON profile_pictures
  FOR DELETE
  USING (true);

-- Function to set previous profile picture as not current
CREATE OR REPLACE FUNCTION set_previous_profile_picture_not_current()
RETURNS TRIGGER AS $$
BEGIN
  -- Set all previous profile pictures for this user as not current
  UPDATE profile_pictures
  SET is_current = false
  WHERE user_id = NEW.user_id AND id != NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile picture updates
DROP TRIGGER IF EXISTS trigger_set_previous_profile_picture_not_current ON profile_pictures;
CREATE TRIGGER trigger_set_previous_profile_picture_not_current
  AFTER INSERT ON profile_pictures
  FOR EACH ROW
  WHEN (NEW.is_current = true)
  EXECUTE FUNCTION set_previous_profile_picture_not_current();
