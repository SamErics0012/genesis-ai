DO $$
DECLARE
  v_user_email TEXT := 'cosmiccreation106@gmail.com';
  v_user_id TEXT;
BEGIN
  -- 1. Try to find user in public.user (case insensitive)
  SELECT id INTO v_user_id FROM "user" WHERE LOWER(email) = LOWER(v_user_email);

  -- 2. If not found in public.user, try to find in auth.users
  IF v_user_id IS NULL THEN
    SELECT id::text INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(v_user_email);
    
    IF v_user_id IS NOT NULL THEN
      RAISE NOTICE 'Found user in auth.users (ID: %). Syncing to public.user...', v_user_id;
      
      INSERT INTO "user" (id, email, name, "emailVerified", "createdAt", "updatedAt", display_name)
      VALUES (
        v_user_id, 
        v_user_email, 
        'Cosmic User', 
        true, 
        NOW(), 
        NOW(), 
        'Cosmic User'
      ) ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;

  -- 3. If we have a user ID now, update the subscription to ULTRA
  IF v_user_id IS NOT NULL THEN
    INSERT INTO subscriptions (user_id, plan_type, status, expires_at)
    VALUES (v_user_id, 'ultra', 'active', NULL)
    ON CONFLICT (user_id) 
    DO UPDATE SET plan_type = 'ultra', status = 'active', expires_at = NULL;
    
    RAISE NOTICE 'SUCCESS: Updated subscription for % (ID: %) to ULTRA', v_user_email, v_user_id;
  ELSE
    RAISE NOTICE 'ERROR: User % not found in auth.users or public.user', v_user_email;
  END IF;
END $$;
