-- ============================================================
-- Gyeongju Culture & Mobility Valley Platform
-- Supabase PostgreSQL Schema - Initial Migration
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE admin_role_type AS ENUM (
  'super_admin',
  'operator',
  'support_manager',
  'parking_manager',
  'safety_manager'
);

CREATE TYPE org_type AS ENUM (
  'tenant',        -- 입주기업
  'operator',      -- 운영기관
  'partner',       -- 협력기관
  'consortium'     -- 컨소시엄 참여사
);

CREATE TYPE event_status AS ENUM (
  'draft',
  'published',
  'ongoing',
  'completed',
  'cancelled'
);

CREATE TYPE event_category AS ENUM (
  'festival',      -- 축제
  'exhibition',    -- 전시
  'performance',   -- 공연
  'seminar',       -- 세미나
  'corporate',     -- 기업행사
  'tour',          -- 투어
  'other'
);

CREATE TYPE tour_type AS ENUM (
  'factory',       -- 공장견학
  'experience',    -- 체험형
  'culture',       -- 산업문화 투어
  'group'          -- 단체견학
);

CREATE TYPE reservation_status AS ENUM (
  'pending',       -- 신규/대기
  'reviewing',     -- 검토중
  'approved',      -- 승인
  'rejected',      -- 반려
  'completed',     -- 완료
  'cancelled'
);

CREATE TYPE inquiry_type AS ENUM (
  'general',
  'event',
  'tour',
  'support',
  'civil',         -- 민원/행정
  'partnership'
);

CREATE TYPE inquiry_status AS ENUM (
  'new',
  'in_progress',
  'resolved',
  'closed'
);

CREATE TYPE support_category AS ENUM (
  'notice',        -- 일반공지
  'subsidy',       -- 지원사업
  'tenant_info',   -- 입주기업 안내
  'event_notice',  -- 행사안내
  'civil_admin',   -- 행정/민원
  'public_project' -- 공공사업 정보
);

CREATE TYPE parking_zone_type AS ENUM (
  'outdoor',
  'underground',
  'rooftop',
  'event'
);

CREATE TYPE safety_profile_type AS ENUM (
  'visitor',
  'worker',
  'event_participant'
);

CREATE TYPE safety_event_type AS ENUM (
  'emergency_call',
  'checkin',
  'checkout',
  'zone_alert',
  'tag_lost',
  'sos'
);

CREATE TYPE safety_event_severity AS ENUM (
  'info',
  'warning',
  'critical'
);

-- ============================================================
-- AUTH / PROFILES
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  organization TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role admin_role_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- ============================================================
-- ORGANIZATIONS
-- ============================================================

CREATE TABLE public_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_en TEXT,
  org_type org_type NOT NULL DEFAULT 'tenant',
  industry TEXT,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  representative TEXT,
  employee_count INTEGER,
  founded_year INTEGER,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SITE SETTINGS
-- ============================================================

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  label TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- Insert default settings
INSERT INTO site_settings (key, label, value) VALUES
  ('hero_title', '히어로 제목', '"경주 문화선도산단 디지털 전환 플랫폼"'),
  ('hero_subtitle', '히어로 부제', '"Culture & Mobility Valley — 산업·문화·관광·스마트시티를 하나로"'),
  ('kpi_companies', '입주기업 수', '42'),
  ('kpi_events', '연간 행사 수', '28'),
  ('kpi_spaces', '예약 가능 공간', '15'),
  ('kpi_programs', '운영 프로그램', '36'),
  ('site_name', '사이트명', '"경주 문화선도산단"'),
  ('contact_email', '대표 이메일', '"info@gyeongju-cmv.kr"'),
  ('contact_phone', '대표 전화', '"054-123-4567"'),
  ('contact_address', '주소', '"경상북도 경주시 외동읍 외동로 123"');

-- ============================================================
-- NOTICES
-- ============================================================

CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_pinned BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  author_id UUID REFERENCES profiles(id),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUPPORT POSTS (기업지원 / 지원사업 / 민원안내 - 정유 포지션)
-- ============================================================

CREATE TABLE support_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category support_category NOT NULL DEFAULT 'notice',
  summary TEXT,
  deadline DATE,
  target_audience TEXT,
  budget_amount BIGINT,
  attached_files JSONB DEFAULT '[]',
  external_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  is_pinned BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES profiles(id),
  view_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FAQ
