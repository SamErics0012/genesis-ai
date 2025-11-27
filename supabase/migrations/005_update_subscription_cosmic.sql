-- Update subscription for Cosmiccreation106@gmail.com
DO $$
DECLARE
  target_user_id TEXT;
BEGIN
  -- Find user ID by email
  SELECT id INTO target_user_id FROM "user" WHERE email = 'Cosmiccreation106@gmail.com';

  IF target_user_id IS NOT NULL THEN
    -- Insert or update subscription
    INSERT INTO subscriptions (user_id, plan_type, status)
    VALUES (target_user_id, 'premium', 'active')
    ON CONFLICT (user_id)
    DO UPDATE SET plan_type = 'premium', status = 'active';
    
    RAISE NOTICE 'Updated subscription for user %', target_user_id;
  ELSE
    RAISE NOTICE 'User Cosmiccreation106@gmail.com not found';
  END IF;
END $$;
