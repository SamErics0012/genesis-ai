-- Create generated_images table
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id ON generated_images(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON generated_images(created_at DESC);

-- Enable Row Level Security
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own images
CREATE POLICY "Users can view own images"
  ON generated_images
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Create policy: Users can insert their own images
CREATE POLICY "Users can insert own images"
  ON generated_images
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Create policy: Users can delete their own images
CREATE POLICY "Users can delete own images"
  ON generated_images
  FOR DELETE
  USING (auth.uid()::text = user_id);
