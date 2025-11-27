DO $$
DECLARE
  col_name TEXT;
BEGIN
  RAISE NOTICE '--- DEBUGGING USER TABLE COLUMNS ---';
  FOR col_name IN 
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'user' AND table_schema = 'public'
  LOOP
    RAISE NOTICE 'Column: %', col_name;
  END LOOP;
  RAISE NOTICE '--- END DEBUGGING ---';
END $$;
