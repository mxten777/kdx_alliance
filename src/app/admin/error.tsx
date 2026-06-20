'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin Error]', error)
  }, [error])

  return (
    <div className="flex min-h-100 flex-col items-center justify-center gap-4 text-center px-4">
      <AlertTriangle className="h-10 w-10 text-red-500" />
      <div>
        <h2 className="text-lg font-semibold text-slate-800">페이지를 불러오는 중 오류가 발생했습니다</h2>
        <p className="mt-1 text-sm text-slate-500">{error.message || '잠시 후 다시 시도해 주세요.'}</p>
      </div>
      <Button variant="outline" onClick={reset}>
        다시 시도
      </Button>
    </div>
  )
}
