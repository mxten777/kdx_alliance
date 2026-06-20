'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  applicant_name: z.string().min(2, '이름을 입력해 주세요.'),
  organization: z.string().optional(),
  phone: z.string().min(9, '연락처를 입력해 주세요.'),
  email: z.string().email('이메일 형식이 올바르지 않습니다.'),
  participant_count: z.coerce.number().min(1, '1인 이상이어야 합니다.').max(100),
  memo: z.string().optional(),
  privacy_agreed: z.literal(true, {
    errorMap: () => ({ message: '개인정보 처리 방침에 동의해 주세요.' }),
  }),
})

type FormData = z.infer<typeof schema>

interface EventApplyFormProps {
  eventId: string
  eventTitle: string
  maxParticipants?: number
  currentParticipants: number
}

export function EventApplyForm({
  eventId,
  eventTitle,
  maxParticipants,
  currentParticipants,
}: EventApplyFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { participant_count: 1 },
  })

  const privacyAgreed = watch('privacy_agreed')

  const onSubmit = async (data: FormData) => {
    const remaining = maxParticipants ? maxParticipants - currentParticipants : Infinity
    if (data.participant_count > remaining) {
      toast.error(`신청 가능 인원이 부족합니다. (잔여 ${remaining}명)`)
      return
    }

    const { error } = await supabase.from('event_registrations').insert({
      event_id: eventId,
      applicant_name: data.applicant_name,
      organization: data.organization ?? null,
      phone: data.phone,
      email: data.email,
      participant_count: data.participant_count,
      memo: data.memo ?? null,
      privacy_agreed: data.privacy_agreed,
      status: 'pending',
    })

    if (error) {
      toast.error('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
      return
    }

    toast.success('신청이 완료되었습니다! 담당자 확인 후 연락드리겠습니다.')
    router.push(`/events/${eventId}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="applicant_name">이름 <span className="text-red-500">*</span></Label>
          <Input id="applicant_name" placeholder="홍길동" {...register('applicant_name')} />
          {errors.applicant_name && <p className="text-xs text-red-500">{errors.applicant_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="organization">소속/기관</Label>
          <Input id="organization" placeholder="소속 기관명" {...register('organization')} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">연락처 <span className="text-red-500">*</span></Label>
          <Input id="phone" placeholder="010-0000-0000" {...register('phone')} />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">이메일 <span className="text-red-500">*</span></Label>
          <Input id="email" type="email" placeholder="email@example.com" {...register('email')} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="participant_count">
          참석 인원 <span className="text-red-500">*</span>
          {maxParticipants && (
            <span className="ml-2 text-xs text-slate-400">
              (잔여 {maxParticipants - currentParticipants}명)
            </span>
          )}
        </Label>
        <Input
          id="participant_count"
          type="number"
          min="1"
          max={maxParticipants ? maxParticipants - currentParticipants : 100}
          {...register('participant_count')}
        />
        {errors.participant_count && <p className="text-xs text-red-500">{errors.participant_count.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="memo">메모/요청사항</Label>
        <Textarea id="memo" placeholder="특별 요청 사항이 있으면 입력해 주세요." rows={3} {...register('memo')} />
      </div>

      {/* Privacy */}
      <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-500 leading-relaxed">
        <p className="font-medium text-slate-700 mb-1">개인정보 수집·이용 동의</p>
        <p>수집항목: 이름, 소속, 연락처, 이메일</p>
        <p>수집목적: 행사 신청 및 안내</p>
        <p>보유기간: 행사 종료 후 1년</p>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="privacy_agreed"
          checked={privacyAgreed === true}
          onCheckedChange={(v) => setValue('privacy_agreed', v === true ? true : (undefined as unknown as true))}
        />
        <Label htmlFor="privacy_agreed" className="text-sm cursor-pointer">
          개인정보 처리 방침에 동의합니다. <span className="text-red-500">*</span>
        </Label>
      </div>
      {errors.privacy_agreed && <p className="text-xs text-red-500">{errors.privacy_agreed.message}</p>}

      <Button
        type="submit"
        className="w-full bg-[#C9A961] hover:bg-[#E8D4A1] text-[#0A1628] rounded-full font-semibold shadow-lg shadow-[#C9A961]/20"
        disabled={isSubmitting}
        size="lg"
      >
        {isSubmitting ? '신청 중...' : '참가 신청 완료'}
      </Button>
    </form>
  )
}
