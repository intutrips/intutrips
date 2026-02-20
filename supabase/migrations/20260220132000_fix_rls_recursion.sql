-- Fix infinite recursion by creating a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- Drop recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage countries" ON countries;

-- Recreate policies using the non-recursive function
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  public.is_admin()
);

CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  public.is_admin()
);

CREATE POLICY "Admins can manage countries" ON countries FOR ALL USING (
  public.is_admin()
);
