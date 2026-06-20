import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Users, MapPin, Clock, ArrowLeft } from 'lucide-react'
import type { Space } from '@/types/models'

export default async function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('spaces').select('*').eq('id', id).single()
  if (!data) notFound()
  const space = data as Space

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/spaces" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0A1628] transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> 공간 목록으로
      </Link>

      <div className="relative overflow-hidden rounded-3xl border border-[#C9A961]/20 bg-linear-to-br from-[#050B1A] via-[#0A1628] to-[#0F2959] px-8 py-12 md:py-14 text-white mb-8">
        <div className="absolute top-0 left-0 right-0 h-px cmv-gold-line opacity-60" />
        <div className="absolute inset-0 cmv-pattern-grid opacity-20" />
        <div
          className="cmv-halo -top-20 -right-15 h-80 w-80"
          style={{ background: 'radial-gradient(circle, rgba(201,169,97,0.18) 0%, transparent 70%)' }}
        />

        <div className="relative">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-[#C9A961]" />
            <span className="text-[10px] font-semibold tracking-[0.32em] text-[#E8D4A1] uppercase">
              Space &middot; Facility
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15]">{space.name}</h1>
          {space.description && (
            <p className="mt-4 text-base text-slate-200/90 max-w-2xl leading-relaxed">{space.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-5">
          {space.content && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-3 font-bold text-slate-900">시설 안내</h2>
              <div className="text-sm text-slate-600 whitespace-pre-wrap">{space.content}</div>
            </div>
          )}
          {space.equipment.length > 0 && (
            <div className="rounded-xl border bg-white p-5">
              <h3 className="mb-3 font-semibold text-slate-900">구비 장비</h3>
              <div className="flex flex-wrap gap-2">
                {space.equipment.map((eq) => (
                  <Badge key={eq} variant="secondary" className="text-xs">{eq}</Badge>
                ))}
              </div>
            </div>
          )}
          {space.rules && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="mb-2 font-semibold text-amber-800">이용 규칙</h3>
              <p className="text-sm text-amber-700 whitespace-pre-wrap">{space.rules}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-5 space-y-3">
            <h3 className="font-semibold text-slate-900">시설 정보</h3>
            <Separator />
            <div className="space-y-2.5 text-sm text-slate-600">
              {space.capacity && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />수용 {space.capacity}인
                </div>
              )}
              {space.area_sqm && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />{space.area_sqm}㎡
                </div>
              )}
              {(space.floor || space.building) && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📍</span>
                  {space.building} {space.floor}
                </div>
              )}
              {space.operating_hours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />{space.operating_hours}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-slate-500">이용 요금</span>
              <span className="font-bold">{space.is_free ? '무료' : `${space.hourly_rate.toLocaleString()}원/시간`}</span>
            </div>
            <Button asChild className="w-full h-11 bg-[#0A1628] hover:bg-[#0F2959] text-white rounded-full font-semibold">
              <Link href={`/spaces/${space.id}/reserve`}>예약 신청</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
