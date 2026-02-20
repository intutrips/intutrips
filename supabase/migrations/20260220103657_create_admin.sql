-- Create admin user manually
-- This SQL will create the admin user and profile

-- First, let's create the auth user manually
-- Note: This requires service role key and should be done via dashboard or API

-- For now, let's create a function to check if user exists and create profile
CREATE OR REPLACE FUNCTION public.create_admin_profile()
RETURNS void AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Try to find the user by email
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'wfss1982@gmail.com' 
  LIMIT 1;
  
  -- If user exists, create/update profile
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (admin_user_id, 'wfss1982@gmail.com', 'Admin User', 'admin')
    ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      updated_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function
SELECT public.create_admin_profile();

-- Clean up the function
DROP FUNCTION IF EXISTS public.create_admin_profile();
