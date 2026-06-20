import type { Metadata } from 'next'
import { ChatWindow } from '@/features/ai-assistant/components/ChatWindow'

export const metadata: Metadata = {
  title: 'AI 안내 어시스턴트 | 경주 문화선도산단',
  description: '경주 문화선도산단 AI 기반 안내 어시스턴트 - 행사, 견학, 기업지원, 시설 이용에 대해 질문해 보세요.',
}

export default function AIAssistantPage() {
  return (
    <div className="container max-w-3xl py-12 px-4">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-[#C9A961]" />
          <span className="text-[11px] font-semibold tracking-[0.32em] text-[#C9A961] uppercase">
            24/7 AI Assistant
          </span>
          <span className="h-px w-8 bg-[#C9A961]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0A1628] leading-[1.15]">
          무엇이든 물어보세요
        </h1>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto leading-relaxed">
          행사·산업관광 견학·공간 예약·기업지원 사업까지 — AI가 즉시 안내해 드립니다.
        </p>
      </div>

      <ChatWindow />

      <div className="mt-6 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-5 text-sm text-slate-600">
        <p className="font-semibold text-amber-900 mb-2 text-sm">AI 어시스턴트 이용 안내</p>
        <ul className="space-y-1.5 text-xs leading-relaxed">
          <li>• 본 AI는 경주 문화선도산단 관련 정보를 안내합니다. 개인정보나 민감 내용은 입력하지 마세요.</li>
          <li>• AI 응답은 참고용이며, 정확한 내용은 담당 부서에 직접 확인하시기 바랍니다.</li>
          <li>• 긴급 문의: 054-123-4567 (평일 09:00~18:00)</li>
        </ul>
      </div>
    </div>
  )
}
