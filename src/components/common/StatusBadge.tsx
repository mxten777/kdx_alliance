import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ReservationStatus, InquiryStatus, EventStatus, SafetyEventSeverity } from '@/types/models'

const reservationStatusMap: Record<ReservationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending:   { label: '신규', variant: 'secondary' },
  reviewing: { label: '검토중', variant: 'default' },
  approved:  { label: '승인', variant: 'default' },
  rejected:  { label: '반려', variant: 'destructive' },
  completed: { label: '완료', variant: 'outline' },
  cancelled: { label: '취소', variant: 'outline' },
}

const inquiryStatusMap: Record<InquiryStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  new:         { label: '신규', variant: 'secondary' },
  in_progress: { label: '처리중', variant: 'default' },
  resolved:    { label: '완료', variant: 'outline' },
  closed:      { label: '종결', variant: 'outline' },
}

const eventStatusMap: Record<EventStatus, { label: string; className: string }> = {
  draft:     { label: '초안', className: 'bg-gray-100 text-gray-600' },
  published: { label: '게시중', className: 'bg-blue-100 text-blue-700' },
  ongoing:   { label: '진행중', className: 'bg-green-100 text-green-700' },
  completed: { label: '종료', className: 'bg-gray-100 text-gray-500' },
  cancelled: { label: '취소', className: 'bg-red-100 text-red-600' },
}

const severityMap: Record<SafetyEventSeverity, { label: string; className: string }> = {
  info:     { label: '정보', className: 'bg-blue-100 text-blue-700' },
  warning:  { label: '주의', className: 'bg-yellow-100 text-yellow-700' },
  critical: { label: '긴급', className: 'bg-red-100 text-red-700 font-bold' },
}

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const { label, variant } = reservationStatusMap[status] ?? { label: status, variant: 'outline' as const }
  return (
    <Badge variant={variant} className={cn(
      status === 'approved' && 'bg-green-100 text-green-700 hover:bg-green-100',
      status === 'reviewing' && 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    )}>
      {label}
    </Badge>
  )
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const { label, variant } = inquiryStatusMap[status] ?? { label: status, variant: 'outline' as const }
  return (
    <Badge variant={variant} className={cn(
      status === 'in_progress' && 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    )}>
      {label}
    </Badge>
  )
}

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const { label, className } = eventStatusMap[status] ?? { label: status, className: '' }
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', className)}>
      {label}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: SafetyEventSeverity }) {
  const { label, className } = severityMap[severity] ?? { label: severity, className: '' }
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', className)}>
      {severity === 'critical' && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
      {label}
    </span>
  )
}
