import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export function createClient() {
  // 환경변수 미설정 시 빈 응답을 반환하는 mock 클라이언트
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const mockQuery = (): any => {
      const result = Promise.resolve({ data: [], error: null, count: 0 })
      const chain: any = Object.assign(result, {
        eq: () => chain, neq: () => chain, in: () => chain, not: () => chain,
        is: () => chain, gte: () => chain, lte: () => chain, gt: () => chain, lt: () => chain,
        order: () => chain, limit: () => chain, range: () => chain, filter: () => chain,
        select: () => chain,
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      })
      return chain
    }
    return {
      from: () => ({ select: mockQuery, insert: () => mockQuery(), update: () => mockQuery(), delete: () => mockQuery() }),
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ error: { message: 'Supabase 환경변수가 설정되지 않았습니다.' } }),
        signOut: async () => ({}),
      },
    } as any
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