-- ============================================================

CREATE TABLE faq_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO faq_categories (name, slug, sort_order) VALUES
  ('시설 이용 안내', 'facility', 1),
  ('행사/프로그램', 'events', 2),
  ('산업관광/견학', 'tours', 3),
  ('기업지원/지원사업', 'support', 4),
  ('민원/행정', 'civil', 5),
  ('기타', 'other', 6);

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES faq_categories(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EVENTS (행사/프로그램)
-- ============================================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category event_category NOT NULL DEFAULT 'other',
  status event_status NOT NULL DEFAULT 'draft',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  registration_start TIMESTAMPTZ,
  registration_end TIMESTAMPTZ,
  location TEXT,
  location_detail TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  ticket_price INTEGER DEFAULT 0,
  host_organization_id UUID REFERENCES public_organizations(id),
  cover_image_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  contact_email TEXT,
  contact_phone TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  organization TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  participant_count INTEGER NOT NULL DEFAULT 1,
  memo TEXT,
  status reservation_status NOT NULL DEFAULT 'pending',
  admin_memo TEXT,
  privacy_agreed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TOURS (산업관광/견학)
-- ============================================================

CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  tour_type tour_type NOT NULL DEFAULT 'factory',
  status event_status NOT NULL DEFAULT 'draft',
  duration_hours NUMERIC(4,1),
  max_participants INTEGER,
  min_participants INTEGER DEFAULT 1,
  operating_days TEXT[] DEFAULT '{}',
  operating_hours TEXT,
  location TEXT,
  meeting_point TEXT,
  parking_info TEXT,
  requirements TEXT,
  host_organization_id UUID REFERENCES public_organizations(id),
  cover_image_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  contact_email TEXT,
  contact_phone TEXT,
  is_free BOOLEAN DEFAULT TRUE,
  fee INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tour_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  desired_date DATE NOT NULL,
  participant_count INTEGER NOT NULL,
  visit_purpose TEXT,
  memo TEXT,
  status reservation_status NOT NULL DEFAULT 'pending',
  admin_memo TEXT,
  privacy_agreed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SPACES (공간/시설)
-- ============================================================

CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  space_type TEXT NOT NULL, -- meeting_room, lecture_hall, exhibition, event_hall, promo_center
  description TEXT,
  content TEXT,
  capacity INTEGER,
  area_sqm NUMERIC(8,2),
  floor TEXT,
  building TEXT,
  location TEXT,
  operating_hours TEXT,
  equipment TEXT[] DEFAULT '{}',
  rules TEXT,
  images JSONB DEFAULT '[]',
  is_available BOOLEAN DEFAULT TRUE,
  hourly_rate INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE space_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  organization TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  desired_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  purpose TEXT NOT NULL,
  participant_count INTEGER,
  memo TEXT,
  status reservation_status NOT NULL DEFAULT 'pending',
  admin_memo TEXT,
  privacy_agreed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INQUIRIES (문의)
-- ============================================================

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_type inquiry_type NOT NULL DEFAULT 'general',
  applicant_name TEXT NOT NULL,
  organization TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status inquiry_status NOT NULL DEFAULT 'new',
  admin_memo TEXT,
  reply_content TEXT,
  replied_at TIMESTAMPTZ,
  replied_by UUID REFERENCES profiles(id),
  privacy_agreed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AI CHAT
-- ============================================================

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_key TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_feedback_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES chat_messages(id),
  session_id UUID REFERENCES chat_sessions(id),
  rating INTEGER CHECK (rating IN (1, -1)),
  feedback_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SMART PARKING (스마트한 포지션)
-- ============================================================

CREATE TABLE parking_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  zone_type parking_zone_type NOT NULL DEFAULT 'outdoor',
  total_spaces INTEGER NOT NULL DEFAULT 0,
  occupied_spaces INTEGER NOT NULL DEFAULT 0,
  reserved_spaces INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  location TEXT,
  operating_hours TEXT DEFAULT '24시간',
  is_active BOOLEAN DEFAULT TRUE,
  has_ev_charger BOOLEAN DEFAULT FALSE,
  has_disabled_space BOOLEAN DEFAULT FALSE,
  disabled_spaces INTEGER DEFAULT 0,
  ev_charger_count INTEGER DEFAULT 0,
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parking_status_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID NOT NULL REFERENCES parking_zones(id) ON DELETE CASCADE,
  total_spaces INTEGER NOT NULL,
  occupied_spaces INTEGER NOT NULL,
  reserved_spaces INTEGER DEFAULT 0,
  occupancy_rate NUMERIC(5,2),
  snapshot_time TIMESTAMPTZ DEFAULT NOW(),
  event_id UUID REFERENCES events(id),
  note TEXT
);

