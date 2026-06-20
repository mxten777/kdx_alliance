import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

const IS_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * 환경변수 미설정 시 모든 쿼리가 빈 결과를 반환하는 no-op 클라이언트
 */
function createMockClient() {
  // 체인 메서드를 모두 지원하는 thenable Promise
  const mockQuery = (): any => {
    const result = Promise.resolve({ data: [], error: null, count: 0 })
    const chain: any = Object.assign(result, {
      eq: () => chain,
      neq: () => chain,
      in: () => chain,
      not: () => chain,
      is: () => chain,
      gte: () => chain,
      lte: () => chain,
      gt: () => chain,
      lt: () => chain,
      like: () => chain,
      ilike: () => chain,
      order: () => chain,
      limit: () => chain,
      range: () => chain,
      filter: () => chain,
      match: () => chain,
      or: () => chain,
      head: () => chain,
      select: () => chain,
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
    })
    return chain
  }

  return {
    from: () => ({
      select: mockQuery,
      insert: () => ({ select: mockQuery, then: (r: any) => r({ data: null, error: null }) }),
      update: () => mockQuery(),
      delete: () => mockQuery(),
      upsert: () => mockQuery(),
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ error: { message: 'Supabase 환경변수가 설정되지 않았습니다.' } }),
      signOut: async () => ({}),
    },
  }
}

export async function createClient() {
  if (!IS_CONFIGURED) return createMockClient() as any

  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서의 setAll은 무시됨
          }
        },
      },
    }
  )
}

export async function createAdminClient() {
  if (!IS_CONFIGURED) return createMockClient() as any

  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // no-op
          }
        },
      },
    }
  )
}


