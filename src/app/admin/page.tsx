import { createClient } from '@/lib/supabase/server'
import { KpiCard } from '@/components/common/KpiCard'
import {
  CalendarDays, MapPin, Building2, MessageSquare,
  Users, ParkingCircle, Shield, FileText
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { ReservationStatusBadge } from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/utils'

const COLORS = ['#0F2959', '#2563EB', '#10B981', '#F59E0B', '#EF4444']

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  type EventReg = {
    id: string
    applicant_name: string
    status: string
    created_at: string
    events: { title: string } | null
  }
  type TourResv = {
    id: string
    applicant_name: string
    status: string
    desired_date: string
    tours: { title: string } | null
  }

  const [
    eventsCount, eventRegsCount, tourResvCount, spaceResvCount,
    inquiriesCount, orgsCount, parkingZones, safetyEvents,
    recentRegs, recentTourResvs, inquiryTypes
  ] = await Promise.all([
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('event_registrations').select('id', { count: 'exact', head: true }),
    supabase.from('tour_reservations').select('id', { count: 'exact', head: true }),
    supabase.from('space_reservations').select('id', { count: 'exact', head: true }),
    supabase.from('inquiries').select('id', { count: 'exact', head: true }),
    supabase.from('public_organizations').select('id', { count: 'exact', head: true }),
    supabase.from('parking_zones').select('name, total_spaces, occupied_spaces, code').eq('is_active', true),
    supabase.from('safety_events').select('id', { count: 'exact', head: true }).eq('is_resolved', false),
    supabase.from('event_registrations').select('id, applicant_name, status, created_at, events(title)').order('created_at', { ascending: false }).limit(5),
    supabase.from('tour_reservations').select('id, applicant_name, status, desired_date, tours(title)').order('created_at', { ascending: false }).limit(5),
    supabase.from('inquiries').select('inquiry_type').eq('status', 'new'),
  ])

  const kpis = [
    { label: '총 행사 수', value: eventsCount.count ?? 0, icon: CalendarDays, iconColor: 'text-blue-600' },
    { label: '행사 신청 수', value: eventRegsCount.count ?? 0, icon: FileText, iconColor: 'text-indigo-600' },
    { label: '견학 예약 수', value: tourResvCount.count ?? 0, icon: MapPin, iconColor: 'text-emerald-600' },
    { label: '공간 예약 수', value: spaceResvCount.count ?? 0, icon: Building2, iconColor: 'text-orange-600' },
    { label: '문의 수', value: inquiriesCount.count ?? 0, icon: MessageSquare, iconColor: 'text-violet-600' },
    { label: '기업/기관 수', value: orgsCount.count ?? 0, icon: Users, iconColor: 'text-slate-600' },
  ]

  // 주차 현황 차트 데이터
  const parkingData = (parkingZones.data ?? []).map((z) => ({
    name: z.name,
    사용중: z.occupied_spaces,
    여유: z.total_spaces - z.occupied_spaces,
    전체: z.total_spaces,
  }))

  // 문의 유형 분포
  const inquiryTypeCount: Record<string, number> = {}
  for (const item of (inquiryTypes.data ?? [])) {
    inquiryTypeCount[item.inquiry_type] = (inquiryTypeCount[item.inquiry_type] ?? 0) + 1
  }
  const inquiryTypeLabel: Record<string, string> = {
    general: '일반', event: '행사', tour: '견학', support: '기업지원', civil: '민원', partnership: '제휴'
  }
  const pieData = Object.entries(inquiryTypeCount).map(([k, v]) => ({
    name: inquiryTypeLabel[k] ?? k, value: v
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">통합 대시보드</h1>
        <p className="text-sm text-slate-500 mt-0.5">경주 문화선도산단 운영 현황</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Parking status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ParkingCircle className="h-4 w-4 text-orange-500" /> 주차 현황 (스마트한)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={parkingData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="사용중" stackId="a" fill="#2563EB" />
                <Bar dataKey="여유" stackId="a" fill="#DBEAFE" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inquiry type pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <MessageSquare className="h-4 w-4 text-violet-500" /> 신규 문의 유형 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="flex h-50 items-center justify-center text-slate-400 text-sm">
                신규 문의 없음
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent event registrations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <CalendarDays className="h-4 w-4 text-blue-500" /> 최근 행사 신청
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">신청자</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">행사명</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">상태</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">신청일</th>
                </tr>
              </thead>
              <tbody>
                {(recentRegs.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">신청 내역 없음</td>
                  </tr>
                ) : (recentRegs.data as EventReg[] ?? []).map((reg) => (
                  <tr key={reg.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2.5">{reg.applicant_name}</td>
                    <td className="px-4 py-2.5 max-w-37.5 truncate text-slate-600">
                      {reg.events?.title ?? '-'}
                    </td>
                    <td className="px-4 py-2.5">
                      <ReservationStatusBadge status={reg.status} />
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs">{formatDate(reg.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Recent tour reservations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <MapPin className="h-4 w-4 text-emerald-500" /> 최근 견학 예약
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">신청자</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">프로그램</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">희망일</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">상태</th>
                </tr>
              </thead>
              <tbody>
                {(recentTourResvs.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">예약 내역 없음</td>
                  </tr>
                ) : (recentTourResvs.data as TourResv[] ?? []).map((rsv) => (
                  <tr key={rsv.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2.5">{rsv.applicant_name}</td>
                    <td className="px-4 py-2.5 max-w-32.5 truncate text-slate-600">
                      {rsv.tours?.title ?? '-'}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs">{rsv.desired_date}</td>
                    <td className="px-4 py-2.5">
                      <ReservationStatusBadge status={rsv.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Safety alert */}
      {(safetyEvents.count ?? 0) > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-red-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-700">미처리 안전 이벤트 {safetyEvents.count}건</p>
            <p className="text-sm text-red-600">스마트안전 관리 화면에서 확인하세요.</p>
          </div>
          <a href="/admin/safety" className="text-sm text-red-600 hover:underline">확인하기 →</a>
        </div>
      )}
    </div>
  )
}
