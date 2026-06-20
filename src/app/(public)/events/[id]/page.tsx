import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { EventStatusBadge } from '@/components/common/StatusBadge'
import { CalendarDays, Clock, MapPin, Users, Phone, Mail, ArrowLeft } from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/utils'
import type { Event } from '@/types/models'
import { EVENT_CATEGORY_MAP } from '@/lib/constants/categories'

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const event = data as Event

  const isRegistrationOpen = event.registration_end
    ? new Date(event.registration_end) > new Date()
    : true
  const isFull = event.max_participants
    ? event.current_participants >= event.max_participants
    : false

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/events" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0A1628] transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> 행사 목록으로
      </Link>

      {/* Header card — 럭셔리 톤 */}
      <div className="relative overflow-hidden rounded-3xl border border-[#C9A961]/20 bg-linear-to-br from-[#050B1A] via-[#0A1628] to-[#0F2959] px-8 py-12 md:py-14 text-white mb-8">
        <div className="absolute top-0 left-0 right-0 h-px cmv-gold-line opacity-60" />
        <div className="absolute inset-0 cmv-pattern-grid opacity-20" />
        <div
          className="cmv-halo -top-20 -right-15 h-80 w-80"
          style={{ background: 'radial-gradient(circle, rgba(201,169,97,0.20) 0%, transparent 70%)' }}
        />

        <div className="relative">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-[#C9A961]" />
            <span className="text-[10px] font-semibold tracking-[0.32em] text-[#E8D4A1] uppercase">
              {EVENT_CATEGORY_MAP[event.category] ?? event.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15]">{event.title}</h1>
          {event.description && (
            <p className="mt-4 text-base text-slate-200/90 max-w-2xl leading-relaxed">{event.description}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-2">
            <EventStatusBadge status={event.status} />
            {event.is_free && (
              <Badge className="bg-[#3A8071]/30 text-[#E8D4A1] text-xs border border-[#3A8071]/40 hover:bg-[#3A8071]/30">무료</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {event.content && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-base font-bold text-slate-900">행사 안내</h2>
              <div className="prose prose-slate max-w-none text-sm whitespace-pre-wrap">
                {event.content}
              </div>
            </div>
          )}

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Info card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="font-semibold text-slate-900">행사 정보</h3>
            <Separator />
            <div className="space-y-2.5 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <CalendarDays className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                <div>
                  <p>{formatDate(event.start_date)}</p>
                  <p className="text-slate-400">~ {formatDate(event.end_date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                <span>{formatDateTime(event.start_date).split(' ')[1]}</span>
              </div>
              {event.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.max_participants && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>
                    {event.current_participants}/{event.max_participants}명
                    {isFull && <span className="ml-1 text-red-500">(마감)</span>}
                  </span>
                </div>
              )}
              {event.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{event.contact_phone}</span>
                </div>
              )}
              {event.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="break-all">{event.contact_email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">참가비</span>
              <span className="font-bold text-slate-900">
                {event.is_free ? '무료' : `${event.ticket_price.toLocaleString()}원`}
              </span>
            </div>
            {event.registration_end && (
              <p className="mb-3 text-xs text-slate-400">
                신청 마감: {formatDate(event.registration_end)}
              </p>
            )}
            {event.status === 'published' || event.status === 'ongoing' ? (
              <Button
                asChild
                className="w-full h-11 bg-[#C9A961] hover:bg-[#E8D4A1] text-[#0A1628] font-semibold rounded-full shadow-lg shadow-[#C9A961]/20"
                disabled={isFull || !isRegistrationOpen}
              >
                <Link href={`/events/${event.id}/apply`}>
                  {isFull ? '마감' : !isRegistrationOpen ? '신청 기간 종료' : '참가 신청'}
                </Link>
              </Button>
            ) : (
              <Button className="w-full" disabled>신청 불가</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
