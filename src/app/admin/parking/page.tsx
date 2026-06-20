import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ParkingCircle, Car, AlertTriangle, Zap, Accessibility } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ParkingZone } from '@/types/models'

function OccupancyColor(rate: number) {
  if (rate >= 90) return 'text-red-600'
  if (rate >= 70) return 'text-orange-500'
  return 'text-emerald-600'
}

export default async function ParkingAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('parking_zones')
    .select('*')
    .order('code')

  const zones = (data ?? []) as ParkingZone[]
  const totalSpaces = zones.reduce((s, z) => s + z.total_spaces, 0)
  const totalOccupied = zones.reduce((s, z) => s + z.occupied_spaces, 0)
  const overallRate = totalSpaces > 0 ? Math.round((totalOccupied / totalSpaces) * 100) : 0

  return (
    <div className="space-y-5">
      <PageHeader
        title="스마트주차 현황"
        description="주차장 구역별 실시간 운영 현황을 확인합니다. (Powered by 스마트한)"
      />

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">전체 주차면수</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalSpaces.toLocaleString()}<span className="ml-1 text-sm font-normal text-slate-500">면</span></p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">현재 사용중</p>
          <p className={`text-2xl font-bold mt-1 ${OccupancyColor(overallRate)}`}>
            {totalOccupied.toLocaleString()}<span className="ml-1 text-sm font-normal text-slate-500">면</span>
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">전체 점유율</p>
          <div className="flex items-center gap-3 mt-2">
            <Progress value={overallRate} className="flex-1" />
            <span className={`font-bold text-lg ${OccupancyColor(overallRate)}`}>{overallRate}%</span>
          </div>
        </div>
      </div>

      {/* Zone cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {zones.map((zone) => {
          const rate = zone.total_spaces > 0
            ? Math.round((zone.occupied_spaces / zone.total_spaces) * 100)
            : 0
          const available = zone.total_spaces - zone.occupied_spaces - zone.reserved_spaces
          const isAlert = rate >= 90

          return (
            <Card key={zone.id} className={cn('transition-all', isAlert && 'border-red-200 bg-red-50')}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ParkingCircle className={`h-5 w-5 ${isAlert ? 'text-red-500' : 'text-blue-500'}`} />
                    <span className="text-base">{zone.name}</span>
                    <Badge variant="outline" className="text-[10px] text-slate-500">{zone.code}</Badge>
                  </div>
                  {isAlert && (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                      <AlertTriangle className="h-3 w-3 mr-1" />혼잡
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Occupancy bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-500">점유율</span>
                    <span className={`font-bold ${OccupancyColor(rate)}`}>{rate}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        rate >= 90 ? 'bg-red-500' : rate >= 70 ? 'bg-orange-400' : 'bg-emerald-500'
                      )}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-slate-50 p-2">
                    <p className="text-xs text-slate-400">전체</p>
                    <p className="font-bold text-slate-800">{zone.total_spaces}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2">
                    <p className="text-xs text-blue-400">사용중</p>
                    <p className="font-bold text-blue-700">{zone.occupied_spaces}</p>
                  </div>
                  <div className={cn('rounded-lg p-2', available <= 5 ? 'bg-red-50' : 'bg-emerald-50')}>
                    <p className={`text-xs ${available <= 5 ? 'text-red-400' : 'text-emerald-500'}`}>여유</p>
                    <p className={`font-bold ${available <= 5 ? 'text-red-700' : 'text-emerald-700'}`}>{available}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {zone.has_ev_charger && (
                    <span className="flex items-center gap-1 text-blue-600">
                      <Zap className="h-3 w-3" /> EV충전 {zone.ev_charger_count}기
                    </span>
                  )}
                  {zone.has_disabled_space && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Accessibility className="h-3 w-3" /> 장애인 {zone.disabled_spaces}면
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-400">
                    <Car className="h-3 w-3" /> {zone.operating_hours}
                  </span>
                </div>

                {zone.description && (
                  <p className="text-xs text-slate-400">{zone.description}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        <p className="font-semibold mb-1">스마트한 연동 안내</p>
        <p className="text-xs text-blue-600">
          현재 화면은 MVP 데모 데이터 기반입니다. 실제 운영 시 스마트한의 주차 관제 시스템 API와 연동하여
          차량번호 인식, 실시간 입출차 데이터, CCTV 관제 화면이 연결됩니다.
        </p>
      </div>
    </div>
  )
}
