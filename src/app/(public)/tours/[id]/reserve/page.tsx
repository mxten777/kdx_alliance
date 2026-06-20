import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TourReserveForm } from '@/features/tours/components/TourReserveForm'
import { ArrowLeft } from 'lucide-react'
import type { Tour } from '@/types/models'

export default async function TourReservePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('tours').select('*').eq('id', id).single()
  if (!data) notFound()
  const tour = data as Tour

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href={`/tours/${id}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0A1628] transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> 견학 상세로
      </Link>

      <div className="relative overflow-hidden mb-8 rounded-3xl border border-[#C9A961]/20 bg-linear-to-br from-[#050B1A] via-[#0A1628] to-[#0F2959] px-7 py-8 text-white">
        <div className="absolute top-0 left-0 right-0 h-px cmv-gold-line opacity-60" />
        <div className="absolute inset-0 cmv-pattern-grid opacity-20" />

        <div className="relative">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-[#C9A961]" />
            <span className="text-[10px] font-semibold tracking-[0.32em] text-[#E8D4A1] uppercase">
              Tour Reservation
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{tour.title}</h1>
          {tour.operating_hours && (
            <p className="text-sm text-slate-300/80 mt-2">
              운영: {tour.operating_days.join(', ')}요일 · {tour.operating_hours}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 font-bold text-slate-900">예약 정보 입력</h2>
        <TourReserveForm
          tourId={tour.id}
          tourTitle={tour.title}
          minParticipants={tour.min_participants}
          maxParticipants={tour.max_participants ?? undefined}
          operatingDays={tour.operating_days}
        />
      </div>
    </div>
  )
}
