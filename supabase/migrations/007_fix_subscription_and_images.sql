-- Ensure generated_images table exists with correct schema
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id ON generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON generated_images(created_at DESC);

-- Ensure subscriptions table exists
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'premium', 'ultra')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id)
);

-- Fix subscription for Cosmiccreation106@gmail.com
DO $$
DECLARE
  v_user_id TEXT;
  v_email TEXT := 'Cosmiccreation106@gmail.com';
BEGIN
  -- Check if user exists in public.user
  SELECT id INTO v_user_id FROM "user" WHERE email = v_email;
  
  IF v_user_id IS NOT NULL THEN
    -- Upsert premium subscription
    INSERT INTO subscriptions (user_id, plan_type, status)
    VALUES (v_user_id, 'premium', 'active')
    ON CONFLICT (user_id) 
    DO UPDATE SET plan_type = 'premium', status = 'active';
    
    RAISE NOTICE 'Updated subscription for %', v_email;
  ELSE
    RAISE NOTICE 'User % not found in public.user table', v_email;
  END IF;
END $$;
