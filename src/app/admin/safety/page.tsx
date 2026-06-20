import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SeverityBadge } from '@/components/common/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertTriangle, Users, Tag, MapPin } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { SafetyEvent, SafetyProfile, SafetyTag, SafetyZone } from '@/types/models'
import { cn } from '@/lib/utils'

const eventTypeMap: Record<string, string> = {
  emergency_call: '긴급호출',
  checkin: '체크인',
  checkout: '체크아웃',
  zone_alert: '구역 경보',
  tag_lost: '태그 분실',
  sos: 'SOS',
}

const profileTypeMap: Record<string, string> = {
  visitor: '방문객', worker: '근로자', event_participant: '행사참여자'
}

export default async function SafetyAdminPage() {
  const supabase = await createClient()

  const [eventsRes, profilesRes, tagsRes, zonesRes, unresolvedCount] = await Promise.all([
    supabase
      .from('safety_events')
      .select('*, safety_profiles(name, organization, profile_type), safety_zones(name, code)')
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('safety_profiles')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('safety_tags')
      .select('*, safety_profiles(name), safety_zones(name)')
      .eq('is_active', true)
      .limit(10),
    supabase
      .from('safety_zones')
      .select('*')
      .eq('is_active', true)
      .order('code'),
    supabase
      .from('safety_events')
      .select('id', { count: 'exact', head: true })
      .eq('is_resolved', false)
      .in('severity', ['warning', 'critical']),
  ])

  const events = (eventsRes.data ?? []) as SafetyEvent[]
  const profiles = (profilesRes.data ?? []) as SafetyProfile[]
  const tags = (tagsRes.data ?? []) as SafetyTag[]
  const zones = (zonesRes.data ?? []) as SafetyZone[]

  return (
    <div className="space-y-5">
      <PageHeader
        title="스마트안전 현황"
        description="스마트태그 기반 방문객·근로자 안전 현황을 모니터링합니다. (Powered by 스마트아이넷)"
      />

      {/* Alert banner */}
      {(unresolvedCount.count ?? 0) > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse shrink-0" />
          <div>
            <p className="font-semibold text-red-700">미처리 경고/긴급 이벤트 {unresolvedCount.count}건</p>
            <p className="text-sm text-red-500">즉시 확인이 필요합니다.</p>
          </div>
        </div>
      )}

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 text-center">
          <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-900">{profiles.length}</p>
          <p className="text-xs text-slate-400">활성 대상자</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Tag className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-900">{tags.length}</p>
          <p className="text-xs text-slate-400">활성 태그</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <MapPin className="h-5 w-5 text-violet-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-900">{zones.length}</p>
          <p className="text-xs text-slate-400">안전 구역</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <Shield className="h-5 w-5 text-red-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-700">{unresolvedCount.count ?? 0}</p>
          <p className="text-xs text-red-400">미처리 이벤트</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Safety Events */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />안전 이벤트 로그
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-y-auto max-h-80">
              {events.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">이벤트 없음</div>
              ) : events.map((ev) => (
                <div
                  key={ev.id}
                  className={cn(
                    'border-b px-4 py-3 last:border-0',
                    ev.severity === 'critical' && 'bg-red-50',
                    ev.severity === 'warning' && 'bg-amber-50',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <SeverityBadge severity={ev.severity} />
                        <span className="text-sm font-medium text-slate-800">
                          {eventTypeMap[ev.event_type] ?? ev.event_type}
                        </span>
                      </div>
                      {ev.safety_profiles && (
                        <p className="text-xs text-slate-500">
                          {ev.safety_profiles.name}
                          {ev.safety_profiles.organization && ` · ${ev.safety_profiles.organization}`}
                          {` (${profileTypeMap[ev.safety_profiles.profile_type] ?? ev.safety_profiles.profile_type})`}
                        </p>
                      )}
                      {ev.safety_zones && (
                        <p className="text-xs text-slate-400">
                          구역: {ev.safety_zones.name} [{ev.safety_zones.code}]
                        </p>
                      )}
                      {ev.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{ev.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-slate-400">{formatDateTime(ev.created_at)}</p>
                      {ev.is_resolved ? (
                        <Badge variant="outline" className="text-[10px] text-emerald-600 mt-0.5">처리완료</Badge>
                      ) : (
                        <Badge className="text-[10px] bg-orange-100 text-orange-700 hover:bg-orange-100 mt-0.5">미처리</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Zones */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-violet-500" />안전 구역 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {zones.map((zone) => (
              <div key={zone.id} className="rounded-lg border p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-800">{zone.name}</span>
                    <Badge variant="outline" className="text-[10px]">{zone.code}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {zone.floor && `${zone.floor} · `}
                    {zone.building}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {zone.capacity && (
                    <span className="text-xs text-slate-400">최대 {zone.capacity}인</span>
                  )}
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium',
                    zone.zone_type === 'safe' ? 'bg-emerald-100 text-emerald-700' :
                    zone.zone_type === 'restricted' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {zone.zone_type === 'safe' ? '안전' : zone.zone_type === 'restricted' ? '제한' : '위험'}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Tags */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4 text-emerald-500" />활성 태그 현황
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">태그코드</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">대상자</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">유형</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">배터리</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">현재 구역</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">최근 핑</th>
                </tr>
              </thead>
              <tbody>
                {tags.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">활성 태그 없음</td>
                  </tr>
                ) : tags.map((tag) => (
                  <tr key={tag.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-mono text-xs">{tag.tag_code}</td>
                    <td className="px-4 py-2.5">{tag.safety_profiles?.name ?? '-'}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant="secondary" className="text-[10px]">{tag.tag_type}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      {tag.battery_level != null ? (
                        <span className={cn(
                          'text-sm font-medium',
                          tag.battery_level < 20 ? 'text-red-600' : tag.battery_level < 50 ? 'text-orange-500' : 'text-emerald-600'
                        )}>
                          {tag.battery_level}%
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs">{tag.safety_zones?.name ?? '-'}</td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs">
                      {tag.last_ping_at ? formatDateTime(tag.last_ping_at) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        <p className="font-semibold mb-1">스마트아이넷 연동 안내</p>
        <p className="text-xs text-blue-600">
          현재 화면은 MVP 데모 데이터 기반입니다. 실제 운영 시 스마트아이넷의 BLE/UWB 태그 시스템 API와 연동하여
          실시간 위치 추적, 긴급호출 알림, 구역 이탈 감지 등이 자동 처리됩니다.
        </p>
      </div>
    </div>
  )
}
