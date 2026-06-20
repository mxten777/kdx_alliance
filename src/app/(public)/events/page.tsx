import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Clock, MapPin, Users, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { EventStatusBadge } from '@/components/common/StatusBadge'
import type { Event } from '@/types/models'
import { EVENT_CATEGORY_MAP } from '@/lib/constants/categories'

const categories = ['전체', '축제', '전시', '공연', '세미나', '기업행사', '투어']

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const categoryParam = params.category
  const statusParam = params.status

  let query = supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true })

  if (statusParam && statusParam !== 'all') {
    query = query.eq('status', statusParam)
  } else {
    query = query.in('status', ['published', 'ongoing', 'completed'])
  }

  if (categoryParam && categoryParam !== '전체') {
    const reverseMap: Record<string, string> = {
      '축제': 'festival', '전시': 'exhibition', '공연': 'performance',
      '세미나': 'seminar', '기업행사': 'corporate', '투어': 'tour',
    }
    const slug = reverseMap[categoryParam]
    if (slug) query = query.eq('category', slug)
  }

  const { data } = await query.limit(24)
  const events = (data ?? []) as Event[]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Hero */}
      <PageHero
        eyebrow="Events & Programs"
        title={<>문화 · 산업 · 네트워킹 <span className="cmv-gold-text-bright">행사</span></>}
        description="경주 문화선도산단의 다양한 행사·프로그램을 한눈에 보고, 바로 신청하세요."
        className="mb-10"
      />

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = (!categoryParam && cat === '전체') || categoryParam === cat
          return (
            <Link
              key={cat}
              href={cat === '전체' ? '/events' : `/events?category=${cat}`}
            >
              <Button
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={
                  isActive
                    ? 'bg-[#0A1628] text-white hover:bg-[#0F2959] rounded-full px-4'
                    : 'border-slate-300 text-slate-700 hover:border-[#C9A961] hover:text-[#0A1628] rounded-full px-4'
                }
              >
                {cat}
              </Button>
            </Link>
          )
        })}
      </div>

      {/* Status filter */}
      <div className="mb-8 flex gap-2">
        {[
          { value: undefined, label: '전체 일정' },
          { value: 'published', label: '예정' },
          { value: 'ongoing', label: '진행중' },
          { value: 'completed', label: '종료' },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.value ? `/events?status=${s.value}${categoryParam ? `&category=${categoryParam}` : ''}` : `/events${categoryParam ? `?category=${categoryParam}` : ''}`}
          >
            <Button
              variant={statusParam === s.value || (!statusParam && !s.value) ? 'secondary' : 'ghost'}
              size="sm"
              className="text-sm"
            >
              {s.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Grid */}
      {events.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <CalendarDays className="mx-auto h-12 w-12 mb-3 opacity-30" />
          <p>해당 조건의 행사가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="h-full cursor-pointer cmv-card-luxury overflow-hidden">
                <div className="relative h-44 bg-linear-to-br from-[#0A1628] via-[#0F2959] to-[#1A4A8F] flex items-end p-4 overflow-hidden">
                  <div className="absolute inset-0 cmv-pattern-grid opacity-30" />
                  <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-[#C9A961]" />
                  <CalendarDays className="absolute top-5 left-5 h-7 w-7 text-white/15" />
                  <div className="relative flex gap-2">
                    <EventStatusBadge status={event.status} />
                    <Badge className="bg-[#C9A961]/20 text-[#E8D4A1] border border-[#C9A961]/30 text-[10px] hover:bg-[#C9A961]/20">
                      {EVENT_CATEGORY_MAP[event.category] ?? event.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-800 line-clamp-2 leading-snug">{event.title}</h3>
                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {formatDate(event.start_date)} ~ {formatDate(event.end_date)}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />{event.location}
                      </div>
                    )}
                    {event.max_participants && (
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        {event.current_participants}/{event.max_participants}명
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {event.is_free
                      ? <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">무료</Badge>
                      : <Badge variant="outline" className="text-[10px]">{event.ticket_price.toLocaleString()}원</Badge>
                    }
                    <span className="flex items-center gap-0.5 text-xs text-blue-600">
                      자세히 <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
