'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Page Error]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center px-4 py-20">
      <AlertCircle className="h-10 w-10 text-slate-400" />
      <div>
        <h2 className="text-lg font-semibold text-slate-800">페이지를 불러오지 못했습니다</h2>
        <p className="mt-1 text-sm text-slate-500">네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>다시 시도</Button>
        <Button asChild variant="ghost">
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </div>
  )
}
