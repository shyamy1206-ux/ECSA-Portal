-- ECSA Platform Schema
-- To be executed in Supabase SQL Editor

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('visitor', 'student', 'club_admin', 'ecsa_admin', 'super_admin');
CREATE TYPE content_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE idea_status AS ENUM ('submitted', 'under_review', 'accepted', 'in_progress', 'completed', 'declined');

-- 2. Profiles Table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'student'::user_role,
  department TEXT,
  year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Clubs Table
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  department TEXT,
  status content_status DEFAULT 'pending'::content_status,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- 4. Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  status content_status DEFAULT 'pending'::content_status,
  capacity INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 5. Ideas Table
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  category TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status idea_status DEFAULT 'submitted'::idea_status,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- 6. Certificates Table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  verification_hash TEXT UNIQUE NOT NULL,
  file_url TEXT NOT NULL,
  status content_status DEFAULT 'pending'::content_status,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Clubs: Viewable by everyone if approved. Super/ECSA admins can view all. 
CREATE POLICY "Approved clubs are viewable by everyone" ON clubs FOR SELECT 
  USING (status = 'approved' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));
CREATE POLICY "Students can submit clubs" ON clubs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Events: Viewable by everyone if approved.
CREATE POLICY "Approved events are viewable by everyone" ON events FOR SELECT 
  USING (status = 'approved' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('ecsa_admin', 'super_admin')));

-- Ideas: Viewable by everyone (if we want public idea board)
CREATE POLICY "Ideas are viewable by everyone" ON ideas FOR SELECT USING (true);
CREATE POLICY "Students can submit ideas" ON ideas FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Super Admin bypass (Allows super_admins to bypass RLS for all tables)
-- In Supabase, you usually apply this per table, or use a database function.
-- For simplicity in this script, we'll grant full access to super admins on clubs:
CREATE POLICY "Super admins have full access to clubs" ON clubs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
