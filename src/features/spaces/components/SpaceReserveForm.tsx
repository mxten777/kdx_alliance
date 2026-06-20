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
  applicant_name: z.string().min(2),
  organization: z.string().optional(),
  phone: z.string().min(9),
  email: z.string().email(),
  desired_date: z.string().min(1),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
  purpose: z.string().min(5, '사용 목적을 입력해 주세요.'),
  participant_count: z.coerce.number().min(1).optional(),
  memo: z.string().optional(),
  privacy_agreed: z.literal(true, {
    errorMap: () => ({ message: '개인정보 처리 방침에 동의해 주세요.' }),
  }),
})

type FormData = z.infer<typeof schema>

interface SpaceReserveFormProps {
  spaceId: string
  spaceName: string
  operatingHours?: string
}

export function SpaceReserveForm({ spaceId, spaceName, operatingHours }: SpaceReserveFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const privacyAgreed = watch('privacy_agreed')

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from('space_reservations').insert({
      space_id: spaceId,
      applicant_name: data.applicant_name,
      organization: data.organization ?? null,
      phone: data.phone,
      email: data.email,
      desired_date: data.desired_date,
      start_time: data.start_time,
      end_time: data.end_time,
      purpose: data.purpose,
      participant_count: data.participant_count ?? null,
      memo: data.memo ?? null,
      privacy_agreed: data.privacy_agreed,
      status: 'pending',
    })

    if (error) {
      toast.error('예약 신청 중 오류가 발생했습니다.')
      return
    }

    toast.success('공간 예약 신청이 완료되었습니다!')
    router.push(`/spaces/${spaceId}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>신청자명 <span className="text-red-500">*</span></Label>
          <Input placeholder="홍길동" {...register('applicant_name')} />
          {errors.applicant_name && <p className="text-xs text-red-500">이름을 입력해 주세요.</p>}
        </div>
        <div className="space-y-1.5">
          <Label>소속/기관</Label>
          <Input placeholder="소속 기관명" {...register('organization')} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>연락처 <span className="text-red-500">*</span></Label>
          <Input placeholder="010-0000-0000" {...register('phone')} />
          {errors.phone && <p className="text-xs text-red-500">연락처를 입력해 주세요.</p>}
        </div>
        <div className="space-y-1.5">
          <Label>이메일 <span className="text-red-500">*</span></Label>
          <Input type="email" placeholder="email@example.com" {...register('email')} />
          {errors.email && <p className="text-xs text-red-500">이메일을 입력해 주세요.</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>
          희망 날짜 <span className="text-red-500">*</span>
          {operatingHours && <span className="ml-1 text-xs text-slate-400">({operatingHours})</span>}
        </Label>
        <Input type="date" min={new Date().toISOString().split('T')[0]} {...register('desired_date')} />
        {errors.desired_date && <p className="text-xs text-red-500">날짜를 선택해 주세요.</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>시작 시간 <span className="text-red-500">*</span></Label>
          <Input type="time" {...register('start_time')} />
          {errors.start_time && <p className="text-xs text-red-500">시작 시간을 선택해 주세요.</p>}
        </div>
        <div className="space-y-1.5">
          <Label>종료 시간 <span className="text-red-500">*</span></Label>
          <Input type="time" {...register('end_time')} />
          {errors.end_time && <p className="text-xs text-red-500">종료 시간을 선택해 주세요.</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>사용 목적 <span className="text-red-500">*</span></Label>
        <Input placeholder="회의 / 교육 / 세미나 / 행사 등" {...register('purpose')} />
        {errors.purpose && <p className="text-xs text-red-500">{errors.purpose.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>예상 인원</Label>
        <Input type="number" min="1" placeholder="예상 참석 인원" {...register('participant_count')} />
      </div>

      <div className="space-y-1.5">
        <Label>메모/요청사항</Label>
        <Textarea placeholder="필요한 장비나 특별 요청 사항을 입력해 주세요." rows={3} {...register('memo')} />
      </div>

      <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
        <p className="font-medium text-slate-700 mb-1">개인정보 수집·이용 동의</p>
        <p>수집항목: 이름, 소속, 연락처, 이메일 | 목적: 공간 예약 및 안내 | 보유기간: 이용 완료 후 1년</p>
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
        className="w-full bg-[#0F2959] hover:bg-[#1A3A75]"
        disabled={isSubmitting}
        size="lg"
      >
        {isSubmitting ? '신청 중...' : '공간 예약 신청'}
      </Button>
    </form>
  )
}
