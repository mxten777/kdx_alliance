import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bot, ChevronDown, ChevronUp } from 'lucide-react'
import type { Faq, FaqCategory } from '@/types/models'

export default async function FaqPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const [catsRes, faqsRes] = await Promise.all([
    supabase.from('faq_categories').select('*').eq('is_active', true).order('sort_order'),
    supabase
      .from('faqs')
      .select('*, faq_categories(name, slug)')
      .eq('is_published', true)
      .order('sort_order'),
  ])

  const categories = (catsRes.data ?? []) as FaqCategory[]
  let faqs = (faqsRes.data ?? []) as (Faq & { faq_categories: FaqCategory | null })[]

  if (params.category) {
    faqs = faqs.filter((f) => f.faq_categories?.slug === params.category)
  }

  if (params.q) {
    const q = params.q.toLowerCase()
    faqs = faqs.filter(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-[#C9A961]" />
          <span className="text-[11px] font-semibold tracking-[0.32em] text-[#C9A961] uppercase">
            FAQ &amp; Civil Affairs
          </span>
          <span className="h-px w-8 bg-[#C9A961]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0A1628] leading-[1.15]">
          자주 묻는 질문
        </h1>
        <p className="mt-3 text-slate-500">민원·행정 안내까지 한 곳에서 확인하세요.</p>
      </div>

      {/* Search */}
      <form className="mb-6">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="질문 검색..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </form>

      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/faq">
          <Badge variant={!params.category ? 'default' : 'outline'} className="cursor-pointer text-sm py-1 px-3">
            전체
          </Badge>
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/faq?category=${cat.slug}`}>
            <Badge
              variant={params.category === cat.slug ? 'default' : 'outline'}
              className="cursor-pointer text-sm py-1 px-3"
            >
              {cat.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* FAQ accordion */}
      <div className="space-y-2">
        {faqs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">검색 결과가 없습니다.</div>
        ) : faqs.map((faq) => (
          <details key={faq.id} className="group rounded-xl border border-slate-200 bg-white">
            <summary className="flex cursor-pointer items-center justify-between p-5 list-none">
              <div className="flex items-start gap-3">
                <span className="shrink-0 mt-0.5 text-blue-600 font-bold text-sm">Q.</span>
                <span className="font-medium text-slate-800">{faq.question}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-3 group-open:hidden" />
              <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 ml-3 hidden group-open:block" />
            </summary>
            <div className="border-t border-slate-100 px-5 pb-5 pt-4">
              <div className="flex items-start gap-3">
                <span className="shrink-0 mt-0.5 text-emerald-600 font-bold text-sm">A.</span>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* AI link — 럭셔리 톤 */}
      <div className="mt-16 relative overflow-hidden rounded-3xl border border-[#C9A961]/25 bg-linear-to-br from-[#050B1A] via-[#0A1628] to-[#0F2959] px-6 py-14 md:py-16 text-center">
        {/* 골드 라인 액센트 */}
        <div className="absolute top-0 left-0 right-0 h-px cmv-gold-line opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 h-px cmv-gold-line opacity-30" />
        {/* 패턴 */}
        <div className="absolute inset-0 cmv-pattern-grid opacity-20" />
        {/* Glow */}
        <div
          className="cmv-halo -top-20 -right-20 h-80 w-80"
          style={{ background: 'radial-gradient(circle, rgba(201,169,97,0.22) 0%, transparent 70%)' }}
        />
        <div
          className="cmv-halo -bottom-25 -left-25 h-80 w-80"
          style={{ background: 'radial-gradient(circle, rgba(58,128,113,0.18) 0%, transparent 70%)' }}
        />

        <div className="relative">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[#C9A961]" />
            <span className="text-[11px] font-semibold tracking-[0.32em] text-[#E8D4A1] uppercase">
              24 / 7 AI Assistant
            </span>
            <span className="h-px w-10 bg-[#C9A961]" />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            원하는 답변을 찾지 못하셨나요?
          </h3>
          <p className="mt-4 text-base text-slate-200/90 max-w-lg mx-auto leading-relaxed">
            AI 안내 어시스턴트가 행사·견학·공간·기업지원까지 즉시 안내해 드립니다.
          </p>
          <Button
            asChild
            className="mt-8 h-12 px-8 bg-[#C9A961] text-[#0A1628] hover:bg-[#E8D4A1] font-semibold rounded-full shadow-2xl shadow-[#C9A961]/30"
          >
            <Link href="/ai-assistant">
              <Bot className="mr-2 h-4 w-4" /> AI 챗봇 상담하기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
