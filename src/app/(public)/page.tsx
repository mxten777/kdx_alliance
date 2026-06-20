import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CalendarDays, MapPin, Building2, Bot, ParkingCircle, Shield,
  LayoutDashboard, ArrowRight, Clock, Users, ChevronRight, Megaphone, Phone,
  Mail, Rss
} from 'lucide-react'
import { YoutubeIcon, InstagramIcon, FacebookIcon } from '@/components/icons/SocialIcons'
import { formatDate, formatDateTime } from '@/lib/utils'
import type { Event, Tour, Notice, SupportPost } from '@/types/models'

const serviceCards = [
  {
    icon: CalendarDays,
    title: '문화행사 운영',
    description: '축제·전시·공연·세미나 등 경주 문화선도산단의 다양한 행사 프로그램',
    href: '/events',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    cta: '행사 보기',
  },
  {
    icon: MapPin,
    title: '산업관광/견학',
    description: '스마트팩토리 공장견학, 체험형 투어, 단체 산업관광 프로그램 예약',
    href: '/tours',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    cta: '견학 예약',
    highlight: true,
  },
  {
    icon: Building2,
    title: '공간/시설 예약',
    description: '회의실·교육장·전시홀·다목적홀 등 산단 내 공간 예약',
    href: '/spaces',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    cta: '공간 예약',
  },
  {
    icon: ParkingCircle,
    title: '스마트주차',
    description: '실시간 주차 현황·구역별 가용 현황·행사 주차 수요 안내 (by 스마트한)',
    href: '/admin/parking',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    cta: '주차 현황',
  },
  {
    icon: Shield,
    title: '스마트안전',
    description: '스마트태그 기반 방문객·근로자 안전관리·긴급호출 시스템 (by 스마트아이넷)',
    href: '/admin/safety',
    color: 'text-red-600',
    bg: 'bg-red-50',
    cta: '안전 현황',
  },
  {
    icon: Bot,
    title: 'AI 기업지원',
    description: '지원사업·민원·시설·행사 안내 AI 챗봇 (by 바이칼시스템즈 + 정유)',
    href: '/ai-assistant',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    cta: 'AI 상담 시작',
  },
]

import { EVENT_CATEGORY_MAP, TOUR_TYPE_LABEL_MAP } from '@/lib/constants/categories'
import { CONTACT } from '@/lib/constants/contact'

