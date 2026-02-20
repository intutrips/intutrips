-- Add RLS policies for admin CRUD on destinations
CREATE POLICY "Enable insert for authenticated users" ON destinations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON destinations
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON destinations
  FOR DELETE TO authenticated
  USING (true);

-- Add RLS policies for admin CRUD on guides
CREATE POLICY "Enable insert for authenticated users" ON guides
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON guides
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON guides
  FOR DELETE TO authenticated
  USING (true);

-- Add RLS policies for admin CRUD on testimonials
CREATE POLICY "Enable insert for authenticated users" ON testimonials
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON testimonials
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON testimonials
  FOR DELETE TO authenticated
  USING (true);

-- Add RLS policies for admin CRUD on contact_requests
CREATE POLICY "Enable update for authenticated users" ON contact_requests
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON contact_requests
  FOR DELETE TO authenticated
  USING (true);
