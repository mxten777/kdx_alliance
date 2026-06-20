-- ============================================================
-- RLS (Row Level Security) Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_status_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_daily_metrics ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper function: admin role check
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles ar
    WHERE ar.user_id = is_admin.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_role(required_role admin_role_type, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles ar
    WHERE ar.user_id = has_role.user_id
      AND (ar.role = required_role OR ar.role = 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- profiles
-- ============================================================

CREATE POLICY "profiles: own read" ON profiles
  FOR SELECT USING (id = auth.uid() OR is_admin());

CREATE POLICY "profiles: own update" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles: insert on signup" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- ============================================================
-- admin_roles
-- ============================================================

CREATE POLICY "admin_roles: super_admin manage" ON admin_roles
  FOR ALL USING (has_role('super_admin'));

CREATE POLICY "admin_roles: self read" ON admin_roles
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- public_organizations (공개 조회 허용)
-- ============================================================

CREATE POLICY "organizations: public read active" ON public_organizations
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "organizations: admin manage" ON public_organizations
  FOR ALL USING (is_admin());

-- ============================================================
-- site_settings (공개 읽기 허용)
-- ============================================================

CREATE POLICY "site_settings: public read" ON site_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "site_settings: super_admin manage" ON site_settings
  FOR ALL USING (has_role('super_admin'));

-- ============================================================
-- notices (공개 게시물 조회 허용)
-- ============================================================

CREATE POLICY "notices: public read published" ON notices
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "notices: admin manage" ON notices
  FOR ALL USING (is_admin());

-- ============================================================
-- support_posts (공개 게시물 조회 허용)
-- ============================================================

CREATE POLICY "support_posts: public read published" ON support_posts
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "support_posts: admin manage" ON support_posts
  FOR ALL USING (
    has_role('super_admin') OR
    has_role('operator') OR
    has_role('support_manager')
  );

-- ============================================================
-- faq_categories & faqs (공개 조회)
-- ============================================================

CREATE POLICY "faq_categories: public read" ON faq_categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "faq_categories: admin manage" ON faq_categories
  FOR ALL USING (is_admin());

CREATE POLICY "faqs: public read published" ON faqs
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "faqs: admin manage" ON faqs
  FOR ALL USING (
    has_role('super_admin') OR
    has_role('operator') OR
    has_role('support_manager')
  );

-- ============================================================
-- events (공개 조회, 관리자 관리)
-- ============================================================

CREATE POLICY "events: public read published" ON events
  FOR SELECT USING (status IN ('published', 'ongoing', 'completed'));

CREATE POLICY "events: admin manage" ON events
  FOR ALL USING (
    has_role('super_admin') OR has_role('operator')
  );

-- ============================================================
-- event_registrations (익명 신청 허용, 관리자만 목록 조회)
-- ============================================================

CREATE POLICY "event_registrations: anon insert" ON event_registrations
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "event_registrations: admin read" ON event_registrations
  FOR SELECT USING (is_admin());

CREATE POLICY "event_registrations: admin update" ON event_registrations
  FOR UPDATE USING (is_admin());

-- ============================================================
-- tours
-- ============================================================

CREATE POLICY "tours: public read published" ON tours
  FOR SELECT USING (status IN ('published', 'ongoing', 'completed'));

CREATE POLICY "tours: admin manage" ON tours
  FOR ALL USING (
    has_role('super_admin') OR has_role('operator')
  );

-- ============================================================
-- tour_reservations
-- ============================================================

CREATE POLICY "tour_reservations: anon insert" ON tour_reservations
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "tour_reservations: admin read" ON tour_reservations
  FOR SELECT USING (is_admin());

CREATE POLICY "tour_reservations: admin update" ON tour_reservations
  FOR UPDATE USING (is_admin());

-- ============================================================
-- spaces
-- ============================================================

CREATE POLICY "spaces: public read available" ON spaces
  FOR SELECT USING (is_available = TRUE);

CREATE POLICY "spaces: admin manage" ON spaces
  FOR ALL USING (
    has_role('super_admin') OR has_role('operator')
  );

-- ============================================================
-- space_reservations
-- ============================================================

CREATE POLICY "space_reservations: anon insert" ON space_reservations
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "space_reservations: admin read" ON space_reservations
  FOR SELECT USING (is_admin());

CREATE POLICY "space_reservations: admin update" ON space_reservations
  FOR UPDATE USING (is_admin());

-- ============================================================
-- inquiries
-- ============================================================

CREATE POLICY "inquiries: anon insert" ON inquiries
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "inquiries: admin read" ON inquiries
  FOR SELECT USING (is_admin());

CREATE POLICY "inquiries: admin update" ON inquiries
  FOR UPDATE USING (is_admin());

-- ============================================================
-- chat_sessions & chat_messages (익명 사용 허용)
-- ============================================================

CREATE POLICY "chat_sessions: anon insert" ON chat_sessions
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "chat_sessions: session read" ON chat_sessions
  FOR SELECT USING (TRUE);

CREATE POLICY "chat_messages: anon insert" ON chat_messages
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "chat_messages: session read" ON chat_messages
  FOR SELECT USING (TRUE);

CREATE POLICY "ai_feedback_logs: anon insert" ON ai_feedback_logs
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "ai_feedback_logs: admin read" ON ai_feedback_logs
  FOR SELECT USING (is_admin());

-- ============================================================
-- parking (스마트한: parking_manager 포함)
-- ============================================================

CREATE POLICY "parking_zones: public read" ON parking_zones
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "parking_zones: admin manage" ON parking_zones
  FOR ALL USING (
    has_role('super_admin') OR
    has_role('operator') OR
    has_role('parking_manager')
  );

CREATE POLICY "parking_snapshots: public read" ON parking_status_snapshots
  FOR SELECT USING (TRUE);

CREATE POLICY "parking_snapshots: admin insert" ON parking_status_snapshots
  FOR INSERT WITH CHECK (
    has_role('super_admin') OR
    has_role('operator') OR
    has_role('parking_manager')
  );

-- ============================================================
-- safety (스마트아이넷: safety_manager 포함)
-- ============================================================

CREATE POLICY "safety_zones: admin read" ON safety_zones
  FOR SELECT USING (
    has_role('super_admin') OR
    has_role('operator') OR
    has_role('safety_manager')
  );

CREATE POLICY "safety_zones: admin manage" ON safety_zones
  FOR ALL USING (
    has_role('super_admin') OR
    has_role('operator') OR
    has_role('safety_manager')
  );

CREATE POLICY "safety_profiles: admin manage" ON safety_profiles
  FOR ALL USING (
    has_role('super_admin') OR
    has_role('operator') OR
    has_role('safety_manager')
  );

CREATE POLICY "safety_tags: admin manage" ON safety_tags
  FOR ALL USING (
    has_role('super_admin') OR
    has_role('operator') OR
    has_role('safety_manager')
  );

CREATE POLICY "safety_events: admin manage" ON safety_events
  FOR ALL USING (
    has_role('super_admin') OR
    has_role('operator') OR
    has_role('safety_manager')
  );

-- ============================================================
-- dashboard_daily_metrics
-- ============================================================

CREATE POLICY "metrics: admin read" ON dashboard_daily_metrics
  FOR SELECT USING (is_admin());

CREATE POLICY "metrics: admin insert" ON dashboard_daily_metrics
  FOR INSERT WITH CHECK (is_admin());
