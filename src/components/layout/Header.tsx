'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ChevronDown, MapPin, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: '소개', href: '/about' },
  { label: '행사/프로그램', href: '/events' },
  { label: '산업관광/견학', href: '/tours' },
  { label: '공간/시설', href: '/spaces' },
  { label: '참여기관', href: '/organizations' },
  {
    label: '기업지원',
    href: '/support',
    sub: [
      { label: '기업지원/공지', href: '/support' },
      { label: 'FAQ/민원안내', href: '/faq' },
      { label: '문의하기', href: '/contact' },
    ],
  },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSub, setOpenSub] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg supports-backdrop-filter:bg-white/70">
      {/* Top bar */}
      <div className="hidden border-b border-slate-100 bg-slate-50/80 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-500">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-slate-400" />
              경상북도 경주시 외동읍 외동로 123
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-slate-400" />
              054-123-4567
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/ai-assistant" className="font-medium hover:text-blue-600 transition-colors">
              AI 안내 챗봇
            </Link>
            <span className="h-3 w-px bg-slate-300" />
            <Link href="/admin" className="font-medium hover:text-blue-600 transition-colors">
              관리자
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#0A1628] via-[#0F2959] to-[#1A4A8F] shadow-lg shadow-blue-900/25 transition-transform group-hover:scale-105">
            {/* 골드 코너 */}
            <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-[#C9A961]" />
            <span className="text-[11px] font-bold tracking-tighter text-white">CMV</span>
            <span className="absolute -inset-px rounded-2xl bg-linear-to-br from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[15px] font-bold tracking-tight text-[#0A1628] leading-tight">경주 문화선도산단</p>
            <p className="text-[10px] font-medium tracking-[0.15em] text-[#C9A961] leading-tight uppercase">Culture &amp; Mobility Valley</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <div key={item.href} className="relative">
              {item.sub ? (
                <div
                  className="group"
                  onMouseEnter={() => setOpenSub(item.href)}
                  onMouseLeave={() => setOpenSub(null)}
                >
                  <button className={cn(
                    'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    pathname.startsWith(item.href)
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}>
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  {openSub === item.href && (
                    <div className="absolute left-0 top-full mt-1 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                      {item.sub.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    pathname.startsWith(item.href)
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden md:flex h-9 px-4 bg-[#0F2959] hover:bg-[#1A3A75] text-white shadow-md shadow-blue-900/15">
            <Link href="/tours">견학 예약</Link>
          </Button>
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm font-medium',
                    pathname.startsWith(item.href)
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.sub?.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="block rounded-md px-6 py-1.5 text-sm text-slate-500"
                    onClick={() => setMobileOpen(false)}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
