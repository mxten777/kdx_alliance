import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, ArrowRight, Pin } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Notice, SupportPost } from '@/types/models'
import { SUPPORT_CATEGORY_MAP } from '@/lib/constants/categories'
import { PageHero } from '@/components/layout/PageHero'

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const [noticesRes, supportRes] = await Promise.all([
    supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('support_posts')
      .select('*')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const notices = (noticesRes.data ?? []) as Notice[]
  let posts = (supportRes.data ?? []) as SupportPost[]

  if (params.category) {
    posts = posts.filter((p) => p.category === params.category)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Hero */}
      <PageHero
        eyebrow="Business Support & Notices"
        title={<>기업지원 · <span className="cmv-gold-text-bright">공지사항</span></>}
        description="지원사업 공고·기업지원 안내·행정/민원 안내를 한 곳에서 확인하세요."
        className="mb-10"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main: Support Posts */}
        <div className="lg:col-span-2">
          {/* Category filter */}
          <div className="mb-5 flex flex-wrap gap-2">
            <Link href="/support">
              <Badge variant={!params.category ? 'default' : 'outline'} className="cursor-pointer text-sm py-1 px-3">
                전체
              </Badge>
            </Link>
            {Object.entries(SUPPORT_CATEGORY_MAP).map(([key, val]) => (
              <Link key={key} href={`/support?category=${key}`}>
                <Badge
                  variant={params.category === key ? 'default' : 'outline'}
                  className="cursor-pointer text-sm py-1 px-3"
                >
                  {val.label}
                </Badge>
              </Link>
            ))}
          </div>

          <div className="space-y-3">
            {posts.length === 0 ? (
              <div className="py-16 text-center text-slate-400">게시물이 없습니다.</div>
            ) : posts.map((post) => {
              const catInfo = SUPPORT_CATEGORY_MAP[post.category]
              return (
                <Link key={post.id} href={`/support/${post.id}`}>
                  <Card className="cursor-pointer hover:shadow-sm transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            {post.is_pinned && (
                              <Pin className="h-3.5 w-3.5 text-red-500" />
                            )}
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${catInfo?.color ?? 'bg-gray-100 text-gray-600'}`}>
                              {catInfo?.label ?? post.category}
                            </span>
                          </div>
                          <h3 className="font-medium text-slate-800 truncate">{post.title}</h3>
                          {post.summary && (
                            <p className="mt-1 text-sm text-slate-500 line-clamp-1">{post.summary}</p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" /> {formatDate(post.created_at)}
                            </span>
                            {post.deadline && (
                              <span className="text-orange-500">마감 ~{formatDate(post.deadline)}</span>
                            )}
                            {post.budget_amount && (
                              <span>지원규모 {post.budget_amount.toLocaleString()}원</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Sidebar: Notices */}
        <div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-bold text-slate-900">공지/뉴스</h2>
            <div className="space-y-2">
              {notices.map((n) => (
                <div key={n.id} className="flex items-start gap-2 py-2 border-b border-slate-100 last:border-0">
                  {n.is_pinned && (
                    <Badge className="bg-red-100 text-red-600 hover:bg-red-100 text-[10px] px-1.5 shrink-0">공지</Badge>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{n.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(n.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ quick link */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-2 font-semibold text-slate-800">민원/행정 안내</h3>
            <p className="text-sm text-slate-500 mb-4">자주 묻는 민원, 행정 절차 안내는 FAQ에서 확인하세요.</p>
            <Link href="/faq?category=civil" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              FAQ 바로가기 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
