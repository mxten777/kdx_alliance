import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, MapPin, Users, Phone, Mail, ArrowLeft, AlertCircle, ParkingCircle } from 'lucide-react'
import type { Tour } from '@/types/models'
import { TOUR_TYPE_LABEL_MAP } from '@/lib/constants/categories'

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase.from('tours').select('*').eq('id', id).single()
  if (!data) notFound()
  const tour = data as Tour

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/tours" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0A1628] transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> 견학 목록으로
      </Link>

      <div className="relative overflow-hidden rounded-3xl border border-[#C9A961]/20 bg-linear-to-br from-[#050B1A] via-[#0A1628] to-[#0F2959] px-8 py-12 md:py-14 text-white mb-8">
        <div className="absolute top-0 left-0 right-0 h-px cmv-gold-line opacity-60" />
        <div className="absolute inset-0 cmv-pattern-grid opacity-20" />
        <div
          className="cmv-halo -top-20 -right-20 h-80 w-80"
          style={{ background: 'radial-gradient(circle, rgba(58,128,113,0.24) 0%, transparent 70%)' }}
        />

        <div className="relative">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-[#C9A961]" />
            <span className="text-[10px] font-semibold tracking-[0.32em] text-[#E8D4A1] uppercase">
              {TOUR_TYPE_LABEL_MAP[tour.tour_type] ?? tour.tour_type}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15]">{tour.title}</h1>
          {tour.description && (
            <p className="mt-4 text-base text-slate-200/90 max-w-2xl leading-relaxed">{tour.description}</p>
          )}
          {tour.is_free && (
            <div className="mt-6">
              <Badge className="bg-[#3A8071]/30 text-[#E8D4A1] text-xs border border-[#3A8071]/40 hover:bg-[#3A8071]/30">무료 프로그램</Badge>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-5">
          {tour.content && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-3 font-bold text-slate-900">프로그램 소개</h2>
              <div className="text-sm text-slate-600 whitespace-pre-wrap">{tour.content}</div>
            </div>
          )}

          {tour.requirements && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-amber-800">
                <AlertCircle className="h-4 w-4" /> 참가 전 준비사항
              </h3>
              <p className="text-sm text-amber-700 whitespace-pre-wrap">{tour.requirements}</p>
            </div>
          )}

          {tour.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tour.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-5 space-y-3">
            <h3 className="font-semibold text-slate-900">견학 정보</h3>
            <Separator />
            <div className="space-y-2.5 text-sm text-slate-600">
              {tour.duration_hours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  소요 {tour.duration_hours}시간
                </div>
              )}
              {tour.operating_days.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="h-4 w-4 text-slate-400 shrink-0 mt-0.5">📅</span>
                  {tour.operating_days.join(', ')}요일
                  {tour.operating_hours && <span className="text-slate-400"> · {tour.operating_hours}</span>}
                </div>
              )}
              {tour.max_participants && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  최소 {tour.min_participants}인 ~ 최대 {tour.max_participants}인
                </div>
              )}
              {tour.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  {tour.location}
                </div>
              )}
              {tour.meeting_point && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0">📍</span>
                  <div>
                    <p className="text-xs text-slate-400">집결 장소</p>
                    <p>{tour.meeting_point}</p>
                  </div>
                </div>
              )}
              {tour.parking_info && (
                <div className="flex items-start gap-2">
                  <ParkingCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">주차 안내</p>
                    <p>{tour.parking_info}</p>
                  </div>
                </div>
              )}
              {tour.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {tour.contact_phone}
                </div>
              )}
              {tour.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {tour.contact_email}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">참가비</span>
              <span className="font-bold">{tour.is_free ? '무료' : `${tour.fee.toLocaleString()}원`}</span>
            </div>
            {(tour.status === 'published' || tour.status === 'ongoing') ? (
              <Button asChild className="w-full h-11 bg-[#C9A961] hover:bg-[#E8D4A1] text-[#0A1628] font-semibold rounded-full shadow-lg shadow-[#C9A961]/20">
                <Link href={`/tours/${tour.id}/reserve`}>예약 신청</Link>
              </Button>
            ) : (
              <Button className="w-full" disabled>예약 불가</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
