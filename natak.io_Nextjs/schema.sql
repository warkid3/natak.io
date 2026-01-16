-- NATAK.IO DATABASE SCHEMA
-- Phase 2: Backend Integration

-- 1. ENUMS
CREATE TYPE job_status AS ENUM ('scraped', 'queued', 'processing', 'review', 'posted', 'failed', 'archived');
CREATE TYPE character_status AS ENUM ('training', 'ready', 'failed');
CREATE TYPE asset_type AS ENUM ('image', 'video');
CREATE TYPE asset_source AS ENUM ('scraped', 'upload');
CREATE TYPE transaction_type AS ENUM ('debit', 'credit');

-- 2. TABLES

-- Profiles (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'Starter' CHECK (tier IN ('Starter', 'Pro', 'Agency')),
  credits INTEGER DEFAULT 1000,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Characters (Identity Models / LoRAs)
CREATE TABLE characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  trigger_word TEXT NOT NULL,
  lora_url TEXT,
  status character_status DEFAULT 'ready',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets (DAM / Scraped Images)
CREATE TABLE assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  collection TEXT,
  type asset_type DEFAULT 'image',
  source asset_source DEFAULT 'scraped',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs (Generation Queue)
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  character_id UUID REFERENCES characters ON DELETE SET NULL,
  asset_id UUID REFERENCES assets ON DELETE SET NULL,
  prompting_model TEXT NOT NULL,
  image_model TEXT NOT NULL,
  video_model TEXT,
  status job_status DEFAULT 'queued',
  is_nsfw BOOLEAN DEFAULT false,
  prompt TEXT NOT NULL,
  output_url TEXT,
  video_url TEXT,
  config JSONB,
  metadata JSONB,
  progress INTEGER DEFAULT 0,
  error TEXT,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credits Ledger (Transactional History)
CREATE TABLE credits_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Starred Prompts (Library)
CREATE TABLE starred_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, text)
);

-- Notifications (Event Logs)
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'job',
  read BOOLEAN DEFAULT false,
  link TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets (Support)
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'technical',
  status TEXT NOT NULL DEFAULT 'open',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REALTIME CONFIGURATION
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- 4. RLS POLICIES (Row Level Security)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own characters" ON characters FOR ALL USING (auth.uid() = user_id);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own assets" ON assets FOR ALL USING (auth.uid() = user_id);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own jobs" ON jobs FOR ALL USING (auth.uid() = user_id);

ALTER TABLE credits_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ledger" ON credits_ledger FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE starred_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own prompts" ON starred_prompts FOR ALL USING (auth.uid() = user_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tickets" ON tickets FOR ALL USING (auth.uid() = user_id);

-- 5. FUNCTION: SYNC AUTH USERS TO PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
