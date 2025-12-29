-- Silver Spring Observatory Database Schema
-- Run this in your Supabase SQL Editor to set up the tables

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  designation VARCHAR(100) NOT NULL,
  name VARCHAR(200),
  category VARCHAR(50) NOT NULL,
  observatory VARCHAR(10) NOT NULL DEFAULT 'None',
  filters VARCHAR(100),
  description TEXT,
  image_path TEXT NOT NULL,
  thumbnail_path TEXT,
  date_captured DATE,
  exposure VARCHAR(100),
  technical_notes TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster category queries
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);
CREATE INDEX IF NOT EXISTS idx_images_featured ON images(featured);

-- Travel photos table (separate from astronomy images)
CREATE TABLE IF NOT EXISTS travel_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  location VARCHAR(200) NOT NULL,
  date DATE,
  image_path TEXT NOT NULL,
  thumbnail_path TEXT,
  description TEXT,
  album VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_travel_photos_album ON travel_photos(album);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  image_path TEXT,
  specifications JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_images_updated_at
    BEFORE UPDATE ON images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Public read access for all images
CREATE POLICY "Public read access for images"
  ON images FOR SELECT
  USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert images"
  ON images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update images"
  ON images FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete images"
  ON images FOR DELETE
  TO authenticated
  USING (true);

-- Same policies for travel_photos
CREATE POLICY "Public read access for travel_photos"
  ON travel_photos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert travel_photos"
  ON travel_photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update travel_photos"
  ON travel_photos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete travel_photos"
  ON travel_photos FOR DELETE
  TO authenticated
  USING (true);

-- Same policies for equipment
CREATE POLICY "Public read access for equipment"
  ON equipment FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert equipment"
  ON equipment FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update equipment"
  ON equipment FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete equipment"
  ON equipment FOR DELETE
  TO authenticated
  USING (true);

-- Storage bucket policies (run after creating 'images' bucket)
-- In Supabase Dashboard: Storage > Create bucket named 'images' with public access

