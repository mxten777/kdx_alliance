import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: LucideIcon
  iconColor?: string
  change?: number
  description?: string
  className?: string
}

export function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  iconColor = 'text-blue-600',
  change,
  description,
  className,
}: KpiCardProps) {
  return (
    <div className={cn(
      'rounded-xl border border-slate-200 bg-white p-5 shadow-sm',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">
              {typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
            </span>
            {unit && <span className="text-sm text-slate-500">{unit}</span>}
          </div>
          {change !== undefined && (
            <p className={cn(
              'mt-1 text-xs',
              change >= 0 ? 'text-green-600' : 'text-red-500'
            )}>
              {change >= 0 ? '▲' : '▼'} {Math.abs(change)}% 전월 대비
            </p>
          )}
          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50',
            iconColor
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  )
}
