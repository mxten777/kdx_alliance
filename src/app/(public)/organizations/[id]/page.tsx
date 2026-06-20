import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, ExternalLink, Phone, Mail, MapPin, Users, Building2 } from 'lucide-react'
import type { PublicOrganization } from '@/types/models'
import { ORG_TYPE_LABEL_MAP } from '@/lib/constants/categories'

export default async function OrganizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('public_organizations').select('*').eq('id', id).single()
  if (!data) notFound()
  const org = data as PublicOrganization

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/organizations" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-3.5 w-3.5" /> 기관 목록으로
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{ORG_TYPE_LABEL_MAP[org.org_type] ?? org.org_type}</Badge>
              {org.industry && <span className="text-sm text-slate-500">{org.industry}</span>}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{org.name}</h1>
            {org.name_en && <p className="text-slate-500">{org.name_en}</p>}
          </div>
          {org.website_url && (
            <a href={org.website_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3.5 w-3.5 mr-1" /> 홈페이지
              </Button>
            </a>
          )}
        </div>
        {org.description && (
          <p className="mt-4 text-slate-600 leading-relaxed">{org.description}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {org.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Users, label: '대표자', value: org.representative },
          { icon: Building2, label: '임직원 수', value: org.employee_count ? `${org.employee_count}명` : null },
          { icon: Building2, label: '설립연도', value: org.founded_year ? `${org.founded_year}년` : null },
          { icon: MapPin, label: '주소', value: org.address },
          { icon: Phone, label: '연락처', value: org.contact_phone },
          { icon: Mail, label: '이메일', value: org.contact_email },
        ].filter((item) => item.value).map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <item.icon className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="w-20 shrink-0 text-sm text-slate-500">{item.label}</span>
            <span className="text-sm text-slate-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
