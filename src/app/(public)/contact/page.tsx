'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

const schema = z.object({
  inquiry_type: z.enum(['general', 'event', 'tour', 'support', 'civil', 'partnership']),
  applicant_name: z.string().min(2),
  organization: z.string().optional(),
  phone: z.string().min(9),
  email: z.string().email(),
  subject: z.string().min(2, '제목을 입력해 주세요.'),
  content: z.string().min(10, '문의 내용을 10자 이상 입력해 주세요.'),
  privacy_agreed: z.literal(true, {
    errorMap: () => ({ message: '개인정보 처리 방침에 동의해 주세요.' }),
  }),
})

type FormData = z.infer<typeof schema>

const inquiryTypes = [
  { value: 'general', label: '일반 문의' },
  { value: 'event', label: '행사 문의' },
  { value: 'tour', label: '견학 문의' },
  { value: 'support', label: '기업지원 문의' },
  { value: 'civil', label: '민원/행정 문의' },
  { value: 'partnership', label: '제휴 문의' },
]

export default function ContactPage() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      inquiry_type: (typeParam as FormData['inquiry_type']) ?? 'general',
    },
  })

  const privacyAgreed = watch('privacy_agreed')
  const inquiryType = watch('inquiry_type')

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from('inquiries').insert({
      inquiry_type: data.inquiry_type,
      applicant_name: data.applicant_name,
      organization: data.organization ?? null,
      phone: data.phone,
      email: data.email,
      subject: data.subject,
      content: data.content,
      privacy_agreed: data.privacy_agreed,
      status: 'new',
    })

    if (error) {
      toast.error('문의 제출 중 오류가 발생했습니다.')
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">문의가 접수되었습니다</h2>
        <p className="text-slate-500 mb-6">담당자 확인 후 이메일로 회신 드리겠습니다. 감사합니다.</p>
        <Button asChild className="bg-[#0A1628] hover:bg-[#0F2959] text-white rounded-full px-6 h-11 font-semibold">
          <a href="/">홈으로 돌아가기</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-[#C9A961]" />
          <span className="text-[11px] font-semibold tracking-[0.32em] text-[#C9A961] uppercase">
            Contact &amp; Inquiry
          </span>
          <span className="h-px w-8 bg-[#C9A961]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0A1628] leading-[1.15]">
          문의하기
        </h1>
        <p className="mt-3 text-slate-500">
          경주 문화선도산단 관련 문의 사항을 남겨 주세요. 빠르게 답변 드리겠습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Contact info sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold text-slate-800 mb-3">연락처 안내</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>📞 054-123-4567</p>
              <p>📧 info@gyeongju-cmv.kr</p>
              <p>📍 경상북도 경주시<br /> 외동읍 외동로 123</p>
              <p className="text-xs text-slate-400 mt-2">운영시간: 평일 09:00~18:00</p>
            </div>
          </div>
          <div className="rounded-xl border bg-slate-50 p-5 text-sm text-slate-600">
            <p className="font-medium mb-1">기업지원/행정 문의</p>
            <p className="text-xs">행정사법인 정유</p>
            <p className="text-xs text-slate-400">054-789-0123</p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 rounded-xl border bg-white p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label>문의 유형 <span className="text-red-500">*</span></Label>
              <Select
                value={inquiryType}
                onValueChange={(v) => setValue('inquiry_type', v as FormData['inquiry_type'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {inquiryTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>이름 <span className="text-red-500">*</span></Label>
                <Input placeholder="홍길동" {...register('applicant_name')} />
                {errors.applicant_name && <p className="text-xs text-red-500">이름을 입력해 주세요.</p>}
              </div>
              <div className="space-y-1.5">
                <Label>소속/기관</Label>
                <Input placeholder="기관명" {...register('organization')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <Label>제목 <span className="text-red-500">*</span></Label>
              <Input placeholder="문의 제목을 입력해 주세요." {...register('subject')} />
              {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>문의 내용 <span className="text-red-500">*</span></Label>
              <Textarea placeholder="문의 내용을 자세히 입력해 주세요." rows={6} {...register('content')} />
              {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
            </div>

            <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
              <p className="font-medium text-slate-700 mb-1">개인정보 수집·이용 동의</p>
              <p>수집항목: 이름, 소속, 연락처, 이메일 | 목적: 문의 처리 및 회신 | 보유기간: 처리 완료 후 1년</p>
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
              {isSubmitting ? '제출 중...' : '문의 제출'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
