-- Row-Level Security (RLS) Policies for RBAC
-- Enforces 3-tier role permissions: admin, creator, viewer

-- Enable RLS on all tables
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to get user org
CREATE OR REPLACE FUNCTION get_user_org(user_id UUID)
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- CHARACTERS POLICIES
-- ============================================

-- SELECT: Admins see all in org, Creators see own, Viewers see none
CREATE POLICY "characters_select" ON characters FOR SELECT USING (
  get_user_role(auth.uid()) = 'admin' AND organization_id = get_user_org(auth.uid())
  OR user_id = auth.uid()
);

-- INSERT: Admins and Creators can create
CREATE POLICY "characters_insert" ON characters FOR INSERT WITH CHECK (
  get_user_role(auth.uid()) IN ('admin', 'creator')
  AND user_id = auth.uid()
);

-- UPDATE: Admins can update all, Creators update own
CREATE POLICY "characters_update" ON characters FOR UPDATE USING (
  get_user_role(auth.uid()) = 'admin' AND organization_id = get_user_org(auth.uid())
  OR user_id = auth.uid()
);

-- DELETE: Admins can delete all, Creators delete own
CREATE POLICY "characters_delete" ON characters FOR DELETE USING (
  get_user_role(auth.uid()) = 'admin' AND organization_id = get_user_org(auth.uid())
  OR user_id = auth.uid()
);

-- ============================================
-- JOBS POLICIES
-- ============================================

CREATE POLICY "jobs_select" ON jobs FOR SELECT USING (
  get_user_role(auth.uid()) = 'admin' AND organization_id = get_user_org(auth.uid())
  OR user_id = auth.uid()
);

CREATE POLICY "jobs_insert" ON jobs FOR INSERT WITH CHECK (
  get_user_role(auth.uid()) IN ('admin', 'creator')
  AND user_id = auth.uid()
);

CREATE POLICY "jobs_update" ON jobs FOR UPDATE USING (
  get_user_role(auth.uid()) = 'admin' AND organization_id = get_user_org(auth.uid())
  OR user_id = auth.uid()
);

CREATE POLICY "jobs_delete" ON jobs FOR DELETE USING (
  get_user_role(auth.uid()) = 'admin' AND organization_id = get_user_org(auth.uid())
  OR user_id = auth.uid()
);

-- ============================================
-- COLLECTIONS POLICIES
-- ============================================

CREATE POLICY "collections_select" ON collections FOR SELECT USING (
  user_id = auth.uid()
);

CREATE POLICY "collections_insert" ON collections FOR INSERT WITH CHECK (
  get_user_role(auth.uid()) IN ('admin', 'creator')
  AND user_id = auth.uid()
);

CREATE POLICY "collections_update" ON collections FOR UPDATE USING (
  user_id = auth.uid()
);

CREATE POLICY "collections_delete" ON collections FOR DELETE USING (
  user_id = auth.uid()
);

-- ============================================
-- COLLECTION ITEMS POLICIES
-- ============================================

CREATE POLICY "collection_items_select" ON collection_items FOR SELECT USING (
  collection_id IN (SELECT id FROM collections WHERE user_id = auth.uid())
);

CREATE POLICY "collection_items_insert" ON collection_items FOR INSERT WITH CHECK (
  collection_id IN (SELECT id FROM collections WHERE user_id = auth.uid())
);

CREATE POLICY "collection_items_delete" ON collection_items FOR DELETE USING (
  collection_id IN (SELECT id FROM collections WHERE user_id = auth.uid())
);

-- ============================================
-- FAVORITES POLICIES
-- ============================================

CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (
  user_id = auth.uid()
);

CREATE POLICY "favorites_insert" ON favorites FOR INSERT WITH CHECK (
  user_id = auth.uid()
);

CREATE POLICY "favorites_delete" ON favorites FOR DELETE USING (
  user_id = auth.uid()
);

-- Comments
COMMENT ON FUNCTION get_user_role IS 'Helper function to retrieve user role for RLS policies';
COMMENT ON FUNCTION get_user_org IS 'Helper function to retrieve user organization for RLS policies';
