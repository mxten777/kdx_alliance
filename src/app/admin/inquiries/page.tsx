import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/common/PageHeader'
import { InquiryStatusBadge } from '@/components/common/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import { INQUIRY_TYPE_LABEL_MAP } from '@/lib/constants/categories'
import type { InquiryStatus } from '@/types/models'

type Inquiry = {
  id: string
  inquiry_type: string
  applicant_name: string
  organization: string | null
  subject: string
  phone: string
  status: InquiryStatus
  created_at: string
}

const inquiryTypeLabel = INQUIRY_TYPE_LABEL_MAP

export default async function InquiriesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  let query = supabase
    .from('inquiries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(30)

  if (params.status) query = query.eq('status', params.status)
  if (params.type) query = query.eq('inquiry_type', params.type)

  const { data, count } = await query
  const inquiries = (data ?? []) as Inquiry[]

  return (
    <div className="space-y-5">
      <PageHeader
        title="문의 관리"
        description={`총 ${count ?? 0}건의 문의 내역`}
      />

      <div className="flex flex-wrap gap-2">
        {[
          { value: '', label: '전체 상태' },
          { value: 'new', label: '신규' },
          { value: 'in_progress', label: '처리중' },
          { value: 'resolved', label: '완료' },
        ].map((s) => (
          <Link key={s.label} href={s.value ? `/admin/inquiries?status=${s.value}` : '/admin/inquiries'}>
            <Badge variant={params.status === s.value || (!params.status && !s.value) ? 'default' : 'outline'} className="cursor-pointer py-1 px-3">
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
                  <th className="px-4 py-3 text-left font-medium text-slate-500">유형</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">이름</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">소속</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">제목</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">연락처</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">상태</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">접수일시</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-400">문의 내역이 없습니다.</td>
                  </tr>
                ) : inquiries.map((inq) => (
                  <tr key={inq.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-[10px]">
                        {inquiryTypeLabel[inq.inquiry_type] ?? inq.inquiry_type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{inq.applicant_name}</td>
                    <td className="px-4 py-3 text-slate-500">{inq.organization ?? '-'}</td>
                    <td className="px-4 py-3 max-w-50 truncate">{inq.subject}</td>
                    <td className="px-4 py-3 text-slate-500">{inq.phone}</td>
                    <td className="px-4 py-3">
                      <InquiryStatusBadge status={inq.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{formatDateTime(inq.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
