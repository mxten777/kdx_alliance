import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CalendarDays, Tag, Users, DollarSign } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { SupportPost } from '@/types/models'
import { SUPPORT_CATEGORY_MAP } from '@/lib/constants/categories'

export default async function SupportPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('support_posts').select('*').eq('id', id).eq('is_published', true).single()
  if (!data) notFound()
  const post = data as SupportPost
  const catInfo = SUPPORT_CATEGORY_MAP[post.category]

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/support" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-3.5 w-3.5" /> 기업지원 목록으로
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${catInfo?.color ?? 'bg-gray-100 text-gray-600'}`}>
            {catInfo?.label ?? post.category}
          </span>
          {post.deadline && (
            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-700">
              마감 D-{Math.ceil((new Date(post.deadline).getTime() - Date.now()) / 86400000)}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">{post.title}</h1>

        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <CalendarDays className="h-4 w-4" />
            등록: {formatDate(post.created_at)}
          </div>
          {post.deadline && (
            <div className="flex items-center gap-2 text-orange-600">
              <CalendarDays className="h-4 w-4" />
              마감: {formatDate(post.deadline)}
            </div>
          )}
          {post.target_audience && (
            <div className="flex items-center gap-2 text-slate-500">
              <Users className="h-4 w-4" />
              대상: {post.target_audience}
            </div>
          )}
          {post.budget_amount && (
            <div className="flex items-center gap-2 text-slate-500">
              <DollarSign className="h-4 w-4" />
              지원규모: {formatCurrency(post.budget_amount)}
            </div>
          )}
        </div>

        {post.summary && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-6">
            <p className="text-sm font-medium text-blue-800">{post.summary}</p>
          </div>
        )}

        <div className="prose prose-slate max-w-none text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>

        {post.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-2.5 w-2.5 mr-1" />{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-500 mb-3">문의사항이 있으신가요?</p>
        <Link href="/contact?type=support" className="text-blue-600 hover:underline text-sm">
          기업지원 문의하기 →
        </Link>
      </div>
    </div>
  )
}
