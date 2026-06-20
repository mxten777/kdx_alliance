import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// ============================================================
// AI Chat API - MVP 키워드 기반 안내 (RAG 확장 가능 구조)
// ============================================================

const SYSTEM_CONTEXT = `당신은 경주 문화선도산단(Culture & Mobility Valley) AI 안내 어시스턴트입니다.
바이칼시스템즈가 개발한 AI 기업지원·안내 서비스입니다.

당신의 역할:
1. 경주 문화선도산단 관련 행사, 견학, 공간, 기업지원, FAQ 정보를 안내합니다.
2. 명확한 답변이 어려울 경우 담당자 문의를 유도합니다.
3. 항상 친절하고 전문적인 공공기관 어시스턴트 톤을 유지합니다.
4. 한국어로 응답합니다.

중요 연락처:
- 대표 전화: 054-123-4567
- 이메일: info@gyeongju-cmv.kr
- 기업지원/행정 문의: 행정사법인 정유 054-789-0123
- 주차 문의: 스마트한 연락처 통해
- 안전 관련: 스마트아이넷 연락처 통해`

// 데이터베이스에서 컨텍스트 가져오기
async function getRelevantContext(query: string, supabase: Awaited<ReturnType<typeof createAdminClient>>) {
  const keywords = query.toLowerCase().split(/\s+/).filter((k) => k.length > 1)
  const contexts: string[] = []

  try {
    // FAQ 검색
    const { data: faqs } = await supabase
      .from('faqs')
      .select('question, answer')
      .eq('is_published', true)
      .limit(5)

    if (faqs) {
      const relevant = faqs.filter((f: { question: string; answer: string }) =>
        keywords.some((k) =>
          f.question.toLowerCase().includes(k) || f.answer.toLowerCase().includes(k)
        )
      )
      if (relevant.length > 0) {
        contexts.push('=== FAQ 정보 ===')
        relevant.forEach((f: { question: string; answer: string }) => {
          contexts.push(`Q: ${f.question}\nA: ${f.answer}`)
        })
      }
    }

    // 행사 검색
    if (keywords.some((k) => ['행사', '프로그램', '이벤트', '공연', '전시', '세미나'].includes(k))) {
      const { data: events } = await supabase
        .from('events')
        .select('title, description, start_date, end_date, location, is_free, status')
        .in('status', ['published', 'ongoing'])
        .gte('end_date', new Date().toISOString())
        .limit(3)

      if (events?.length) {
        contexts.push('=== 예정 행사 ===')
        events.forEach((e: { title: string; start_date: string | null; end_date: string | null; location: string | null; is_free: boolean }) => {
          contexts.push(`행사명: ${e.title}\n일정: ${e.start_date?.split('T')[0]} ~ ${e.end_date?.split('T')[0]}\n장소: ${e.location ?? '미정'}\n참가비: ${e.is_free ? '무료' : '유료'}`)
        })
      }
    }

    // 견학 검색
    if (keywords.some((k) => ['견학', '투어', '관광', '산업관광', '공장'].includes(k))) {
      const { data: tours } = await supabase
        .from('tours')
        .select('title, description, tour_type, duration_hours, max_participants, is_free, operating_days')
        .in('status', ['published', 'ongoing'])
        .limit(3)

      if (tours?.length) {
        contexts.push('=== 견학 프로그램 ===')
        tours.forEach((t: { title: string; tour_type: string; duration_hours: number | null; max_participants: number | null; is_free: boolean; operating_days: string[] | null }) => {
          contexts.push(`프로그램명: ${t.title}\n유형: ${t.tour_type}\n소요시간: ${t.duration_hours ?? '?'}시간\n최대 ${t.max_participants ?? '?'}인\n운영일: ${t.operating_days?.join(', ')}요일\n참가비: ${t.is_free ? '무료' : '유료'}`)
        })
      }
    }

    // 공간 검색
    if (keywords.some((k) => ['공간', '회의실', '시설', '대관', '예약', '홀', '교육장'].includes(k))) {
      const { data: spaces } = await supabase
        .from('spaces')
        .select('name, space_type, capacity, operating_hours, is_free')
        .eq('is_available', true)
        .limit(4)

      if (spaces?.length) {
        contexts.push('=== 예약 가능 공간/시설 ===')
        spaces.forEach((s: { name: string; capacity: number | null; operating_hours: string | null; is_free: boolean }) => {
          contexts.push(`공간명: ${s.name}\n수용: ${s.capacity ?? '?'}인\n운영: ${s.operating_hours ?? '미정'}\n이용료: ${s.is_free ? '무료' : '유료'}`)
        })
      }
    }

    // 지원사업 검색
    if (keywords.some((k) => ['지원', '사업', '보조금', '바우처', '공모', '신청'].includes(k))) {
      const { data: posts } = await supabase
        .from('support_posts')
        .select('title, summary, deadline, category')
        .eq('is_published', true)
        .in('category', ['subsidy', 'public_project'])
        .order('created_at', { ascending: false })
        .limit(3)

      if (posts?.length) {
        contexts.push('=== 지원사업/공모 ===')
        posts.forEach((p: { title: string; summary: string | null; deadline: string | null }) => {
          contexts.push(`사업명: ${p.title}\n${p.summary ?? ''}\n마감: ${p.deadline ?? '미정'}`)
        })
      }
    }
  } catch {
    // context 수집 실패 시 기본 답변으로 처리
  }

  return contexts.join('\n\n')
}

