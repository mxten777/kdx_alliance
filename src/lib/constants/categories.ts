/**
 * Centralized label/color maps for all domain categories.
 * Single source of truth — import from here instead of redefining per-page.
 */

export const EVENT_CATEGORY_MAP: Record<string, string> = {
  festival: '축제',
  exhibition: '전시',
  performance: '공연',
  seminar: '세미나',
  corporate: '기업행사',
  tour: '투어',
  other: '기타',
}

export const TOUR_TYPE_MAP: Record<string, { label: string; color: string }> = {
  factory:    { label: '공장견학',  color: 'bg-blue-100 text-blue-700' },
  experience: { label: '체험형',    color: 'bg-emerald-100 text-emerald-700' },
  culture:    { label: '산업문화',  color: 'bg-violet-100 text-violet-700' },
  group:      { label: '단체견학',  color: 'bg-orange-100 text-orange-700' },
}

/** Simple string-only version used on home page / tour detail */
export const TOUR_TYPE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(TOUR_TYPE_MAP).map(([k, v]) => [k, v.label])
)

export const SPACE_TYPE_MAP: Record<string, { label: string; color: string }> = {
  meeting_room:  { label: '회의실',  color: 'bg-blue-100 text-blue-700' },
  lecture_hall:  { label: '교육장',  color: 'bg-indigo-100 text-indigo-700' },
  exhibition:    { label: '전시홀',  color: 'bg-violet-100 text-violet-700' },
  event_hall:    { label: '행사장',  color: 'bg-orange-100 text-orange-700' },
  promo_center:  { label: '홍보관',  color: 'bg-emerald-100 text-emerald-700' },
}

export const ORG_TYPE_MAP: Record<string, { label: string; color: string }> = {
  tenant:      { label: '입주기업',  color: 'bg-blue-100 text-blue-700' },
  operator:    { label: '운영기관',  color: 'bg-slate-100 text-slate-700' },
  partner:     { label: '협력기관',  color: 'bg-emerald-100 text-emerald-700' },
  consortium:  { label: '컨소시엄', color: 'bg-violet-100 text-violet-700' },
}

/** Simple string-only version used on org detail page */
export const ORG_TYPE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ORG_TYPE_MAP).map(([k, v]) => [k, v.label])
)

export const SUPPORT_CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  notice:         { label: '일반공지',       color: 'bg-gray-100 text-gray-600' },
  subsidy:        { label: '지원사업',       color: 'bg-blue-100 text-blue-700' },
  tenant_info:    { label: '입주기업 안내',  color: 'bg-emerald-100 text-emerald-700' },
  event_notice:   { label: '행사안내',       color: 'bg-indigo-100 text-indigo-700' },
  civil_admin:    { label: '행정/민원',      color: 'bg-orange-100 text-orange-700' },
  public_project: { label: '공공사업',       color: 'bg-violet-100 text-violet-700' },
}

export const INQUIRY_TYPE_LABEL_MAP: Record<string, string> = {
  general:     '일반',
  event:       '행사',
  tour:        '견학',
  support:     '기업지원',
  civil:       '민원',
  partnership: '제휴',
}
