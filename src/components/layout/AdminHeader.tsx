'use client'

import { Bell, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  title?: string
}

export function AdminHeader({ title = '관리자 콘솔' }: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-sm font-semibold text-slate-700">{title}</h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-slate-500" aria-label="알림">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-slate-500" aria-label="사용자 설정">
          <User className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