// 간단한 키워드 기반 응답 (OpenAI 미연동 시 폴백)
function keywordResponse(query: string): string | null {
  const q = query.toLowerCase()

  if (q.includes('견학') || q.includes('투어')) {
    return '산업관광/견학 프로그램은 [산업관광/견학] 메뉴에서 확인하실 수 있습니다. 공장견학, 체험형, 산업문화 투어, 단체견학 등 다양한 프로그램이 있으며, 원하시는 프로그램 선택 후 예약 신청이 가능합니다. 단체 견학(10인 이상)의 경우 최소 7일 전 신청을 권장합니다.'
  }
  if (q.includes('주차')) {
    return '경주 문화선도산단에는 총 4개 주차구역이 운영됩니다. 입주기업 임직원 및 방문객은 기본 무료로 이용하실 수 있습니다. 행사 시 제1주차장 또는 행사장 임시주차장을 이용하시기 바랍니다. 자세한 주차 현황은 당일 안내데스크에서 확인 가능합니다.'
  }
  if (q.includes('지원사업') || q.includes('보조금') || q.includes('바우처')) {
    return '[기업지원/공지] 메뉴에서 현재 신청 가능한 지원사업을 확인하실 수 있습니다. 기업지원 관련 행정 업무는 행정사법인 정유(054-789-0123)에서 담당하고 있으니 문의 주시기 바랍니다.'
  }
  if (q.includes('회의실') || q.includes('공간') || q.includes('대관')) {
    return '회의실·교육장·전시홀·다목적홀 등 다양한 공간을 예약하실 수 있습니다. [공간/시설] 메뉴에서 공간을 선택하고 예약 신청해 주세요. 예약은 최소 3일 전 신청 후 관리자 승인을 받으셔야 합니다.'
  }
  if (q.includes('문의') || q.includes('연락')) {
    return '문의는 [문의하기] 페이지를 이용하시거나, 대표 전화(054-123-4567) 또는 이메일(info@gyeongju-cmv.kr)로 연락 주시기 바랍니다. 운영 시간은 평일 09:00~18:00입니다.'
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionKey } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    // sanitize input length
    const sanitizedMessage = message.slice(0, 500)

    const supabase = await createAdminClient()

    // 세션 조회 또는 생성
    let sessionId: string
    if (sessionKey) {
      const { data: session } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('session_key', sessionKey)
        .single()

      if (session) {
        sessionId = session.id
        await supabase
          .from('chat_sessions')
          .update({ last_active_at: new Date().toISOString() })
          .eq('id', sessionId)
      } else {
        const { data: newSession } = await supabase
          .from('chat_sessions')
          .insert({ session_key: sessionKey, last_active_at: new Date().toISOString() })
          .select('id')
          .single()
        sessionId = newSession!.id
      }
    } else {
      const newKey = crypto.randomUUID()
      const { data: newSession } = await supabase
        .from('chat_sessions')
        .insert({ session_key: newKey, last_active_at: new Date().toISOString() })
        .select('id')
        .single()
      sessionId = newSession!.id
    }

    // 사용자 메시지 저장
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: sanitizedMessage,
    })

    // 키워드 기반 즉시 응답 (OpenAI 미연동 시)
    let assistantReply = keywordResponse(sanitizedMessage)

    if (!assistantReply) {
      // 컨텍스트 수집 후 기본 응답
      const context = await getRelevantContext(sanitizedMessage, supabase)

      if (context) {
        assistantReply = `문의하신 내용과 관련된 정보를 안내드립니다.\n\n${context}\n\n더 자세한 내용이나 다른 문의사항이 있으시면 담당자에게 직접 문의해 주세요.\n📞 054-123-4567 | 📧 info@gyeongju-cmv.kr`
      } else {
        assistantReply = `안녕하세요! 경주 문화선도산단 AI 안내 어시스턴트입니다.\n\n현재 질문하신 내용에 대한 구체적인 정보를 찾지 못했습니다. 다음 방법으로 문의해 주세요.\n\n• 📞 대표 전화: 054-123-4567 (평일 09:00~18:00)\n• 📧 이메일: info@gyeongju-cmv.kr\n• [문의하기](/contact) 페이지 이용\n\n행사, 견학, 공간 예약, 기업지원 등 구체적인 키워드로 다시 질문해 주시면 더 정확한 안내가 가능합니다.`
      }
    }

    // 어시스턴트 응답 저장
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'assistant',
      content: assistantReply,
    })

    return NextResponse.json({
      reply: assistantReply,
      sessionId,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
