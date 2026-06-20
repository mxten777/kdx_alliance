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
  organization: z.string().min(2, '소속/단체명을 입력해 주세요.'),
  phone: z.string().min(9, '연락처를 입력해 주세요.'),
  email: z.string().email('이메일 형식이 올바르지 않습니다.'),
  desired_date: z.string().min(1, '희망 날짜를 선택해 주세요.'),
  participant_count: z.coerce.number().min(1).max(200),
  visit_purpose: z.string().optional(),
  memo: z.string().optional(),
  privacy_agreed: z.literal(true, {
    errorMap: () => ({ message: '개인정보 처리 방침에 동의해 주세요.' }),
  }),
})

type FormData = z.infer<typeof schema>

interface TourReserveFormProps {
  tourId: string
  tourTitle: string
  minParticipants: number
  maxParticipants?: number
  operatingDays: string[]
}

export function TourReserveForm({
  tourId,
  tourTitle,
  minParticipants,
  maxParticipants,
  operatingDays,
}: TourReserveFormProps) {
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
    defaultValues: { participant_count: minParticipants },
  })

  const privacyAgreed = watch('privacy_agreed')

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from('tour_reservations').insert({
      tour_id: tourId,
      applicant_name: data.applicant_name,
      organization: data.organization,
      phone: data.phone,
      email: data.email,
      desired_date: data.desired_date,
      participant_count: data.participant_count,
      visit_purpose: data.visit_purpose ?? null,
      memo: data.memo ?? null,
      privacy_agreed: data.privacy_agreed,
      status: 'pending',
    })

    if (error) {
      toast.error('예약 신청 중 오류가 발생했습니다.')
      return
    }

    toast.success('예약 신청이 완료되었습니다! 담당자 확인 후 연락드리겠습니다.')
    router.push(`/tours/${tourId}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="applicant_name">신청자명 <span className="text-red-500">*</span></Label>
          <Input id="applicant_name" placeholder="홍길동" {...register('applicant_name')} />
          {errors.applicant_name && <p className="text-xs text-red-500">{errors.applicant_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="organization">단체명/소속 <span className="text-red-500">*</span></Label>
          <Input id="organization" placeholder="학교명 / 기관명 / 기업명" {...register('organization')} />
          {errors.organization && <p className="text-xs text-red-500">{errors.organization.message}</p>}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="desired_date">
            희망 날짜 <span className="text-red-500">*</span>
            {operatingDays.length > 0 && (
              <span className="ml-1 text-xs text-slate-400">(운영: {operatingDays.join(', ')}요일)</span>
            )}
          </Label>
          <Input id="desired_date" type="date" min={new Date().toISOString().split('T')[0]} {...register('desired_date')} />
          {errors.desired_date && <p className="text-xs text-red-500">{errors.desired_date.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="participant_count">
            인원수 <span className="text-red-500">*</span>
            <span className="ml-1 text-xs text-slate-400">
              (최소 {minParticipants}{maxParticipants ? ` ~ 최대 ${maxParticipants}` : ''}인)
            </span>
          </Label>
          <Input
            id="participant_count"
            type="number"
            min={minParticipants}
            max={maxParticipants ?? 200}
            {...register('participant_count')}
          />
          {errors.participant_count && <p className="text-xs text-red-500">{errors.participant_count.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="visit_purpose">방문 목적</Label>
        <Input id="visit_purpose" placeholder="교육 목적 견학 / 기업 탐방 / 관광 등" {...register('visit_purpose')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="memo">메모/요청사항</Label>
        <Textarea id="memo" placeholder="특별 요청 사항이나 문의 사항을 입력해 주세요." rows={3} {...register('memo')} />
      </div>

      <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
        <p className="font-medium text-slate-700 mb-1">개인정보 수집·이용 동의</p>
        <p>수집항목: 이름, 단체명, 연락처, 이메일 | 목적: 견학 예약 및 안내 | 보유기간: 견학 완료 후 1년</p>
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
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={isSubmitting}
        size="lg"
      >
        {isSubmitting ? '예약 신청 중...' : '견학 예약 신청'}
      </Button>
    </form>
  )
}
