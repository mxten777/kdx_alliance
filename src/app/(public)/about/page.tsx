import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const consortiumMembers = [
  {
    name: '바이칼시스템즈',
    role: '주관사 · AI 플랫폼',
    description: 'AI 기반 통합 플랫폼 구축, 데이터 허브 운영, 관리자 대시보드, AI 기업지원/민원 챗봇 서비스를 담당합니다.',
    tags: ['AI 플랫폼', '통합포털', '데이터 허브', '관리자 콘솔'],
    color: 'border-blue-400 bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    name: '스마트한',
    role: '스마트주차 · 영상관제',
    description: '스마트주차 솔루션, 영상관제 시스템, 통합관제 연계를 담당합니다. 실시간 주차 현황 모니터링 및 행사 주차 수요 관리를 제공합니다.',
    tags: ['스마트주차', '영상관제', '통합관제'],
    color: 'border-orange-400 bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    name: '스마트아이넷',
    role: '스마트태그 · 안전관리',
    description: 'BLE/UWB 기반 스마트태그와 위치기반 안전관리 서비스를 담당합니다. 방문객/근로자 안전 모니터링, 긴급호출 시스템을 운영합니다.',
    tags: ['스마트태그', '위치기반 안전', 'BLE/UWB', '긴급호출'],
    color: 'border-red-400 bg-red-50',
    badge: 'bg-red-100 text-red-700',
  },
  {
    name: '행정사법인 정유',
    role: '행정 · 지원사업 · PMO',
    description: '공공사업 행정 지원, 지원사업 발굴 및 안내, 민원 처리, 입주기업 행정 컨설팅 및 사업 PMO를 담당합니다.',
    tags: ['지원사업', '민원처리', '행정컨설팅', 'PMO'],
    color: 'border-emerald-400 bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
  },
]

const directions = [
  { number: '01', title: '문화 + 산업의 융합', desc: '신라 천년 문화 자산과 첨단 산업이 공존하는 복합 단지 조성' },
  { number: '02', title: '스마트시티 기반 구축', desc: '스마트주차·스마트안전·데이터 기반 운영 인프라 선진화' },
  { number: '03', title: 'AI 기반 기업지원', desc: 'AI 챗봇·정책데이터 분석·맞춤형 기업지원 서비스 제공' },
  { number: '04', title: '산업관광 허브화', desc: '경주 산업관광 거점으로서 연간 방문객 10만명 목표' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#050B1A] via-[#0A1628] to-[#0F2959] py-24 px-4 text-white">
        <div className="absolute top-0 left-0 right-0 h-px cmv-gold-line opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 h-px cmv-gold-line opacity-30" />
        <div className="absolute inset-0 cmv-pattern-grid opacity-20" />
        <div
          className="cmv-halo -top-25 right-[10%] h-96 w-96"
          style={{ background: 'radial-gradient(circle, rgba(201,169,97,0.20) 0%, transparent 70%)' }}
        />
        <div
          className="cmv-halo -bottom-25 left-[10%] h-96 w-96"
          style={{ background: 'radial-gradient(circle, rgba(58,128,113,0.22) 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[#C9A961]" />
            <span className="text-[11px] font-semibold tracking-[0.32em] text-[#E8D4A1] uppercase">
              About · 경주 문화선도산단
            </span>
            <span className="h-px w-10 bg-[#C9A961]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Culture &amp; <span className="cmv-gold-text-bright">Mobility</span> Valley
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200/90 max-w-2xl mx-auto leading-relaxed">
            경주 문화선도산단은 산업·문화·관광·스마트시티·AI·안전이 결합된<br className="hidden md:block" />
            대한민국 대표 복합 산업 문화 거점입니다.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14 space-y-16">
        {/* Vision */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">비전</h2>
          <Separator className="mb-6" />
          <div className="rounded-2xl bg-linear-to-br from-slate-50 to-blue-50 border border-slate-200 p-8">
            <blockquote className="text-xl font-semibold text-[#0F2959] text-center leading-relaxed">
              &ldquo;경주의 천년 문화와 첨단 산업이 융합된<br />
              대한민국 최초의 문화선도산단을 구현한다.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">산단 개요</h2>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: '위치', value: '경상북도 경주시 외동읍 일원' },
              { label: '면적', value: '약 150만㎡ (45만평)' },
              { label: '입주 기업', value: '42개사 (제조·IT·문화·관광)' },
              { label: '주요 산업', value: '자동차부품, 모빌리티, ICT, 문화콘텐츠' },
              { label: '사업 기간', value: '2024~2030 (7개년 계획)' },
              { label: '주관', value: '경주시 · 경북 산업진흥원 · 바이칼시스템즈 컨소시엄' },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <span className="w-28 shrink-0 text-sm font-medium text-slate-500">{item.label}</span>
                <span className="text-sm text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Directions */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">추진 방향</h2>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {directions.map((d) => (
              <div key={d.number} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-3xl font-black text-blue-100 mb-1">{d.number}</div>
                <h3 className="text-base font-bold text-slate-800">{d.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Digital Strategy */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">디지털 전환 전략</h2>
          <Separator className="mb-6" />
          <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-3">
            <p>경주 문화선도산단 디지털 전환 전략은 <strong>단순 정보화</strong>를 넘어, 산단 운영 전체를 디지털 기반으로 전환하는 것을 목표로 합니다.</p>
            <ul className="space-y-2 list-none p-0">
              {[
                '통합 운영 플랫폼(CMV Platform): 행사·견학·공간·기업지원·민원을 하나의 플랫폼으로 운영',
                '스마트주차 시스템: 실시간 주차 현황 모니터링, 행사별 수요 예측 및 관제',
                '스마트안전 시스템: BLE/UWB 기반 스마트태그로 방문객·근로자 위치 안전 관리',
                'AI 기업지원 서비스: 지원사업·민원·시설 안내 AI 챗봇 및 맞춤형 기업지원 데이터 분석',
                '데이터 허브: 산단 내 운영 데이터 통합 수집·분석·시각화',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Consortium */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">컨소시엄 소개</h2>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consortiumMembers.map((m) => (
              <Card key={m.name} className={`border-l-4 ${m.color}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900">{m.name}</h3>
                    <Badge className={`text-xs ${m.badge} hover:${m.badge}`}>{m.role}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{m.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Expected effects */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">기대 효과</h2>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: '10만+', label: '연간 산업관광 방문객', desc: '산업관광 거점 확립' },
              { value: '30%', label: '운영 효율 향상', desc: '디지털 전환 성과' },
              { value: '500억+', label: '기업지원 연결 규모', desc: '지원사업 연계 목표' },
            ].map((e) => (
              <div key={e.label} className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                <p className="text-3xl font-extrabold text-[#0F2959]">{e.value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{e.label}</p>
                <p className="mt-0.5 text-xs text-slate-400">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
