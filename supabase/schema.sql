-- Teams & members
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department TEXT,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE team_member_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT,
  comment TEXT,
  media_url TEXT,
  media_type TEXT CHECK (media_type IS NULL OR media_type IN ('image', 'video')),
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles (synced with auth.users via trigger)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX teams_name_idx ON teams(name);
CREATE INDEX team_members_team_id_idx ON team_members(team_id);
CREATE INDEX team_members_name_idx ON team_members(name);
CREATE INDEX team_member_comments_member_id_idx ON team_member_comments(team_member_id);
CREATE INDEX profiles_email_idx ON profiles(email);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public insert teams" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update teams" ON teams FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete teams" ON teams FOR DELETE USING (true);

CREATE POLICY "Public read team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public insert team_members" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update team_members" ON team_members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete team_members" ON team_members FOR DELETE USING (true);

CREATE POLICY "Public read comments" ON team_member_comments FOR SELECT USING (true);
CREATE POLICY "Public insert comments" ON team_member_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update comments" ON team_member_comments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete comments" ON team_member_comments FOR DELETE USING (true);

CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
