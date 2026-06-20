import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, MapPin, Clock, ArrowRight } from 'lucide-react'
import type { Space } from '@/types/models'
import { SPACE_TYPE_MAP } from '@/lib/constants/categories'
import { PageHero } from '@/components/layout/PageHero'

export default async function SpacesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('spaces')
    .select('*')
    .eq('is_available', true)
    .order('space_type')

  const spaces = (data ?? []) as Space[]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Hero */}
      <PageHero
        eyebrow="Spaces & Facilities"
        title={<>예약 가능한 <span className="cmv-gold-text-bright">공간 · 시설</span></>}
        description="회의실·교육장·전시홀·다목적홀 등 산단 내 모든 공간을 한 번에 확인하고 예약하세요."
        haloColor="rgba(58,128,113,0.22)"
        className="mb-10"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {spaces.map((space) => {
          const typeInfo = SPACE_TYPE_MAP[space.space_type] ?? { label: space.space_type, color: 'bg-gray-100 text-gray-700' }
          return (
            <Link key={space.id} href={`/spaces/${space.id}`}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="h-36 rounded-t-xl bg-linear-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                  <MapPin className="h-10 w-10 text-white/40" />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-800">{space.name}</h3>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  {space.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{space.description}</p>
                  )}
                  <div className="space-y-1 text-xs text-slate-500">
                    {space.capacity && (
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3" /> 수용 {space.capacity}인
                      </div>
                    )}
                    {space.area_sqm && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" /> {space.area_sqm}㎡
                        {space.floor && ` · ${space.floor}`}
                        {space.building && ` · ${space.building}`}
                      </div>
                    )}
                    {space.operating_hours && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> {space.operating_hours}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    {space.is_free
                      ? <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">무료</Badge>
                      : <Badge variant="outline" className="text-[10px]">{space.hourly_rate.toLocaleString()}원/시간</Badge>
                    }
                    <span className="flex items-center gap-0.5 text-xs text-blue-600">
                      예약 신청 <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
