'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ParkingCircle, MessageSquare } from 'lucide-react'

const COLORS = ['#0F2959', '#2563EB', '#10B981', '#F59E0B', '#EF4444']

type ParkingItem = { name: string; 사용중: number; 여유: number; 전체: number }
type PieItem = { name: string; value: number }

export function AdminCharts({
  parkingData,
  pieData,
}: {
  parkingData: ParkingItem[]
  pieData: PieItem[]
}) {
  return (
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
  )
}
