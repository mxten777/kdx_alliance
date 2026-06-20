// ============================================================
// Domain Types for Gyeongju CMV Platform
// ============================================================

export type AdminRoleType =
  | 'super_admin'
  | 'operator'
  | 'support_manager'
  | 'parking_manager'
  | 'safety_manager'

export type OrgType = 'tenant' | 'operator' | 'partner' | 'consortium'

export type EventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'

export type EventCategory =
  | 'festival'
  | 'exhibition'
  | 'performance'
  | 'seminar'
  | 'corporate'
  | 'tour'
  | 'other'

export type TourType = 'factory' | 'experience' | 'culture' | 'group'

export type ReservationStatus =
  | 'pending'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled'

export type InquiryType =
  | 'general'
  | 'event'
  | 'tour'
  | 'support'
  | 'civil'
  | 'partnership'

export type InquiryStatus = 'new' | 'in_progress' | 'resolved' | 'closed'

export type SupportCategory =
  | 'notice'
  | 'subsidy'
  | 'tenant_info'
  | 'event_notice'
  | 'civil_admin'
  | 'public_project'

export type ParkingZoneType = 'outdoor' | 'underground' | 'rooftop' | 'event'

export type SafetyProfileType = 'visitor' | 'worker' | 'event_participant'

export type SafetyEventType =
  | 'emergency_call'
  | 'checkin'
  | 'checkout'
  | 'zone_alert'
  | 'tag_lost'
  | 'sos'

export type SafetyEventSeverity = 'info' | 'warning' | 'critical'

// ============================================================
// Domain model interfaces
// ============================================================

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  organization: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AdminRole {
  id: string
  user_id: string
  role: AdminRoleType
  created_at: string
}

export interface PublicOrganization {
  id: string
  name: string
  name_en: string | null
  org_type: OrgType
  industry: string | null
  description: string | null
  logo_url: string | null
  website_url: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  representative: string | null
  employee_count: number | null
  founded_year: number | null
  tags: string[]
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Notice {
  id: string
  title: string
  content: string
  category: string
  is_pinned: boolean
  is_published: boolean
  author_id: string | null
  view_count: number
  created_at: string
  updated_at: string
}

export interface SupportPost {
  id: string
  title: string
  content: string
  category: SupportCategory
  summary: string | null
  deadline: string | null
  target_audience: string | null
  budget_amount: number | null
  attached_files: unknown[]
  external_url: string | null
  is_published: boolean
  is_pinned: boolean
  author_id: string | null
  view_count: number
  tags: string[]
  created_at: string
  updated_at: string
}

export interface FaqCategory {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
}

export interface Faq {
  id: string
  category_id: string | null
  question: string
  answer: string
  is_published: boolean
  sort_order: number
  view_count: number
  created_at: string
  updated_at: string
  faq_categories?: FaqCategory
}

export interface Event {
  id: string
  title: string
  description: string | null
  content: string | null
  category: EventCategory
  status: EventStatus
  start_date: string
  end_date: string
  registration_start: string | null
  registration_end: string | null
  location: string | null
  location_detail: string | null
  max_participants: number | null
  current_participants: number
  is_free: boolean
  ticket_price: number
  host_organization_id: string | null
  cover_image_url: string | null
  gallery_images: unknown[]
  tags: string[]
  contact_email: string | null
  contact_phone: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  applicant_name: string
  organization: string | null
  phone: string
  email: string
  participant_count: number
  memo: string | null
  status: ReservationStatus
  admin_memo: string | null
  privacy_agreed: boolean
  created_at: string
  updated_at: string
  events?: Event
}

export interface Tour {
  id: string
  title: string
  description: string | null
  content: string | null
  tour_type: TourType
  status: EventStatus
  duration_hours: number | null
  max_participants: number | null
  min_participants: number
  operating_days: string[]
  operating_hours: string | null
  location: string | null
  meeting_point: string | null
  parking_info: string | null
  requirements: string | null
  host_organization_id: string | null
  cover_image_url: string | null
  gallery_images: unknown[]
  tags: string[]
  contact_email: string | null
  contact_phone: string | null
  is_free: boolean
  fee: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface TourReservation {
  id: string
  tour_id: string
  applicant_name: string
  organization: string
  phone: string
  email: string
  desired_date: string
  participant_count: number
  visit_purpose: string | null
  memo: string | null
  status: ReservationStatus
  admin_memo: string | null
  privacy_agreed: boolean
  created_at: string
  updated_at: string
  tours?: Tour
}

export interface Space {
  id: string
  name: string
  space_type: string
  description: string | null
  content: string | null
  capacity: number | null
  area_sqm: number | null
  floor: string | null
  building: string | null
  location: string | null
  operating_hours: string | null
  equipment: string[]
  rules: string | null
  images: unknown[]
  is_available: boolean
  hourly_rate: number
  is_free: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface SpaceReservation {
  id: string
  space_id: string
  applicant_name: string
  organization: string | null
  phone: string
  email: string
  desired_date: string
  start_time: string
  end_time: string
  purpose: string
  participant_count: number | null
  memo: string | null
  status: ReservationStatus
  admin_memo: string | null
  privacy_agreed: boolean
  created_at: string
  updated_at: string
  spaces?: Space
}

export interface Inquiry {
  id: string
  inquiry_type: InquiryType
  applicant_name: string
  organization: string | null
  phone: string
  email: string
  subject: string
  content: string
  status: InquiryStatus
  admin_memo: string | null
  reply_content: string | null
  replied_at: string | null
  replied_by: string | null
  privacy_agreed: boolean
  created_at: string
  updated_at: string
}

export interface ParkingZone {
  id: string
  name: string
  code: string
  zone_type: ParkingZoneType
  total_spaces: number
  occupied_spaces: number
  reserved_spaces: number
  description: string | null
  location: string | null
  operating_hours: string
  is_active: boolean
  has_ev_charger: boolean
  has_disabled_space: boolean
  disabled_spaces: number
  ev_charger_count: number
  last_updated_at: string
  created_at: string
}

export interface SafetyProfile {
  id: string
  profile_type: SafetyProfileType
  name: string
  organization: string | null
  phone: string | null
  email: string | null
  visit_purpose: string | null
  visit_date: string | null
  expected_checkout: string | null
  actual_checkout: string | null
  is_active: boolean
  related_event_id: string | null
  created_at: string
  updated_at: string
}

export interface SafetyTag {
  id: string
  profile_id: string
  tag_code: string
  tag_type: string
  issued_at: string
  returned_at: string | null
  is_active: boolean
  battery_level: number | null
  last_ping_at: string | null
  current_zone_id: string | null
  created_at: string
  safety_profiles?: SafetyProfile
  safety_zones?: SafetyZone
}

export interface SafetyEvent {
  id: string
  event_type: SafetyEventType
  severity: SafetyEventSeverity
  profile_id: string | null
  tag_id: string | null
  zone_id: string | null
  description: string | null
  location_detail: string | null
  is_resolved: boolean
  resolved_at: string | null
  resolved_by: string | null
  resolution_note: string | null
  created_at: string
  safety_profiles?: SafetyProfile
  safety_zones?: SafetyZone
}

export interface SafetyZone {
  id: string
  name: string
  code: string
  zone_type: string
  description: string | null
  floor: string | null
  building: string | null
  capacity: number | null
  is_active: boolean
  created_at: string
}

export interface SiteSettings {
  [key: string]: string | number | boolean | null
}

// UI helper types
export interface KpiData {
  label: string
  value: string | number
  unit?: string
  change?: number
  icon?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
