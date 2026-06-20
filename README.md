# 경주 문화선도산단 CMV Platform

**Culture & Mobility Valley Digital Platform**  
경주 문화선도산단 통합 공공 디지털 플랫폼 — 행사·견학·기업지원·스마트주차·스마트안전·AI 안내를 단일 플랫폼으로 통합합니다.

## 기술 스택

| 레이어 | 기술 |
|---|---|
| 프론트엔드 | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui (Radix UI 기반) |
| 백엔드 | Supabase (PostgreSQL, RLS, Auth) |
| 폼 관리 | React Hook Form + Zod |
| 차트 | Recharts |
| 알림 | Sonner (Toast) |

## 컨소시엄 파트너

- **경주문화재단** — 문화행사 콘텐츠
- **경주시 도시공사** — 산단 시설 관리
- **스마트한** — 스마트주차 관제 시스템
- **스마트아이넷** — 스마트안전 태그 시스템
- **행정사법인 정유** — 기업지원 행정 서비스
- **바이칼시스템즈** — AI 챗봇 / 플랫폼 개발

---

## 로컬 개발 환경 설정

### 요구사항

- Node.js 20 이상
- npm
- Supabase 계정 (https://supabase.com)

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일에 실제 값 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> Supabase 대시보드 → Project Settings → API 탭에서 확인 가능

### 3. 데이터베이스 마이그레이션

**옵션 A: Supabase 대시보드 SQL 에디터 사용**

1. Supabase 대시보드 → SQL Editor 이동
2. `supabase/migrations/001_initial_schema.sql` 내용 복사 → 실행
3. `supabase/migrations/002_rls_policies.sql` 내용 복사 → 실행
4. (선택) `supabase/seed.sql` 실행 — 샘플 데이터

**옵션 B: Supabase CLI 사용**

```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
npx supabase db seed
```

### 4. 관리자 계정 생성

Supabase 대시보드 → Authentication → Users → Add User로 관리자 계정 생성 후:

```sql
-- SQL Editor에서 실행 (user_id는 생성된 유저의 UUID)
INSERT INTO admin_roles (user_id, role) VALUES ('your-user-uuid', 'super_admin');
```

### 5. 개발 서버 실행

```bash
npm run dev
npm run dev
```

- 공개 사이트: http://localhost:3000
- 관리자 콘솔: http://localhost:3000/admin (로그인 필요)
- AI 어시스턴트: http://localhost:3000/ai-assistant

---

## 주요 페이지 구조

### 공개 사이트 (Public)

| 경로 | 설명 |
|---|---|
| `/` | 홈페이지 (KPI, 행사, 견학, 공지 요약) |
| `/about` | 플랫폼·산단 소개 |
| `/events` | 행사/프로그램 목록 및 상세 |
| `/events/[id]/apply` | 행사 참가신청 |
| `/tours` | 산업관광/견학 목록 및 상세 |
| `/tours/[id]/reserve` | 견학 예약 |
| `/spaces` | 공간/시설 목록 및 예약 |
| `/organizations` | 참여기관 소개 |
| `/support` | 기업지원/공지사항 |
| `/faq` | FAQ |
| `/contact` | 문의하기 |
| `/ai-assistant` | AI 안내 어시스턴트 |

### 관리자 콘솔 (Admin, 로그인 필요)

| 경로 | 설명 |
|---|---|
| `/admin` | 대시보드 (KPI, 차트, 최근 현황) |
| `/admin/login` | 관리자 로그인 |
| `/admin/parking` | 스마트주차 현황 |
| `/admin/safety` | 스마트안전 현황 |
| `/admin/inquiries` | 문의 관리 |
| `/admin/tour-reservations` | 견학 예약 관리 |

---

## Vercel 배포

### 1. Vercel 프로젝트 생성

```bash
npx vercel
```

또는 Vercel 대시보드에서 GitHub 저장소 연결

### 2. 환경 변수 설정

Vercel 대시보드 → Project → Settings → Environment Variables에 추가:

| 변수명 | 필수 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase 공개 anon 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase 서비스 롤 키 (⚠️ 비공개) |

> `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트 측에 노출하지 마세요.

### 3. 배포

```bash
npx vercel --prod
```

---

## 프로젝트 폴더 구조

```
src/
├── app/
│   ├── (public)/          # 공개 사이트 (Header + Footer 레이아웃)
│   │   ├── page.tsx       # 홈페이지
│   │   ├── events/        # 행사 목록/상세/신청
│   │   ├── tours/         # 견학 목록/상세/예약
│   │   ├── spaces/        # 공간 목록/상세/예약
│   │   ├── organizations/ # 참여기관
│   │   ├── support/       # 기업지원/공지
│   │   ├── faq/           # FAQ
│   │   ├── contact/       # 문의하기
│   │   └── ai-assistant/  # AI 어시스턴트
│   ├── admin/             # 관리자 콘솔 (인증 필요)
│   │   ├── page.tsx       # 대시보드
│   │   ├── login/         # 로그인
│   │   ├── parking/       # 스마트주차
│   │   ├── safety/        # 스마트안전
│   │   ├── inquiries/     # 문의관리
│   │   └── tour-reservations/ # 견학예약관리
│   └── api/
│       └── ai-chat/       # AI 챗봇 API Route
├── components/
│   ├── common/            # KpiCard, PageHeader, StatusBadge, EmptyState
│   └── layout/            # Header, Footer, AdminSidebar, AdminHeader
├── features/
│   ├── events/            # EventApplyForm
│   ├── tours/             # TourReserveForm
│   ├── spaces/            # SpaceReserveForm
│   └── ai-assistant/      # ChatWindow
├── lib/
│   ├── supabase/          # client.ts, server.ts, middleware.ts
│   └── utils.ts
└── types/
    ├── database.types.ts  # Supabase DB 타입
    └── models.ts          # 도메인 모델 인터페이스
supabase/
├── migrations/
│   ├── 001_initial_schema.sql   # 전체 스키마
│   └── 002_rls_policies.sql     # Row Level Security
└── seed.sql                     # 샘플 데이터
```

---

## 보안 고려사항

- `SUPABASE_SERVICE_ROLE_KEY`는 서버(Server Components, API Routes)에서만 사용
- 모든 테이블에 RLS 정책 적용 (`002_rls_policies.sql`)
- 관리자 접근은 `admin_roles` 테이블 역할 기반 제어
- 공개 폼은 anon INSERT만 허용

---

## 라이선스

경주 문화선도산단 전용 플랫폼입니다.
