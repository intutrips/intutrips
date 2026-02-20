-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE CHECK (length(code) = 2),
  description TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Create policies for countries
-- Admins can do everything
CREATE POLICY "Admins can manage countries" ON countries FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Public can read countries
CREATE POLICY "Enable read access for all users" ON countries FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_countries_name ON countries(name);
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_countries_featured ON countries(featured);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_countries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER update_countries_updated_at
  BEFORE UPDATE ON public.countries
  FOR EACH ROW EXECUTE FUNCTION public.update_countries_updated_at();