export default async function HomePage() {
  const supabase = await createClient()

  const [eventsRes, toursRes, noticesRes, supportRes] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, category, status, start_date, end_date, location, max_participants, current_participants, is_free, cover_image_url')
      .in('status', ['published', 'ongoing'])
      .gte('end_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(4),
    supabase
      .from('tours')
      .select('id, title, tour_type, duration_hours, max_participants, operating_days, is_free, cover_image_url')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('notices')
      .select('id, title, category, is_pinned, created_at')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('support_posts')
      .select('id, title, category, deadline, created_at')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const events = (eventsRes.data ?? []) as Event[]
  const tours = (toursRes.data ?? []) as Tour[]
  const notices = (noticesRes.data ?? []) as Notice[]
  const supportPosts = (supportRes.data ?? []) as SupportPost[]

  const today = new Date()
  const todayLabel = today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  const weekNum = Math.ceil((((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / 86400000) + new Date(today.getFullYear(), 0, 1).getDay() + 1) / 7)

  return (
    <div>
      {/* ── Today Bar — 산단 라이브 스트립 ── */}
      <div className="hidden md:block bg-[#0A1628] text-slate-300 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300/90 font-medium">LIVE</span>
            </span>
            <span className="text-slate-400 tabular-nums">{todayLabel}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">제{weekNum}주차 산단 운영중</span>
          </div>
          <div className="flex items-center gap-5 text-slate-400">
            <span className="flex items-center gap-1.5">
              <ParkingCircle className="h-3 w-3 text-emerald-400" />
              주차 가용 <span className="text-white font-semibold tabular-nums">182</span>/420
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3 w-3 text-blue-400" />
              오늘 방문 <span className="text-white font-semibold tabular-nums">1,247</span>명
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-[#C9A961]" />
              안전등급 <span className="text-white font-semibold">정상</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Hero — 편집국 스타일 ── */}
      <section className="relative overflow-hidden bg-[#050B1A]">
        <div className="absolute inset-0 bg-linear-to-br from-[#050B1A] via-[#0A1628] to-[#0F2959]" />
        <div className="absolute inset-0 cmv-pattern-grid opacity-40" style={{
          maskImage: 'radial-gradient(ellipse at 75% 35%, black 0%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 75% 35%, black 0%, transparent 65%)',
        }} />
        <div className="cmv-halo cmv-shimmer -top-32 -right-20 h-125 w-125" style={{ background: 'radial-gradient(circle, rgba(201,169,97,0.16) 0%, transparent 70%)' }} />
        <div className="cmv-halo bottom-0 -left-20 h-100 w-100" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)' }} />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-28 md:pt-24 md:pb-32">
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            {/* 좌측: 보도자료식 헤더 + H1 */}
            <div className="lg:col-span-8">
              {/* 보도자료 스타일 메타 */}
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="font-mono text-[#C9A961]">VOL.01</span>
                <span className="h-3 w-px bg-slate-600" />
                <span>2026 OPEN</span>
                <span className="h-3 w-px bg-slate-600" />
                <span className="text-slate-500">경상북도 경주시 외동읍</span>
              </div>

              <h1 className="mt-7 font-bold leading-[1.05] tracking-tight text-white">
                <span className="block text-5xl md:text-7xl">천년 고도 경주,</span>
                <span className="block mt-1 text-5xl md:text-7xl">
                  <span className="text-[#E8D4A1]">디지털</span>로 잇다
                </span>
              </h1>

              <p className="mt-8 text-base md:text-lg leading-relaxed text-slate-300 max-w-2xl">
                산업·문화·관광·스마트시티·AI·안전이 하나의 도시 운영 체계로 연결됩니다.
                <span className="block mt-1 text-slate-400">행사 신청, 견학 예약, 기업지원 안내까지 — 한 곳에서.</span>
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="group h-12 px-7 bg-[#C9A961] text-[#0A1628] hover:bg-[#E8D4A1] font-semibold shadow-2xl shadow-[#C9A961]/20 rounded-full">
                  <Link href="/events">
                    행사 둘러보기
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-12 px-7 text-white hover:bg-white/8 rounded-full font-medium">
                  <Link href="/tours">산업관광 예약 →</Link>
                </Button>
              </div>
            </div>

            {/* 우측: 오늘의 산단 카드 */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl border border-white/10 bg-[#0A1628]/60 backdrop-blur-md p-6">
                <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-[#C9A961]/60 to-transparent" />
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] font-mono text-[#C9A961]">TODAY · 오늘의 산단</p>
                  <span className="text-[10px] text-slate-500 tabular-nums">{today.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="space-y-3">
                  {events.length > 0 ? events.slice(0, 3).map((e) => (
                    <Link key={e.id} href={`/events/${e.id}`} className="group flex items-start gap-3 hover:bg-white/3 rounded-lg px-2 py-2 -mx-2 transition-colors">
                      <div className="shrink-0 flex flex-col items-center w-10 pt-0.5">
                        <span className="text-[9px] text-slate-500 uppercase">{new Date(e.start_date).toLocaleString('en-US', { month: 'short' })}</span>
                        <span className="text-lg font-bold text-white tabular-nums leading-tight">{new Date(e.start_date).getDate()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-[#C9A961] font-medium">{EVENT_CATEGORY_MAP[e.category] ?? e.category}</p>
                        <p className="text-sm text-white font-medium leading-snug truncate">{e.title}</p>
                        {e.location && <p className="text-[11px] text-slate-400 truncate mt-0.5">{e.location}</p>}
                      </div>
                    </Link>
                  )) : (
                    <p className="py-6 text-center text-xs text-slate-500">예정된 행사가 없습니다</p>
                  )}
                </div>
                <Link href="/events" className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors">
                  <span>전체 행사 일정</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* KPI - 컨텍스트 추가 */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/2">
            {[
              { label: '입주기업', value: '42', unit: '개사', change: '+3', period: '전월 대비', icon: Building2 },
              { label: '연간 행사', value: '28', unit: '건', change: '진행 중 4', period: '2026년', icon: CalendarDays },
              { label: '예약 가능 공간', value: '15', unit: '곳', change: '오늘 가용 11', period: '실시간', icon: LayoutDashboard },
              { label: '견학 프로그램', value: '36', unit: '개', change: '신규 5', period: '이번 분기', icon: MapPin },
            ].map((kpi) => (
              <div key={kpi.label} className="group relative bg-[#0A1628]/40 p-6 transition-colors hover:bg-[#0A1628]/70">
                <div className="flex items-center justify-between">
                  <kpi.icon className="h-4 w-4 text-[#C9A961]/70 group-hover:text-[#C9A961] transition-colors" />
                  <span className="text-[10px] text-emerald-400 font-mono">{kpi.change}</span>
                </div>
                <p className="mt-4 flex items-baseline gap-1.5 font-bold text-white">
                  <span className="text-3xl md:text-4xl tracking-tight tabular-nums">{kpi.value}</span>
                  <span className="text-sm font-normal text-slate-500">{kpi.unit}</span>
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-300">{kpi.label}</p>
                  <p className="text-[10px] text-slate-500">{kpi.period}</p>
                </div>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-[#C9A961] transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px cmv-gold-line opacity-30" />
      </section>

      {/* ── Services ── */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-24">
          {/* 편집국 스타일 헤더 */}
          <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <p className="font-mono text-[11px] text-slate-400 mb-2">SECTION 01 · 핵심 서비스</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0A1628]">
                여섯 개의 운영 영역,<br className="md:hidden" /> 하나의 플랫폼
              </h2>
            </div>
            <div className="text-sm text-slate-500 max-w-sm md:text-right">
              <p>산업·문화·관광·스마트시티·AI·안전을 단일 디지털 환경으로 통합 운영합니다.</p>
              <Link href="/about" className="mt-2 inline-flex items-center gap-1 text-[#0A1628] font-medium hover:gap-2 transition-all">
                플랫폼 소개 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((card, idx) => (
              <Link key={card.href} href={card.href} className="group">
                <Card className="cmv-card-luxury relative h-full overflow-hidden border-slate-200/60 bg-white">
                  {/* 좌측 상단 인덱스 번호 — 편집국 느낌 */}
                  <span className="absolute top-5 right-5 font-mono text-[11px] text-slate-300 group-hover:text-[#C9A961] transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <CardContent className="p-7">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color} mb-5 transition-transform duration-500 group-hover:scale-110`}>
                      <card.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-[#0A1628]">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{card.description}</p>
                    <div className={`mt-6 flex items-center gap-1.5 text-sm font-semibold ${card.color}`}>
                      {card.cta}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events & Notices ── */}
      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-10 border-b border-slate-200 pb-6">
            <p className="font-mono text-[11px] text-slate-400 mb-2">SECTION 02 · 오늘의 산단</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0A1628]">행사 일정과 공지 안내</h2>
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Events */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg font-bold text-slate-900">예정 행사</h3>
                  <span className="text-xs text-slate-400 tabular-nums">{events.length}건</span>
                </div>
                <Link href="/events" className="flex items-center gap-1 text-sm text-[#0A1628] hover:text-[#C9A961] transition-colors">
                  전체 보기 <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {events.length === 0 ? (
                  <p className="text-sm text-slate-400 py-8 text-center">예정된 행사가 없습니다.</p>
                ) : events.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="flex items-start gap-4 rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-blue-50 py-2 text-center">
                        <span className="text-[10px] text-blue-500">{new Date(event.start_date).toLocaleString('ko-KR', { month: 'short' })}</span>
                        <span className="text-lg font-bold text-blue-700">{new Date(event.start_date).getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {EVENT_CATEGORY_MAP[event.category] ?? event.category}
                          </Badge>
                          {event.is_free && <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-emerald-600 border-emerald-300">무료</Badge>}
                        </div>
                        <p className="font-medium text-slate-800 truncate">{event.title}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(event.start_date)}</span>
                          {event.location && <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3" />{event.location}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Notices */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg font-bold text-slate-900">공지 / 기업지원</h3>
                  <span className="text-xs text-slate-400 tabular-nums">{notices.length + supportPosts.length}건</span>
                </div>
                <Link href="/support" className="flex items-center gap-1 text-sm text-[#0A1628] hover:text-[#C9A961] transition-colors">
                  전체 보기 <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-1">
                {/* Notices */}
                {notices.map((n) => (
                  <Link key={n.id} href={`/support#notice-${n.id}`}>
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors">
                      {n.is_pinned && <Badge className="bg-red-100 text-red-600 hover:bg-red-100 text-[10px] px-1.5 shrink-0">공지</Badge>}
                      <Megaphone className={`h-3.5 w-3.5 shrink-0 ${n.is_pinned ? 'text-red-400' : 'text-slate-400'}`} />
                      <span className="flex-1 truncate text-sm text-slate-700">{n.title}</span>
                      <span className="shrink-0 text-xs text-slate-400">{formatDate(n.created_at, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </Link>
                ))}
                {/* Support */}
                {supportPosts.map((s) => (
                  <Link key={s.id} href={`/support/${s.id}`}>
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors">
                      <Badge variant="outline" className="text-[10px] px-1.5 shrink-0 text-blue-600 border-blue-200">지원사업</Badge>
                      <span className="flex-1 truncate text-sm text-slate-700">{s.title}</span>
                      {s.deadline && (
                        <span className="shrink-0 text-xs text-orange-500">~{formatDate(s.deadline, { month: 'short', day: 'numeric' })}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tours ── */}
      <section className="bg-slate-50/60 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <p className="font-mono text-[11px] text-slate-400 mb-2">SECTION 03 · 산업관광</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0A1628]">
                현장에서 직접 만나는 경주의 산업
              </h2>
              <p className="mt-3 text-sm text-slate-500 max-w-xl">
                스마트팩토리·문화복합공간·EV모빌리티까지 — 학교·기업·관광객을 위한 차별화된 견학 프로그램.
              </p>
            </div>
            <Link href="/tours" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-[#0A1628] hover:text-[#C9A961] transition-colors">
              전체 프로그램 <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tours.length === 0 ? (
              <div className="col-span-4 py-12 text-center text-slate-400 text-sm">견학 프로그램이 없습니다.</div>
            ) : tours.map((tour, idx) => (
              <Link key={tour.id} href={`/tours/${tour.id}`} className="group">
                <Card className="h-full overflow-hidden border-slate-200/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200">
                  <div className="relative h-40 overflow-hidden bg-linear-to-br from-[#0A1628] via-[#3A8071] to-[#1F4F47]">
                    <div className="absolute inset-0 cmv-pattern-grid opacity-25" />
                    <span className="absolute top-3 left-3 font-mono text-[10px] text-white/40">TOUR.{String(idx + 1).padStart(2, '0')}</span>
                    <MapPin className="absolute bottom-4 right-4 h-10 w-10 text-white/20 transition-transform group-hover:scale-110" />
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-[#C9A961]/25 text-[#E8D4A1] border border-[#C9A961]/35 backdrop-blur-sm text-[10px]">
                        {TOUR_TYPE_LABEL_MAP[tour.tour_type] ?? tour.tour_type}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm leading-snug min-h-10">{tour.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      {tour.duration_hours && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {tour.duration_hours}시간
                        </span>
                      )}
                      {tour.max_participants && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> 최대 {tour.max_participants}인
                        </span>
                      )}
                    </div>
                    {tour.is_free && (
                      <Badge variant="outline" className="mt-3 text-[10px] text-emerald-600 border-emerald-300 bg-emerald-50">무료</Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI CTA — 럭셔리 ── */}
      <section className="relative overflow-hidden bg-[#050B1A]">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-[#050B1A] via-[#0A1628] to-[#0F2959]" />

        {/* 전통 격자 패턴 */}
        <div className="absolute inset-0 cmv-pattern-grid opacity-50" />

        {/* Glow accents */}
        <div className="absolute inset-0">
          <div className="cmv-halo top-0 left-1/4 h-125 w-125" style={{ background: 'radial-gradient(circle, rgba(201,169,97,0.18) 0%, transparent 70%)' }} />
          <div className="cmv-halo bottom-0 right-1/4 h-125 w-125" style={{ background: 'radial-gradient(circle, rgba(58,128,113,0.2) 0%, transparent 70%)' }} />
        </div>

        {/* Top & bottom gold lines */}
        <div className="absolute top-0 left-0 right-0 h-px cmv-gold-line opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-px cmv-gold-line opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left content */}
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] text-[#C9A961] mb-3">SECTION 04 · AI Assistant</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
                무엇이든 물어보세요.
                <br />
                <span className="cmv-gold-text-bright">AI</span>가 즉시 안내합니다.
              </h2>
              <p className="mt-5 text-base text-slate-300/90 max-w-xl leading-relaxed">
                행사·산업관광 견학·공간 예약·기업지원 사업·FAQ까지 — 24시간 대기 중인
                AI 안내 어시스턴트가 한 번의 질문으로 정확한 정보를 전달합니다.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="group h-12 px-8 bg-[#C9A961] text-[#0A1628] hover:bg-[#E8D4A1] font-semibold rounded-full shadow-2xl shadow-[#C9A961]/20">
                  <Link href="/ai-assistant">
                    <Bot className="mr-2 h-4 w-4" />
                    AI 챗봇 시작하기
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  지금 온라인 · 평균 응답 1초
                </div>
              </div>
            </div>

            {/* Right: 미니 챗봇 미리보기 */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* 골드 글로우 */}
                <div className="absolute -inset-1 bg-linear-to-br from-[#C9A961]/30 to-transparent rounded-3xl blur-xl" />
                <div className="relative rounded-3xl border border-white/10 bg-[#0A1628]/80 p-6 backdrop-blur-xl">
                  {/* 미니 헤더 */}
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#C9A961] to-[#8B7548]">
                      <Bot className="h-5 w-5 text-[#0A1628]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">CMV AI 어시스턴트</p>
                      <p className="text-[10px] text-slate-400">평균 응답 1초 이내</p>
                    </div>
                  </div>
                  {/* 샘플 메시지들 */}
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-tr-sm bg-[#C9A961] text-[#0A1628] px-4 py-2 max-w-[80%] text-sm font-medium">
                        견학 프로그램 알려줘
                      </div>
                    </div>
                    <div className="flex">
                      <div className="rounded-2xl rounded-tl-sm bg-white/10 text-slate-200 px-4 py-2.5 max-w-[85%] text-sm border border-white/10">
                        공장견학·체험형·산업문화·단체견학 등 4개 프로그램이 있어요. 원하시는 유형을 선택해주세요. ✨
                      </div>
                    </div>
                  </div>
                  {/* 입력창 모사 */}
                  <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5">
                    <span className="flex-1 text-xs text-slate-500">질문을 입력하세요...</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9A961]">
                      <ArrowRight className="h-3.5 w-3.5 text-[#0A1628]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SNS Connect Hub ── */}
      <section className="relative bg-[#FAFAF7] border-t border-slate-200/60">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <p className="font-mono text-[11px] text-slate-400 mb-2">SECTION 05 · 채널</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0A1628]">
                경주 문화선도산단을 <span className="cmv-gold-text">팔로우</span>하세요
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md md:text-right">
              채널마다 다른 콘텐츠로 행사·견학·기업지원 소식을 전달합니다.
            </p>
          </div>

          {/* SNS 채널 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 카카오톡 채널 */}
            <a
              href="https://pf.kakao.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 cmv-card-luxury"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEE500] text-[#191919] font-black text-sm shadow-sm">
                K
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">KakaoTalk</p>
                <p className="mt-1 text-sm font-bold text-slate-900">카카오톡 채널</p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">알림톡·민원 답변·실시간 안내</p>
              </div>
              <span className="absolute bottom-5 right-5 text-slate-300 group-hover:text-[#C9A961] transition-colors">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>

            {/* 네이버 블로그 */}
            <a
              href="https://blog.naver.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 cmv-card-luxury"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#03C75A] text-white font-black text-sm shadow-sm">
                N
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">Naver Blog</p>
                <p className="mt-1 text-sm font-bold text-slate-900">네이버 블로그</p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">기업지원 정보·산단 스토리</p>
              </div>
              <span className="absolute bottom-5 right-5 text-slate-300 group-hover:text-[#C9A961] transition-colors">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>

            {/* 유튜브 */}
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 cmv-card-luxury"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF0033] text-white shadow-sm">
                <YoutubeIcon className="h-5 w-5" />
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">YouTube</p>
                <p className="mt-1 text-sm font-bold text-slate-900">공식 유튜브</p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">현장 견학·홍보 영상</p>
              </div>
              <span className="absolute bottom-5 right-5 text-slate-300 group-hover:text-[#C9A961] transition-colors">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>

            {/* 인스타그램 */}
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 cmv-card-luxury"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-[#FFD600] via-[#F50057] to-[#7C4DFF] text-white shadow-sm">
                <InstagramIcon className="h-5 w-5" />
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">Instagram</p>
                <p className="mt-1 text-sm font-bold text-slate-900">인스타그램</p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">행사 사진·문화 비주얼</p>
              </div>
              <span className="absolute bottom-5 right-5 text-slate-300 group-hover:text-[#C9A961] transition-colors">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>

            {/* 페이스북 */}
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 cmv-card-luxury"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-sm">
                <FacebookIcon className="h-5 w-5" />
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">Facebook</p>
                <p className="mt-1 text-sm font-bold text-slate-900">페이스북</p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">공식 공지·커뮤니티</p>
              </div>
              <span className="absolute bottom-5 right-5 text-slate-300 group-hover:text-[#C9A961] transition-colors">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>

            {/* 뉴스레터 — 강조 */}
            <a
              href="#newsletter"
              className="group relative overflow-hidden rounded-2xl border border-[#C9A961]/40 bg-linear-to-br from-[#0A1628] to-[#0F2959] p-5 cmv-card-luxury"
            >
              <div className="absolute top-0 left-0 right-0 h-px cmv-gold-line opacity-60" />
              <div className="absolute inset-0 cmv-pattern-grid opacity-25" />

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A961] text-[#0A1628] shadow-md shadow-[#C9A961]/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-[#C9A961] uppercase">Newsletter</p>
                  <p className="mt-1 text-sm font-bold text-white">뉴스레터 구독</p>
                  <p className="mt-2 text-xs text-slate-300/80 leading-relaxed">월간 산단 소식·지원사업 안내</p>
                </div>
                <span className="absolute bottom-0 right-0 text-[#E8D4A1] group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          </div>

          {/* 뉴스레터 인라인 폼 (앵커 타겟) */}
          <div id="newsletter" className="mt-12 relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-8 py-10 md:px-10">
            <div className="cmv-halo -top-25 -right-20 h-80 w-80" style={{ background: 'radial-gradient(circle, rgba(201,169,97,0.10) 0%, transparent 70%)' }} />

            <div className="relative grid md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <Rss className="h-3.5 w-3.5 text-[#C9A961]" />
                  <span className="text-[10px] font-semibold tracking-[0.28em] text-[#C9A961] uppercase">Monthly Digest</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#0A1628] tracking-tight">
                  매월 첫째 주, <span className="cmv-gold-text">산단 소식</span>을 이메일로 받아보세요
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  공지·지원사업·신규 행사·견학 일정을 한 번에 정리해 드립니다. 언제든 구독 해지 가능합니다.
                </p>
              </div>
              <form className="flex w-full md:w-auto items-center gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 md:w-72 h-12 rounded-full border border-slate-300 px-5 text-sm focus:border-[#C9A961] focus:outline-none focus:ring-2 focus:ring-[#C9A961]/20"
                  aria-label="이메일 주소"
                />
                <Button
                  type="submit"
                  className="h-12 px-6 bg-[#0A1628] hover:bg-[#0F2959] text-white rounded-full font-semibold shrink-0"
                >
                  구독하기
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-10 border-b border-slate-200 pb-6">
            <p className="font-mono text-[11px] text-slate-400 mb-2">SECTION 06 · 문의 · Contact</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left — 헤딩 + CTA */}
            <div className="lg:col-span-7">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A1628] tracking-tight leading-tight">
                함께 만들어가는
                <br />
                <span className="cmv-gold-text">경주의 새로운 시대.</span>
              </h2>
              <p className="mt-6 text-base text-slate-500 max-w-xl leading-relaxed">
                입주 상담·기업지원·행사 및 견학 관련 문의를 받고 있습니다.
                경주 문화선도산단의 일원이 되어 새로운 가치를 함께 만들어 가세요.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 px-8 bg-[#0A1628] hover:bg-[#0F2959] text-white rounded-full font-semibold">
                  <Link href="/contact">문의하기 <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 border-slate-300 hover:bg-slate-50 hover:border-[#C9A961] rounded-full font-medium">
                  <Link href="/support">기업지원 안내</Link>
                </Button>
              </div>
            </div>

            {/* Right — 연락 카드 */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-[#FAFAF7] p-7">
                <p className="font-mono text-[10px] text-slate-400 mb-5">DIRECT CONTACT</p>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <Phone className="h-4 w-4 mt-1 text-[#C9A961] shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">대표 전화</p>
                      <p className="text-base font-semibold text-[#0A1628] tabular-nums">{CONTACT.phone}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{CONTACT.phoneHours}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Mail className="h-4 w-4 mt-1 text-[#C9A961] shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">대표 이메일</p>
                      <p className="text-base font-semibold text-[#0A1628]">{CONTACT.email}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{CONTACT.emailNote}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <MapPin className="h-4 w-4 mt-1 text-[#C9A961] shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">방문 주소</p>
                      <p className="text-base font-semibold text-[#0A1628]">{CONTACT.address}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{CONTACT.addressNote}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
