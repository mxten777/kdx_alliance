import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import type { PublicOrganization } from '@/types/models'
import { ORG_TYPE_MAP } from '@/lib/constants/categories'
import { PageHero } from '@/components/layout/PageHero'

export default async function OrganizationsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('public_organizations')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  const orgs = (data ?? []) as PublicOrganization[]

  const grouped: Record<string, PublicOrganization[]> = {}
  for (const org of orgs) {
    if (!grouped[org.org_type]) grouped[org.org_type] = []
    grouped[org.org_type].push(org)
  }

  const typeOrder = ['consortium', 'operator', 'tenant', 'partner']

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Hero */}
      <PageHero
        eyebrow="Consortium & Partners"
        title={<>함께 만드는 <span className="cmv-gold-text-bright">참여 기관</span></>}
        description="경주 문화선도산단을 함께 만들어가는 컨소시엄·운영기관·입주기업·협력기관을 소개합니다."
        className="mb-10"
      />

      {typeOrder.map((type) => {
        const list = grouped[type]
        if (!list?.length) return null
        const typeInfo = ORG_TYPE_MAP[type]
        return (
          <section key={type} className="mb-12">
            <div className="mb-5 flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{typeInfo.label}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeInfo.color}`}>
                {list.length}개
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((org) => (
                <Link key={org.id} href={`/organizations/${org.id}`}>
                  <Card className="h-full cursor-pointer hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{org.name}</h3>
                          {org.name_en && <p className="text-xs text-slate-400">{org.name_en}</p>}
                        </div>
                        {org.website_url && (
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        )}
                      </div>
                      {org.industry && (
                        <p className="mb-2 text-xs text-slate-500">{org.industry}</p>
                      )}
                      {org.description && (
                        <p className="text-sm text-slate-600 line-clamp-2">{org.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {org.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
