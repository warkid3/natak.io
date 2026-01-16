-- Settings & Management Foundation Migration
-- Implements simplified RBAC with organizations, teams, and user settings

-- Core multi-tenancy
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT DEFAULT 'Pro' CHECK (tier IN ('Starter', 'Pro', 'Agency')),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  name TEXT NOT NULL,
  credit_allocation INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simplified 3-tier roles
CREATE TYPE user_role AS ENUM ('admin', 'creator', 'viewer');

-- Extend profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'creator';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- User settings (preferences)
CREATE TABLE user_settings (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  notifications JSONB DEFAULT '{
    "email_completion": true,
    "email_failures": true,
    "email_low_credits": true,
    "in_app_all": true,
    "digest_mode": false
  }'::jsonb,
  workflow_defaults JSONB DEFAULT '{
    "default_aspect_ratio": "1:1",
    "default_nsfw": false,
    "auto_enable_video": false,
    "auto_retry_failed": false
  }'::jsonb,
  accessibility JSONB DEFAULT '{
    "high_contrast": false,
    "reduced_motion": false,
    "font_size": "medium"
  }'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logging
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'role_change'
  resource_type TEXT, -- 'character', 'asset', 'job', 'user', 'settings'
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_audit_user_time ON audit_logs(user_id, timestamp DESC);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_action ON audit_logs(action, timestamp DESC);
CREATE INDEX idx_teams_org ON teams(organization_id);
CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_profiles_team ON profiles(team_id);

-- Add organization/team scoping to existing tables
ALTER TABLE characters ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT false;

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams;

-- Create default organization for existing data
INSERT INTO organizations (name, tier) VALUES ('Default Organization', 'Pro')
ON CONFLICT DO NOTHING;

-- Migrate existing users to default org
DO $$
DECLARE
  default_org_id UUID;
BEGIN
  SELECT id INTO default_org_id FROM organizations WHERE name = 'Default Organization' LIMIT 1;
  
  IF default_org_id IS NOT NULL THEN
    UPDATE profiles 
    SET organization_id = default_org_id, 
        role = 'creator'
    WHERE organization_id IS NULL;
    
    -- Set first user as admin (using updated_at as proxy for creation time)
    UPDATE profiles 
    SET role = 'admin' 
    WHERE id = (SELECT id FROM profiles ORDER BY updated_at LIMIT 1);
  END IF;
END $$;

-- Comments for documentation
COMMENT ON TABLE organizations IS 'Multi-tenant organizations with tier-based features';
COMMENT ON TABLE teams IS 'Teams within organizations for resource grouping';
COMMENT ON TABLE user_settings IS 'User preferences for notifications, workflow defaults, and accessibility';
COMMENT ON TABLE audit_logs IS 'Audit trail for security and compliance';
COMMENT ON COLUMN profiles.role IS 'User role: admin (full access), creator (create/manage own), viewer (read-only)';
