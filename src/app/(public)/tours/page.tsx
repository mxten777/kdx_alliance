import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react'
import type { Tour } from '@/types/models'
import { TOUR_TYPE_MAP } from '@/lib/constants/categories'
import { PageHero } from '@/components/layout/PageHero'

const dayMap: Record<string, string> = {
  '월': 'Mon', '화': 'Tue', '수': 'Wed', '목': 'Thu', '금': 'Fri', '토': 'Sat', '일': 'Sun'
}

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  let query = supabase
    .from('tours')
    .select('*')
    .in('status', ['published', 'ongoing'])
    .order('created_at', { ascending: false })

  if (params.type && params.type !== 'all') {
    query = query.eq('tour_type', params.type)
  }

  const { data } = await query.limit(20)
  const tours = (data ?? []) as Tour[]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Hero */}
      <PageHero
        eyebrow="Industrial · Cultural Tours"
        title={<>경주 산업관광 / <span className="cmv-gold-text-bright">현장 견학</span></>}
        description="스마트팩토리·문화복합공간·EV모빌리티 현장을 직접 체험하세요. 학교·기업·관광객 모두를 위한 다양한 견학 프로그램이 준비되어 있습니다."
        haloColor="rgba(58,128,113,0.28)"
        className="mb-12"
      >{
        /* extra bottom-left halo */
      }
        <div
          className="cmv-halo -bottom-30 -left-25 h-96 w-96"
          style={{ background: 'radial-gradient(circle, rgba(201,169,97,0.18) 0%, transparent 70%)' }}
        />
      </PageHero>

      {/* Type filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {[
          { value: undefined, label: '전체' },
          { value: 'factory', label: '공장견학' },
          { value: 'experience', label: '체험형' },
          { value: 'culture', label: '산업문화 투어' },
          { value: 'group', label: '단체견학' },
        ].map((t) => {
          const isActive = params.type === t.value || (!params.type && !t.value)
          return (
            <Link key={t.label} href={t.value ? `/tours?type=${t.value}` : '/tours'}>
              <Button
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={
                  isActive
                    ? 'bg-[#0A1628] text-white hover:bg-[#0F2959] rounded-full px-4'
                    : 'border-slate-300 text-slate-700 hover:border-[#C9A961] hover:text-[#0A1628] rounded-full px-4'
                }
              >
                {t.label}
              </Button>
            </Link>
          )
        })}
      </div>

      {/* Grid */}
      {tours.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <MapPin className="mx-auto h-12 w-12 mb-3 opacity-30" />
          <p>해당 유형의 견학 프로그램이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => {
            const typeInfo = TOUR_TYPE_MAP[tour.tour_type] ?? { label: tour.tour_type, color: 'bg-gray-100 text-gray-700' }
            return (
              <Link key={tour.id} href={`/tours/${tour.id}`}>
                <Card className="h-full cursor-pointer cmv-card-luxury overflow-hidden">
                  <div className="relative h-40 bg-linear-to-br from-[#0A1628] via-[#3A8071] to-[#1F4F47] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 cmv-pattern-grid opacity-30" />
                    <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-[#C9A961]" />
                    <MapPin className="relative h-12 w-12 text-white/30" />
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-[#C9A961]/25 text-[#E8D4A1] border border-[#C9A961]/35 backdrop-blur-sm">
                        {typeInfo.label}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-slate-800 line-clamp-2 leading-snug text-base">{tour.title}</h3>
                    {tour.description && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{tour.description}</p>
                    )}
                    <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                      {tour.duration_hours && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> 소요 시간 약 {tour.duration_hours}시간
                        </div>
                      )}
                      {tour.max_participants && (
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3 w-3" />
                          {tour.min_participants}~{tour.max_participants}인
                        </div>
                      )}
                      {tour.operating_days.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">운영일:</span>
                          {tour.operating_days.join(', ')}요일
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      {tour.is_free
                        ? <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">무료</Badge>
                        : <Badge variant="outline" className="text-[10px]">{tour.fee.toLocaleString()}원</Badge>
                      }
                      <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-medium">
                        예약 신청 <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