-- ============================================================
-- SMART SAFETY (스마트아이넷 포지션)
-- ============================================================

CREATE TABLE safety_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  zone_type TEXT NOT NULL DEFAULT 'safe', -- safe, restricted, hazardous
  description TEXT,
  floor TEXT,
  building TEXT,
  capacity INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE safety_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_type safety_profile_type NOT NULL DEFAULT 'visitor',
  name TEXT NOT NULL,
  organization TEXT,
  phone TEXT,
  email TEXT,
  id_number TEXT, -- 방문자 등록번호 (암호화 저장 권장)
  visit_purpose TEXT,
  visit_date DATE,
  expected_checkout TIMESTAMPTZ,
  actual_checkout TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  related_event_id UUID REFERENCES events(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE safety_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES safety_profiles(id) ON DELETE CASCADE,
  tag_code TEXT UNIQUE NOT NULL,
  tag_type TEXT NOT NULL DEFAULT 'BLE', -- BLE, UWB, NFC
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  returned_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  battery_level INTEGER CHECK (battery_level BETWEEN 0 AND 100),
  last_ping_at TIMESTAMPTZ,
  current_zone_id UUID REFERENCES safety_zones(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE safety_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type safety_event_type NOT NULL,
  severity safety_event_severity NOT NULL DEFAULT 'info',
  profile_id UUID REFERENCES safety_profiles(id),
  tag_id UUID REFERENCES safety_tags(id),
  zone_id UUID REFERENCES safety_zones(id),
  description TEXT,
  location_detail TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id),
  resolution_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DASHBOARD METRICS
-- ============================================================

CREATE TABLE dashboard_daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_date DATE UNIQUE NOT NULL,
  new_event_registrations INTEGER DEFAULT 0,
  new_tour_reservations INTEGER DEFAULT 0,
  new_space_reservations INTEGER DEFAULT 0,
  new_inquiries INTEGER DEFAULT 0,
  new_safety_events INTEGER DEFAULT 0,
  chat_sessions_count INTEGER DEFAULT 0,
  active_parking_occupancy NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tour_reservations_tour ON tour_reservations(tour_id);
CREATE INDEX idx_tour_reservations_status ON tour_reservations(status);
CREATE INDEX idx_tour_reservations_date ON tour_reservations(desired_date);
CREATE INDEX idx_space_reservations_space ON space_reservations(space_id);
CREATE INDEX idx_space_reservations_status ON space_reservations(status);
CREATE INDEX idx_space_reservations_date ON space_reservations(desired_date);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_type ON inquiries(inquiry_type);
CREATE INDEX idx_notices_published ON notices(is_published);
CREATE INDEX idx_support_posts_category ON support_posts(category);
CREATE INDEX idx_support_posts_published ON support_posts(is_published);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_parking_snapshots_zone_time ON parking_status_snapshots(zone_id, snapshot_time);
CREATE INDEX idx_safety_events_type ON safety_events(event_type);
CREATE INDEX idx_safety_events_severity ON safety_events(severity);
CREATE INDEX idx_safety_events_resolved ON safety_events(is_resolved);
CREATE INDEX idx_safety_tags_active ON safety_tags(is_active);
CREATE INDEX idx_faqs_category ON faqs(category_id);
CREATE INDEX idx_admin_roles_user ON admin_roles(user_id);

-- ============================================================
-- TRIGGERS: updated_at 자동 갱신
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_public_organizations_updated_at BEFORE UPDATE ON public_organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_posts_updated_at BEFORE UPDATE ON support_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tour_reservations_updated_at BEFORE UPDATE ON tour_reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON spaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_space_reservations_updated_at BEFORE UPDATE ON space_reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safety_profiles_updated_at BEFORE UPDATE ON safety_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
