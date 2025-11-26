CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  email_verified BOOLEAN,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  display_name VARCHAR(200),
  profile_picture_url TEXT,
  bio TEXT
);

INSERT INTO "user" (id, email, name, email_verified, created_at, updated_at, first_name, last_name, display_name)
VALUES (
  '83a15b07-e738-40fb-a8f9-b05a0b4a586e', 
  'demo@example.com', 
  'Demo User', 
  true, 
  NOW(), 
  NOW(),
  'Demo',
  'User',
  'Demo User'
)
ON CONFLICT (id) DO NOTHING;

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

INSERT INTO subscriptions (user_id, plan_type, status)
VALUES ('83a15b07-e738-40fb-a8f9-b05a0b4a586e', 'free', 'active')
ON CONFLICT (user_id) DO NOTHING;
