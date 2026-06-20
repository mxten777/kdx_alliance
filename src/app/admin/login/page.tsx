'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('로그인 실패: ' + error.message)
    } else {
      router.push('/admin')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#050B1A] px-4">
      <div className="absolute inset-0 cmv-pattern-grid opacity-20 pointer-events-none" />
      <div
        className="cmv-halo top-[15%] left-[20%] h-96 w-96"
        style={{ background: 'radial-gradient(circle, rgba(201,169,97,0.18) 0%, transparent 70%)' }}
      />
      <div
        className="cmv-halo bottom-[15%] right-[20%] h-96 w-96"
        style={{ background: 'radial-gradient(circle, rgba(15,41,89,0.5) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm rounded-3xl border border-[#C9A961]/20 bg-white/5 p-8 backdrop-blur-xl">
        <div className="absolute top-0 left-0 right-0 h-px cmv-gold-line opacity-60" />

        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#0A1628] via-[#0F2959] to-[#1A4A8F] ring-1 ring-[#C9A961]/30">
            <Lock className="h-5 w-5 text-[#E8D4A1]" />
          </div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-px w-6 bg-[#C9A961]" />
            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#C9A961] uppercase">Admin Access</span>
            <span className="h-px w-6 bg-[#C9A961]" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">관리자 로그인</h1>
          <p className="mt-1 text-xs text-slate-400">경주 문화선도산단 CMV Platform</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-slate-300">이메일</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-[#C9A961]"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300">비밀번호</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-[#C9A961]"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-3 h-11 bg-[#C9A961] hover:bg-[#E8D4A1] text-[#0A1628] rounded-full font-semibold shadow-lg shadow-[#C9A961]/20"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  )
}
