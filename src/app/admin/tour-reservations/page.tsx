import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/common/PageHeader'
import { ReservationStatusBadge } from '@/components/common/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import type { ReservationStatus } from '@/types/models'

type TourReservation = {
  id: string
  applicant_name: string
  organization: string
  desired_date: string
  participant_count: number
  phone: string
  status: ReservationStatus
  created_at: string
  tours: { title: string; tour_type: string } | null
}

export default async function TourReservationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const pageSize = 20
  const offset = (page - 1) * pageSize

  let query = supabase
    .from('tour_reservations')
    .select('*, tours(title, tour_type)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }

  const { data, count } = await query
  const reservations = (data ?? []) as TourReservation[]
  const totalPages = Math.ceil((count ?? 0) / pageSize)

  const statusLabels: Record<string, string> = {
    pending: '신규', reviewing: '검토중', approved: '승인', rejected: '반려', completed: '완료', cancelled: '취소'
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="견학 예약 관리"
        description="산업관광/견학 예약 신청을 확인하고 승인/반려 처리합니다."
      />

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: '', label: '전체' },
          { value: 'pending', label: '신규' },
          { value: 'reviewing', label: '검토중' },
          { value: 'approved', label: '승인' },
          { value: 'rejected', label: '반려' },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.value ? `/admin/tour-reservations?status=${s.value}` : '/admin/tour-reservations'}
          >
            <Badge
              variant={params.status === s.value || (!params.status && !s.value) ? 'default' : 'outline'}
              className="cursor-pointer text-sm py-1 px-3"
            >
              {s.label}
            </Badge>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">신청자</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">단체명</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">프로그램</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">희망일</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">인원</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">연락처</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">상태</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">신청일</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-400">예약 내역이 없습니다.</td>
                  </tr>
                ) : reservations.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{r.applicant_name}</td>
                    <td className="px-4 py-3 text-slate-600">{r.organization}</td>
                    <td className="px-4 py-3 max-w-40 truncate text-slate-600">
                      {r.tours?.title ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.desired_date}</td>
                    <td className="px-4 py-3">{r.participant_count}인</td>
                    <td className="px-4 py-3 text-slate-500">{r.phone}</td>
                    <td className="px-4 py-3">
                      <ReservationStatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/admin/tour-reservations?page=${p}${params.status ? `&status=${params.status}` : ''}`}>
                  <Badge variant={page === p ? 'default' : 'outline'} className="cursor-pointer">{p}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
