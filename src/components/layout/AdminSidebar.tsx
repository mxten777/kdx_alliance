'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Megaphone, Briefcase, HelpCircle, CalendarDays,
  MapPin, Building2, Users, ClipboardList, BookOpen, MessageSquare,
  ParkingCircle, Shield, Settings, UserCog, ChevronLeft, ChevronRight,
  Car
} from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: '운영 현황',
    items: [
      { label: '대시보드', href: '/admin', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: '콘텐츠 관리',
    items: [
      { label: '공지/뉴스', href: '/admin/notices', icon: Megaphone },
      { label: '기업지원/지원사업', href: '/admin/support', icon: Briefcase },
      { label: 'FAQ/민원안내', href: '/admin/faqs', icon: HelpCircle },
      { label: '행사 관리', href: '/admin/events', icon: CalendarDays },
      { label: '견학/투어 관리', href: '/admin/tours', icon: MapPin },
      { label: '공간/시설 관리', href: '/admin/spaces', icon: Building2 },
      { label: '기업/기관 관리', href: '/admin/organizations', icon: Users },
    ],
  },
  {
    label: '신청/예약 관리',
    items: [
      { label: '행사 신청', href: '/admin/event-registrations', icon: ClipboardList },
      { label: '견학 예약', href: '/admin/tour-reservations', icon: BookOpen },
      { label: '공간 예약', href: '/admin/space-reservations', icon: CalendarDays },
      { label: '문의 관리', href: '/admin/inquiries', icon: MessageSquare },
    ],
  },
  {
    label: '스마트 운영',
    items: [
      { label: '스마트주차 현황', href: '/admin/parking', icon: ParkingCircle },
      { label: '스마트안전 현황', href: '/admin/safety', icon: Shield },
    ],
  },
  {
    label: '시스템',
    items: [
      { label: '관리자/권한 관리', href: '/admin/users', icon: UserCog },
      { label: '사이트 설정', href: '/admin/settings', icon: Settings },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'flex flex-col border-r border-slate-200 bg-[#0B1E3D] text-slate-300 transition-all duration-200',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-slate-700 px-4">
        {!collapsed && (
          <div>
            <p className="text-xs font-bold text-white">CMV Admin</p>
            <p className="text-[10px] text-slate-500">경주 문화선도산단</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
          className="ml-auto rounded-md p-1 hover:bg-slate-700"
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4" />
            : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
                        active
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:bg-slate-700 hover:text-white',
                        collapsed && 'justify-center'
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-slate-700 p-4">
          <Link href="/" className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300">
            <Car className="h-3.5 w-3.5" />
            공개 사이트로 이동
          </Link>
        </div>
      )}
    </aside>
  )
}
