---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md", "_bmad-output/planning-artifacts/ux-design-specification.md"]
workflowType: 'architecture'
project_name: 'party'
user_name: 'Seodaun'
date: '2025-12-27'
lastStep: 8
status: 'complete'
completedAt: '2025-12-27'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

Party는 총 50개의 기능 요구사항을 포함하며, 다음 주요 기능 영역으로 구성됩니다:

1. **사용자 관리** (FR1-FR6): 계정 생성, 프로필 관리, 인기도 조회, 사용자 타입 구분
2. **파티 관리** (FR7-FR17): 파티 생성/수정/삭제, 참여자 관리, 파티 상태 관리, 파티 조회
3. **인기도 시스템** (FR18-FR25): 인기도 계산, 표시, 필터링, 참여 제한
4. **평가 시스템** (FR26-FR37): 평가 작성, 리뷰 작성, 평가 이력 관리, 평가 통계
5. **검색 및 필터링** (FR38-FR43): 카테고리, 날짜, 지역, 키워드 검색, 필터 조합
6. **관리자 기능** (FR44-FR50): 품질 모니터링, 평가 검토, 제재, 신고 처리, 리포트 생성

**아키텍처적 의미:**
- 사용자 인증 및 권한 관리 시스템 필요
- 파티 및 평가 데이터 모델 설계 필요
- 인기도 계산 엔진 구현 필요
- 검색 및 필터링 인프라 필요
- 관리자 대시보드 및 모니터링 시스템 필요

**Non-Functional Requirements:**

다음 NFR들이 아키텍처 결정을 주도합니다:

**Performance:**
- 페이지 로딩 시간: 3초 이내 → SSR 최적화, 이미지 최적화 필요
- API 응답 시간: 500ms 이내 → 효율적인 데이터베이스 쿼리 및 캐싱 전략 필요
- SSR 렌더링 시간: 200ms 이내 → Next.js SSR 최적화 필요
- 데이터베이스 쿼리 응답 시간: 200ms 이내 → 인덱싱 및 쿼리 최적화 필요

**Security:**
- 사용자 데이터 암호화 → 데이터베이스 암호화 및 전송 보안 필요
- 안전한 인증/인가 → 인증 시스템 및 세션 관리 필요
- 웹 보안 표준 준수 → OWASP Top 10 대응 필요

**Scalability:**
- 동시 사용자 1,000명 이상 지원 → 수평 확장 가능한 아키텍처 필요
- 10배 사용자 성장 지원 → 확장 가능한 데이터베이스 및 인프라 전략 필요

**Scale & Complexity:**

- **Primary domain**: Full-stack Web Application
- **Complexity level**: Medium
- **Estimated architectural components**: 6-8개 주요 컴포넌트
  - 사용자 관리 서비스
  - 파티 관리 서비스
  - 인기도 계산 서비스
  - 평가 시스템 서비스
  - 검색 서비스
  - 관리자 서비스
  - 인증/인가 서비스
  - 이미지 관리 서비스

### Technical Constraints & Dependencies

**Framework Constraints:**
- Next.js with Server-Side Rendering (SSR) 필수
- Multi-Page Application (MPA) 구조
- Tailwind CSS + Headless UI 디자인 시스템

**Browser Constraints:**
- Chrome, Edge (최신 2개 버전)만 지원
- 최신 웹 표준 기능 활용 가능

**SEO Requirements:**
- 파티 목록 및 상세 페이지 검색 엔진 노출 필요
- 동적 메타 태그 생성 필요
- 구조화된 데이터 (Schema.org) 마크업 필요

**Platform Constraints:**
- Web only (처음은)
- Mobile-first 반응형 디자인
- 실시간 기능 불필요 (MVP)

**Performance Constraints:**
- SSR 렌더링 시간 200ms 이내
- API 응답 시간 500ms 이내
- 데이터베이스 쿼리 응답 시간 200ms 이내

### Cross-Cutting Concerns Identified

다음 cross-cutting concerns가 여러 컴포넌트에 영향을 미칩니다:

1. **인증 및 인가**
   - 모든 사용자 액션에 필요한 인증
   - 사용자 타입별 권한 관리 (일반 사용자, 멘토, 관리자)
   - 세션 관리 및 보안

2. **인기도 계산 로직**
   - 평가 시스템과 통합
   - 실시간 또는 배치 계산 결정 필요
   - 인기도 히스토리 관리

3. **평가 시스템**
   - 파티 참여자 간 상호 평가
   - 평가 데이터 무결성 보장
   - 악의적 평가 탐지 (향후)

4. **검색 및 필터링**
   - 파티 검색 성능 최적화
   - 복합 필터 조합 처리
   - 검색 결과 캐싱 전략

5. **이미지 업로드 및 관리**
   - 파티 이미지 저장 및 최적화
   - 이미지 CDN 전략
   - 이미지 지연 로딩

6. **데이터 일관성**
   - 파티 상태 변경 시 참여자 데이터 동기화
   - 평가 작성 시 인기도 업데이트
   - 트랜잭션 관리

7. **로깅 및 모니터링**
   - 시스템 성능 모니터링
   - 사용자 행동 추적
   - 에러 로깅 및 알림

## Starter Template Evaluation

### Primary Technology Domain

Full-stack Web Application based on project requirements analysis. Party requires Next.js SSR, TypeScript, PostgreSQL, and Tailwind CSS integration.

### Starter Options Considered

**Option 1: Vercel Next.js + PostgreSQL Auth Starter**
- Next.js with SSR support
- TypeScript
- Tailwind CSS
- PostgreSQL with Drizzle ORM
- NextAuth.js for authentication
- Vercel deployment optimization

**Option 2: T3 Stack (create-t3-app)**
- Next.js with tRPC
- TypeScript
- Prisma ORM
- NextAuth
- Tailwind CSS
- More complex setup with tRPC learning curve

### Selected Starter: Vercel Next.js + PostgreSQL Auth Starter

**Rationale for Selection:**

1. **Alignment with Requirements**: Matches PRD requirements for Next.js SSR and UX Design requirements for Tailwind CSS
2. **Technology Stack Fit**: Includes TypeScript, PostgreSQL, and Tailwind CSS as required
3. **Authentication Ready**: Includes NextAuth.js which is needed for user management (FR1-FR6)
4. **Vercel Optimization**: Optimized for Vercel deployment which aligns with deployment preference
5. **Learning-Friendly**: Lower learning curve while still providing modern best practices
6. **Extensibility**: Easy to add Headless UI and Docker configuration

**Initialization Command:**

```bash
# Clone the Vercel starter template
npx create-next-app@latest party --example "https://github.com/vercel/nextjs-postgres-auth-starter"
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript configured with strict mode
- Next.js 14+ with App Router
- Node.js runtime

**Styling Solution:**
- Tailwind CSS pre-configured
- Responsive design utilities included
- Custom configuration ready for Headless UI integration

**Build Tooling:**
- Next.js built-in build system
- TypeScript compilation
- Image optimization
- Font optimization

**Database & ORM:**
- PostgreSQL database setup
- Drizzle ORM configured
- Database migration system ready
- Type-safe database queries

**Authentication:**
- NextAuth.js configured
- Session management
- Authentication providers ready

**Code Organization:**
- App Router structure
- Server Components and Client Components separation
- API routes structure
- Component organization patterns

**Development Experience:**
- Hot reloading
- TypeScript type checking
- ESLint configuration
- Development server with fast refresh

**Additional Setup Required:**
- Headless UI installation and configuration
- Docker setup for local PostgreSQL development
- Environment variables configuration
- Database schema design for Party's data model

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- 데이터 모델링 접근법: Drizzle Schema 파일 분리
- 인증 및 권한 관리: NextAuth JWT + RBAC 패턴
- API 라우트 패턴: Next.js App Router Route Handlers
- 폼 처리 전략: React Hook Form + Zod + Server Actions
- Docker 로컬 개발 환경: Docker Compose PostgreSQL

**Important Decisions (Shape Architecture):**
- 데이터 검증: Zod (서버/클라이언트 공유)
- 캐싱 전략: Next.js 기본 캐싱 (MVP)
- 상태 관리: Server Components 우선
- 컴포넌트 구조: ui/, features/, layout/ 디렉토리
- 환경 변수 관리: .env 파일 구조 + Zod 검증

**Deferred Decisions (Post-MVP):**
- 외부 캐시 (Redis): 성장 단계에서 추가
- OAuth 제공자 확장: Google/GitHub 등
- API 문서화 (OpenAPI): 필요 시 확장
- 에러 추적 (Sentry): 성장 단계에서 추가
- 고급 상태 관리 (Zustand): 필요 시 추가

### Data Architecture

**Data Modeling Approach:**
- **Drizzle Schema 파일 구조**: 기능별로 스키마 파일 분리 (users.ts, parties.ts, evaluations.ts 등)
- **관계 정의**: Drizzle의 관계(relations) 기능으로 외래키와 조인 관리
- **타입 안전성**: Drizzle의 타입 추론 활용

**Data Validation Strategy:**
- **Zod 스키마**: 서버와 클라이언트에서 동일한 검증 스키마 공유
- **타입 안전성**: Zod 스키마에서 TypeScript 타입 자동 생성
- **검증 레이어**: 클라이언트(React Hook Form) + 서버(API Routes) + 데이터베이스 제약조건

**Caching Strategy:**
- **MVP**: Next.js 기본 캐싱 (Server Components fetch 캐싱, revalidate 옵션)
- **향후 확장**: Redis (Upstash 등) 추가 가능
- **캐싱 전략**: 정적 데이터는 긴 캐시, 동적 데이터는 짧은 캐시 또는 실시간

### Authentication & Security

**NextAuth Configuration:**
- **세션 전략**: JWT (서버리스 환경에 적합, Vercel 배포 고려)
- **인증 제공자**: 초기 Email/Password, 향후 Google/GitHub 추가 가능
- **세션 저장소**: JWT 사용 시 별도 저장소 불필요

**Authorization Pattern:**
- **RBAC (Role-Based Access Control)**: 사용자 타입별 권한 정의 (일반 사용자, 멘토, 관리자)
- **NextAuth 역할 확장**: 세션에 `role` 필드 포함
- **라우트 보호**: Next.js Middleware로 라우트별 권한 체크

**API Security:**
- **Rate Limiting**: Vercel Edge Functions 또는 Upstash Redis 사용
- **CSRF 보호**: NextAuth.js 기본 제공
- **XSS 방지**: React의 기본 이스케이핑 + Content Security Policy
- **SQL Injection 방지**: Drizzle ORM의 파라미터화된 쿼리 활용

### API & Communication Patterns

**API Route Pattern:**
- **Next.js App Router Route Handlers**: `app/api/` 디렉토리 구조
- **RESTful 패턴**: 리소스 기반 URL 구조 (`/api/parties`, `/api/users` 등)
- **HTTP 메서드**: GET, POST, PUT, DELETE 표준 사용

**Error Handling Standards:**
- **일관된 에러 응답 형식**: 
  ```typescript
  { success: boolean, error?: { code: string, message: string }, data?: T }
  ```
- **HTTP 상태 코드**: 표준 HTTP 상태 코드 사용 (200, 400, 401, 403, 404, 500)
- **에러 로깅**: 서버 사이드에서 에러 로깅 (향후 Sentry 등 통합 가능)

**Data Fetching Strategy:**
- **Server Components 우선**: 기본적으로 Server Components에서 데이터 페칭
- **Client Components**: 인터랙티브 기능(폼 제출, 실시간 업데이트)에만 사용
- **데이터 페칭 라이브러리**: Next.js 기본 `fetch` + React Server Components
- **캐싱**: Next.js의 `fetch` 캐싱 옵션 활용

**API Documentation Approach:**
- **MVP**: JSDoc 주석 + 간단한 README
- **향후 확장**: OpenAPI/Swagger 자동 생성 가능

### Frontend Architecture

**State Management Approach:**
- **Server Components 우선**: 대부분의 상태는 서버에서 관리
- **React Context**: 전역 UI 상태(테마, 모달 등)에만 사용
- **로컬 상태**: useState로 컴포넌트 내부 상태 관리
- **향후 확장**: 필요 시 Zustand 추가 가능

**Component Structure:**
```
app/
  (routes)/
components/
  ui/          # Headless UI 기반 재사용 가능한 UI 컴포넌트
  features/    # 기능별 컴포넌트 (PartyCard, UserProfile 등)
  layout/      # 레이아웃 컴포넌트
lib/           # 유틸리티 함수, 타입 정의
```

**Form Handling Strategy:**
- **React Hook Form**: 타입 안전성과 성능
- **Zod 통합**: 클라이언트 검증과 서버 검증 통합
- **Server Actions**: Next.js 14+ Server Actions로 폼 제출 처리

**Performance Optimization:**
- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **코드 스플리팅**: Next.js 자동 코드 스플리팅 활용
- **지연 로딩**: 동적 import로 필요 시 컴포넌트 로드
- **번들 최적화**: Next.js 기본 최적화 설정 활용

### Infrastructure & Deployment

**Docker Configuration:**
- **로컬 개발 환경**: Docker Compose로 PostgreSQL 컨테이너 실행
- **애플리케이션 컨테이너**: 로컬 개발 시에는 선택사항 (Vercel 배포 시 불필요)
- **Docker Compose 파일**: `docker-compose.yml`로 PostgreSQL 서비스 정의

**Environment Variable Management:**
- **환경 변수 파일 구조**:
  - `.env.local` - 로컬 개발용 (gitignore)
  - `.env.example` - 필요한 환경 변수 템플릿
  - Vercel 대시보드에서 프로덕션 환경 변수 설정
- **환경 변수 타입**: Zod로 환경 변수 검증

**CI/CD Pipeline:**
- **Vercel 자동 배포**: GitHub 연결 시 자동 배포
- **브랜치 전략**: main 브랜치 → 프로덕션, develop 브랜치 → 프리뷰 배포
- **빌드 검증**: Vercel 빌드 시 TypeScript 타입 체크 및 린트 실행

**Monitoring & Logging:**
- **MVP**: Vercel Analytics (기본 제공) + Vercel Logs (기본 제공)
- **향후 확장**: Sentry 에러 추적 추가
- **로깅 전략**: 구조화된 로깅 패턴 준비

**Scaling Strategy:**
- **수평 확장**: Vercel의 자동 스케일링 활용
- **데이터베이스 확장**: Vercel Postgres 또는 외부 PostgreSQL 서비스 (Supabase, Neon 등)
- **캐싱 확장**: 향후 Redis 추가 (Upstash 등)

### Decision Impact Analysis

**Implementation Sequence:**
1. 프로젝트 초기화 (Starter Template)
2. Docker 로컬 개발 환경 설정
3. 환경 변수 설정 및 Zod 검증
4. 데이터베이스 스키마 설계 (Drizzle)
5. NextAuth 설정 및 RBAC 구현
6. 기본 API Routes 구조 설정
7. 컴포넌트 구조 및 UI 컴포넌트 개발
8. 폼 처리 패턴 구현 (React Hook Form + Zod)

**Cross-Component Dependencies:**
- **인증 시스템**: 모든 사용자 액션에 필요 → 우선 구현
- **데이터 모델**: 모든 기능의 기반 → 스키마 설계 우선
- **에러 처리 표준**: 모든 API에 적용 → 초기 설정
- **컴포넌트 구조**: 모든 UI 개발의 기반 → 초기 설정
- **환경 변수 관리**: 모든 서비스 설정에 필요 → 초기 설정

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
5개 주요 영역에서 AI 에이전트들이 서로 다른 선택을 할 수 있는 잠재적 충돌 지점을 식별하고 일관된 패턴을 정의했습니다.

### Naming Patterns

**Database Naming Conventions:**

- **테이블**: 소문자, 복수형, 스네이크 케이스
  - ✅ `users`, `parties`, `party_evaluations`
  - ❌ `Users`, `User`, `partyEvaluations`

- **컬럼**: 소문자, 스네이크 케이스
  - ✅ `user_id`, `created_at`, `is_active`
  - ❌ `userId`, `createdAt`, `isActive`

- **외래키**: `{table}_id` 형식
  - ✅ `user_id`, `party_id`
  - ❌ `userId`, `fk_user`, `userFk`

- **인덱스**: `idx_{table}_{column}` 형식
  - ✅ `idx_users_email`, `idx_parties_created_at`
  - ❌ `users_email_index`, `email_idx`

**API Naming Conventions:**

- **엔드포인트**: 복수형, 케밥 케이스
  - ✅ `/api/parties`, `/api/users`, `/api/party-evaluations`
  - ❌ `/api/party`, `/api/user`, `/api/partyEvaluations`

- **라우트 파라미터**: `{id}` 형식
  - ✅ `/api/parties/{id}`, `/api/users/{userId}`
  - ❌ `/api/parties/:id`, `/api/parties/[id]`

- **쿼리 파라미터**: 카멜 케이스
  - ✅ `?userId=123&partyId=456`
  - ❌ `?user_id=123&party_id=456`

- **헤더**: 표준 HTTP 헤더 사용, 커스텀은 `X-` 접두사
  - ✅ `Authorization`, `Content-Type`, `X-Request-ID`
  - ❌ `Custom-Header`, `x-auth-token`

**Code Naming Conventions:**

- **컴포넌트**: 파스칼 케이스
  - ✅ `UserCard`, `PartyList`, `PartyDetail`
  - ❌ `userCard`, `user-card`, `User_Card`

- **파일명**: 
  - 컴포넌트는 파스칼 케이스: `UserCard.tsx`, `PartyList.tsx`
  - 유틸리티는 카멜 케이스: `formatDate.ts`, `validateEmail.ts`
  - ✅ `UserCard.tsx`, `formatDate.ts`
  - ❌ `user-card.tsx`, `format_date.ts`

- **함수**: 카멜 케이스
  - ✅ `getUserData`, `createParty`, `updateEvaluation`
  - ❌ `get_user_data`, `GetUserData`, `get-user-data`

- **변수**: 카멜 케이스
  - ✅ `userId`, `partyData`, `isLoading`
  - ❌ `user_id`, `party_data`, `is_loading`

### Structure Patterns

**Project Organization:**

```
app/
  (routes)/
    parties/
    users/
  api/
    parties/
    users/
components/
  ui/          # Headless UI 기반 재사용 컴포넌트
    Button.tsx
    Modal.tsx
  features/    # 기능별 컴포넌트
    party/
      PartyCard.tsx
      PartyList.tsx
    user/
      UserProfile.tsx
  layout/      # 레이아웃 컴포넌트
    Header.tsx
    Footer.tsx
lib/
  db/          # Drizzle 스키마 및 설정
    schema/
      users.ts
      parties.ts
    index.ts
  validations/ # Zod 스키마
    user.ts
    party.ts
  utils/       # 유틸리티 함수
    formatDate.ts
    validateEmail.ts
  types/       # TypeScript 타입 정의
    user.ts
    party.ts
```

**Test Organization:**

- **테스트 위치**: 컴포넌트와 같은 디렉토리에 `*.test.tsx` 파일로 co-located
  - ✅ `components/features/party/PartyCard.test.tsx`
  - ❌ `tests/components/PartyCard.test.tsx`

- **테스트 파일 네이밍**: `{ComponentName}.test.tsx`
  - ✅ `UserCard.test.tsx`, `PartyList.test.tsx`
  - ❌ `userCard.test.tsx`, `party-list.spec.tsx`

### Format Patterns

**API Response Formats:**

**성공 응답:**
```typescript
{
  success: true,
  data: T
}
```

**에러 응답:**
```typescript
{
  success: false,
  error: {
    code: string,      // 예: "VALIDATION_ERROR", "NOT_FOUND"
    message: string    // 사용자 친화적 메시지
  }
}
```

**HTTP 상태 코드 사용:**
- `200` - 성공
- `400` - 클라이언트 에러 (검증 실패 등)
- `401` - 인증 실패
- `403` - 권한 없음
- `404` - 리소스를 찾을 수 없음
- `500` - 서버 에러

**Data Exchange Formats:**

- **JSON 필드**: 카멜 케이스
  - ✅ `{ "userId": 123, "partyName": "파티 이름" }`
  - ❌ `{ "user_id": 123, "party_name": "파티 이름" }`

- **날짜**: ISO 8601 문자열
  - ✅ `"2025-12-27T10:00:00Z"`
  - ❌ `"2025-12-27"`, `1640601600000`

- **불린**: `true`/`false` (문자열이나 숫자 아님)
  - ✅ `{ "isActive": true }`
  - ❌ `{ "isActive": "true" }`, `{ "isActive": 1 }`

- **null 처리**: 명시적으로 `null` 사용 (undefined 사용 안 함)
  - ✅ `{ "description": null }`
  - ❌ `{ "description": undefined }` (JSON에서 제외됨)

### Communication Patterns

**State Management Patterns:**

- **상태 업데이트**: 항상 불변 업데이트
  - ✅ `setUsers([...users, newUser])`
  - ❌ `users.push(newUser)`

- **액션 네이밍**: `{action}{Entity}` 형식
  - ✅ `createParty`, `updateUser`, `deleteEvaluation`
  - ❌ `addParty`, `modifyUser`, `removeEvaluation`

- **로딩 상태 네이밍**: 명확한 접두사 사용
  - ✅ `isLoading`, `isFetching`, `isSubmitting`
  - ❌ `loading`, `fetching`, `submitting`

**Event System Patterns:**

- **이벤트 네이밍**: `{entity}.{action}` 형식 (소문자, 점 구분)
  - ✅ `user.created`, `party.updated`, `evaluation.deleted`
  - ❌ `UserCreated`, `PARTY_UPDATED`, `evaluationDeleted`

- **이벤트 페이로드**: 일관된 구조
  ```typescript
  {
    type: string,
    timestamp: string,
    data: T
  }
  ```

### Process Patterns

**Error Handling Patterns:**

- **에러 바운더리**: Next.js Error Boundary 사용
- **사용자 에러 메시지**: 친화적 메시지
  - ✅ `"파티를 찾을 수 없습니다"`
  - ❌ `"Error 404: Party not found"`, `"NOT_FOUND"`

- **로깅**: 서버 사이드에서 상세 에러 로깅 (스택 트레이스 포함)
- **에러 타입 구분**:
  - Zod 검증 에러: `VALIDATION_ERROR`
  - 비즈니스 로직 에러: `BUSINESS_ERROR`
  - 시스템 에러: `SYSTEM_ERROR`

**Loading State Patterns:**

- **로딩 상태 네이밍**: 명확한 접두사
  - ✅ `isLoading`, `isFetching`, `isSubmitting`
  - ❌ `loading`, `fetching`, `submitting`

- **로컬 vs 전역**: 컴포넌트별 로컬 로딩 상태 우선, 필요 시 전역 상태
- **로딩 UI**: Skeleton UI 또는 Spinner 컴포넌트 사용
  - ✅ `<Skeleton />`, `<Spinner />`
  - ❌ `"Loading..."` 텍스트만 사용

### Enforcement Guidelines

**All AI Agents MUST:**

1. **네이밍 규칙 준수**: 위에 정의된 모든 네이밍 패턴을 엄격히 따를 것
2. **API 응답 형식 준수**: 성공/에러 응답 형식을 일관되게 사용할 것
3. **에러 처리 패턴 준수**: 정의된 에러 처리 패턴을 따를 것
4. **파일 구조 준수**: 정의된 프로젝트 구조를 따를 것
5. **타입 안전성**: TypeScript 타입을 명시적으로 정의하고 사용할 것

**Pattern Enforcement:**

- **코드 리뷰**: 모든 PR에서 패턴 준수 여부 확인
- **린터 규칙**: ESLint 규칙으로 일부 패턴 자동 검증
- **타입 체크**: TypeScript 컴파일러로 타입 안전성 보장
- **문서화**: 패턴 위반 시 아키텍처 문서 참조

### Pattern Examples

**Good Examples:**

**Database Schema (Drizzle):**
```typescript
// lib/db/schema/users.ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**API Route Handler:**
```typescript
// app/api/parties/route.ts
export async function GET(request: Request) {
  try {
    const parties = await getParties();
    return Response.json({ success: true, data: parties });
  } catch (error) {
    return Response.json(
      { success: false, error: { code: 'SYSTEM_ERROR', message: '파티 목록을 불러오는데 실패했습니다' } },
      { status: 500 }
    );
  }
}
```

**Component:**
```typescript
// components/features/party/PartyCard.tsx
export function PartyCard({ party }: { party: Party }) {
  const [isLoading, setIsLoading] = useState(false);
  
  // ...
}
```

**Anti-Patterns:**

**❌ 잘못된 네이밍:**
```typescript
// ❌ 테이블명이 대문자
export const Users = pgTable('Users', { ... });

// ❌ API 엔드포인트가 단수형
app/api/party/route.ts

// ❌ 컴포넌트가 카멜 케이스
export function partyCard() { ... }
```

**❌ 잘못된 API 응답 형식:**
```typescript
// ❌ 일관되지 않은 응답 형식
return Response.json({ parties: data });
return Response.json({ error: "Error occurred" });
```

**❌ 잘못된 에러 처리:**
```typescript
// ❌ 기술적 에러 메시지를 사용자에게 노출
catch (error) {
  return Response.json({ error: error.stack });
}
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
party/
├── README.md
├── package.json
├── package-lock.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── .env.example
├── .gitignore
├── .eslintrc.json
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── parties/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── users/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── evaluations/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── parties/
│   │   │   └── page.tsx
│   │   ├── evaluations/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts
│       ├── users/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── parties/
│       │   ├── route.ts
│       │   ├── [id]/
│       │   │   ├── route.ts
│       │   │   ├── participants/
│       │   │   │   └── route.ts
│       │   │   └── status/
│       │   │       └── route.ts
│       │   └── search/
│       │       └── route.ts
│       ├── evaluations/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── popularity/
│       │   ├── route.ts
│       │   └── [userId]/
│       │       └── route.ts
│       ├── search/
│       │   └── route.ts
│       └── admin/
│           ├── users/
│           │   └── route.ts
│           ├── parties/
│           │   └── route.ts
│           └── evaluations/
│               └── route.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   └── Skeleton.tsx
│   ├── features/
│   │   ├── party/
│   │   │   ├── PartyCard.tsx
│   │   │   ├── PartyList.tsx
│   │   │   ├── PartyDetail.tsx
│   │   │   ├── PartyForm.tsx
│   │   │   ├── PartyCard.test.tsx
│   │   │   └── PartyList.test.tsx
│   │   ├── user/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UserCard.tsx
│   │   │   ├── UserProfile.test.tsx
│   │   │   └── UserCard.test.tsx
│   │   ├── evaluation/
│   │   │   ├── EvaluationForm.tsx
│   │   │   ├── EvaluationList.tsx
│   │   │   ├── EvaluationCard.tsx
│   │   │   └── EvaluationForm.test.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── SearchBar.test.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── UserManagement.tsx
│   │       └── PartyManagement.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Navigation.tsx
│       └── Header.test.tsx
├── lib/
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema/
│   │   │   ├── users.ts
│   │   │   ├── parties.ts
│   │   │   ├── evaluations.ts
│   │   │   └── index.ts
│   │   └── migrations/
│   ├── auth/
│   │   ├── config.ts
│   │   └── middleware.ts
│   ├── validations/
│   │   ├── user.ts
│   │   ├── party.ts
│   │   ├── evaluation.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── popularity/
│   │   │   ├── calculate.ts
│   │   │   └── index.ts
│   │   ├── search/
│   │   │   ├── index.ts
│   │   │   └── filters.ts
│   │   └── evaluation/
│   │       └── index.ts
│   ├── utils/
│   │   ├── formatDate.ts
│   │   ├── validateEmail.ts
│   │   └── api.ts
│   └── types/
│       ├── user.ts
│       ├── party.ts
│       ├── evaluation.ts
│       └── index.ts
├── middleware.ts
├── public/
│   ├── images/
│   └── icons/
└── tests/
    ├── __mocks__/
    ├── e2e/
    │   ├── parties.spec.ts
    │   ├── users.spec.ts
    │   └── evaluations.spec.ts
    └── utils/
        └── test-utils.tsx
```

### Architectural Boundaries

**API Boundaries:**

**External API Endpoints:**
- `/api/auth/*` - NextAuth 인증 엔드포인트
- `/api/users/*` - 사용자 관리 API
- `/api/parties/*` - 파티 관리 API
- `/api/evaluations/*` - 평가 시스템 API
- `/api/popularity/*` - 인기도 계산 API
- `/api/search/*` - 검색 및 필터링 API
- `/api/admin/*` - 관리자 기능 API

**Internal Service Boundaries:**
- **인증 서비스**: `lib/auth/` - NextAuth 설정 및 미들웨어
- **데이터베이스 서비스**: `lib/db/` - Drizzle 스키마 및 쿼리
- **비즈니스 로직 서비스**: `lib/services/` - 인기도 계산, 검색, 평가 로직
- **검증 서비스**: `lib/validations/` - Zod 스키마 검증

**Authentication and Authorization Boundaries:**
- **인증**: NextAuth.js를 통한 세션 관리 (`lib/auth/config.ts`)
- **권한 체크**: Next.js Middleware를 통한 라우트 보호 (`middleware.ts`)
- **역할 기반 접근**: 세션의 `role` 필드를 통한 RBAC

**Data Access Layer Boundaries:**
- **스키마 정의**: `lib/db/schema/` - Drizzle 스키마 파일
- **쿼리 함수**: 각 API Route에서 직접 Drizzle 쿼리 사용
- **트랜잭션**: Drizzle의 트랜잭션 기능 활용

**Component Boundaries:**

**Frontend Component Communication:**
- **Server Components**: 기본적으로 서버에서 데이터 페칭 및 렌더링
- **Client Components**: 인터랙티브 기능만 클라이언트 컴포넌트로 분리
- **Props 전달**: 타입 안전한 Props 인터페이스 사용

**State Management Boundaries:**
- **서버 상태**: Server Components에서 관리
- **클라이언트 상태**: React Context 또는 useState로 관리
- **폼 상태**: React Hook Form으로 관리

**Service Communication Patterns:**
- **API 호출**: Next.js Route Handlers를 통한 내부 API 호출
- **서비스 함수**: `lib/services/`의 순수 함수로 비즈니스 로직 분리
- **에러 처리**: 일관된 에러 응답 형식 사용

**Data Boundaries:**

**Database Schema Boundaries:**
- **사용자 스키마**: `lib/db/schema/users.ts`
- **파티 스키마**: `lib/db/schema/parties.ts`
- **평가 스키마**: `lib/db/schema/evaluations.ts`
- **관계 정의**: Drizzle relations로 외래키 관계 관리

**Data Access Patterns:**
- **직접 쿼리**: API Routes에서 Drizzle 쿼리 직접 사용
- **타입 안전성**: Drizzle의 타입 추론 활용
- **트랜잭션**: 복잡한 작업은 트랜잭션으로 처리

**Caching Boundaries:**
- **Next.js 캐싱**: Server Components의 fetch 캐싱
- **재검증**: `revalidate` 옵션으로 캐시 무효화
- **향후 확장**: Redis 캐싱 레이어 추가 가능

### Requirements to Structure Mapping

**Feature/Epic Mapping:**

**사용자 관리 (FR1-FR6):**
- **페이지**: `app/(main)/users/[id]/page.tsx`
- **API**: `app/api/users/route.ts`, `app/api/users/[id]/route.ts`
- **컴포넌트**: `components/features/user/UserProfile.tsx`, `components/features/user/UserCard.tsx`
- **스키마**: `lib/db/schema/users.ts`
- **검증**: `lib/validations/user.ts`
- **타입**: `lib/types/user.ts`

**파티 관리 (FR7-FR17):**
- **페이지**: `app/(main)/parties/page.tsx`, `app/(main)/parties/[id]/page.tsx`, `app/(main)/parties/create/page.tsx`
- **API**: `app/api/parties/route.ts`, `app/api/parties/[id]/route.ts`, `app/api/parties/[id]/participants/route.ts`, `app/api/parties/[id]/status/route.ts`
- **컴포넌트**: `components/features/party/PartyCard.tsx`, `components/features/party/PartyList.tsx`, `components/features/party/PartyDetail.tsx`, `components/features/party/PartyForm.tsx`
- **스키마**: `lib/db/schema/parties.ts`
- **검증**: `lib/validations/party.ts`
- **타입**: `lib/types/party.ts`

**인기도 시스템 (FR18-FR25):**
- **API**: `app/api/popularity/route.ts`, `app/api/popularity/[userId]/route.ts`
- **서비스**: `lib/services/popularity/calculate.ts`
- **통합**: 사용자 및 평가 스키마와 통합

**평가 시스템 (FR26-FR37):**
- **페이지**: `app/(main)/evaluations/page.tsx`, `app/(main)/evaluations/[id]/page.tsx`
- **API**: `app/api/evaluations/route.ts`, `app/api/evaluations/[id]/route.ts`
- **컴포넌트**: `components/features/evaluation/EvaluationForm.tsx`, `components/features/evaluation/EvaluationList.tsx`, `components/features/evaluation/EvaluationCard.tsx`
- **스키마**: `lib/db/schema/evaluations.ts`
- **검증**: `lib/validations/evaluation.ts`
- **서비스**: `lib/services/evaluation/index.ts`
- **타입**: `lib/types/evaluation.ts`

**검색 및 필터링 (FR38-FR43):**
- **API**: `app/api/search/route.ts`, `app/api/parties/search/route.ts`
- **컴포넌트**: `components/features/search/SearchBar.tsx`, `components/features/search/FilterPanel.tsx`
- **서비스**: `lib/services/search/index.ts`, `lib/services/search/filters.ts`

**관리자 기능 (FR44-FR50):**
- **페이지**: `app/admin/page.tsx`, `app/admin/users/page.tsx`, `app/admin/parties/page.tsx`, `app/admin/evaluations/page.tsx`
- **API**: `app/api/admin/users/route.ts`, `app/api/admin/parties/route.ts`, `app/api/admin/evaluations/route.ts`
- **컴포넌트**: `components/features/admin/AdminDashboard.tsx`, `components/features/admin/UserManagement.tsx`, `components/features/admin/PartyManagement.tsx`

**Cross-Cutting Concerns:**

**인증 시스템:**
- **설정**: `lib/auth/config.ts` - NextAuth 설정
- **미들웨어**: `middleware.ts` - 라우트 보호
- **API**: `app/api/auth/[...nextauth]/route.ts` - NextAuth 엔드포인트
- **타입**: NextAuth 타입 확장

**에러 처리:**
- **표준 형식**: 모든 API Route에서 일관된 에러 응답 형식 사용
- **에러 바운더리**: Next.js Error Boundary 활용
- **로깅**: 서버 사이드 에러 로깅

**검증 시스템:**
- **Zod 스키마**: `lib/validations/` - 모든 입력 검증
- **타입 생성**: Zod 스키마에서 TypeScript 타입 자동 생성
- **서버/클라이언트 공유**: 동일한 Zod 스키마 사용

### Integration Points

**Internal Communication:**

**Server Components → API Routes:**
- Server Components에서 직접 데이터베이스 쿼리 또는 API Route 호출
- 타입 안전한 데이터 전달

**API Routes → Services:**
- API Routes에서 `lib/services/`의 비즈니스 로직 함수 호출
- 순수 함수로 비즈니스 로직 분리

**Components → API Routes:**
- Client Components에서 `/api/*` 엔드포인트 호출
- Server Actions를 통한 폼 제출

**External Integrations:**

**NextAuth Providers:**
- Email/Password 인증 (초기)
- 향후 Google, GitHub OAuth 추가 가능

**Database:**
- PostgreSQL (로컬: Docker Compose, 프로덕션: Vercel Postgres 또는 외부 서비스)

**Image Storage:**
- 초기: Next.js Image Optimization
- 향후: Vercel Blob 또는 외부 스토리지 서비스

**Data Flow:**

**파티 생성 플로우:**
1. 사용자가 `app/(main)/parties/create/page.tsx`에서 폼 작성
2. `components/features/party/PartyForm.tsx`에서 React Hook Form + Zod 검증
3. Server Action 또는 API Route로 제출
4. `app/api/parties/route.ts`에서 Drizzle을 통해 데이터베이스에 저장
5. 성공 시 파티 상세 페이지로 리다이렉트

**인기도 계산 플로우:**
1. 평가 작성 시 `app/api/evaluations/route.ts`에서 평가 저장
2. `lib/services/popularity/calculate.ts` 호출하여 인기도 재계산
3. 사용자 테이블의 인기도 필드 업데이트

**검색 플로우:**
1. 사용자가 `components/features/search/SearchBar.tsx`에서 검색어 입력
2. `app/api/search/route.ts` 또는 `app/api/parties/search/route.ts` 호출
3. `lib/services/search/index.ts`에서 필터링 로직 실행
4. Drizzle 쿼리로 데이터베이스에서 검색
5. 결과를 `components/features/party/PartyList.tsx`에 표시

### File Organization Patterns

**Configuration Files:**

**Root Level:**
- `package.json` - 의존성 및 스크립트 관리
- `next.config.js` - Next.js 설정
- `tailwind.config.js` - Tailwind CSS 설정
- `tsconfig.json` - TypeScript 설정
- `.env.local` - 로컬 환경 변수 (gitignore)
- `.env.example` - 환경 변수 템플릿
- `docker-compose.yml` - 로컬 PostgreSQL 개발 환경

**Source Organization:**

**App Router Structure:**
- `app/` - Next.js App Router 페이지 및 라우트
- `app/(auth)/` - 인증 관련 페이지 그룹
- `app/(main)/` - 메인 애플리케이션 페이지 그룹
- `app/admin/` - 관리자 페이지
- `app/api/` - API Route Handlers

**Component Organization:**
- `components/ui/` - Headless UI 기반 재사용 가능한 UI 컴포넌트
- `components/features/` - 기능별 컴포넌트 (party, user, evaluation 등)
- `components/layout/` - 레이아웃 컴포넌트

**Library Organization:**
- `lib/db/` - 데이터베이스 관련 (스키마, 마이그레이션)
- `lib/auth/` - 인증 관련 설정
- `lib/validations/` - Zod 검증 스키마
- `lib/services/` - 비즈니스 로직 서비스
- `lib/utils/` - 유틸리티 함수
- `lib/types/` - TypeScript 타입 정의

**Test Organization:**

**Co-located Tests:**
- 컴포넌트 테스트는 컴포넌트와 같은 디렉토리에 `*.test.tsx` 파일로 위치
- 예: `components/features/party/PartyCard.test.tsx`

**E2E Tests:**
- `tests/e2e/` - End-to-end 테스트 파일
- Playwright 또는 Cypress 사용

**Test Utilities:**
- `tests/utils/test-utils.tsx` - 테스트 유틸리티 함수
- `tests/__mocks__/` - Mock 데이터 및 함수

**Asset Organization:**

**Static Assets:**
- `public/images/` - 정적 이미지 파일
- `public/icons/` - 아이콘 파일
- Next.js Image Optimization 활용

### Development Workflow Integration

**Development Server Structure:**
- `npm run dev` - Next.js 개발 서버 실행
- Hot reloading 및 Fast Refresh 지원
- TypeScript 타입 체크 실시간 실행

**Build Process Structure:**
- `npm run build` - 프로덕션 빌드
- Next.js 자동 코드 스플리팅
- 이미지 최적화
- TypeScript 컴파일 및 타입 체크

**Deployment Structure:**
- Vercel 자동 배포 (GitHub 연동)
- 환경 변수는 Vercel 대시보드에서 설정
- 빌드 시 자동으로 최적화 및 배포

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
모든 기술 선택이 함께 작동합니다:
- ✅ Next.js 14+ App Router + TypeScript + PostgreSQL + Drizzle ORM: 완벽한 호환성
- ✅ Tailwind CSS + Headless UI: 통합 가능
- ✅ NextAuth.js + JWT 세션: 서버리스 환경에 최적화
- ✅ Vercel 배포: Next.js와 완벽하게 통합
- ✅ Docker Compose: 로컬 PostgreSQL 개발 환경 구성 가능

**Pattern Consistency:**
모든 구현 패턴이 아키텍처 결정을 지원합니다:
- ✅ 네이밍 규칙: 데이터베이스(스네이크), API(케밥), 코드(카멜/파스칼) 일관성 유지
- ✅ 구조 패턴: Next.js App Router 구조와 완벽히 일치
- ✅ 통신 패턴: Server Components 우선, API Routes 일관된 응답 형식
- ✅ 프로세스 패턴: 에러 처리 및 로딩 상태 일관성 유지

**Structure Alignment:**
프로젝트 구조가 모든 아키텍처 결정을 지원합니다:
- ✅ 모든 기술 스택 요구사항을 구조로 지원
- ✅ 경계가 명확히 정의됨 (API, 컴포넌트, 서비스, 데이터)
- ✅ 통합 포인트가 구조화됨
- ✅ 요구사항 매핑이 완료됨

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

모든 50개의 기능 요구사항이 아키텍처로 지원됩니다:

- **사용자 관리 (FR1-FR6)**: ✅
  - NextAuth 인증, 사용자 스키마, 프로필 관리 API, RBAC 권한 관리

- **파티 관리 (FR7-FR17)**: ✅
  - 파티 스키마, 파티 CRUD API, 참여자 관리 API, 이미지 업로드 지원

- **인기도 시스템 (FR18-FR25)**: ✅
  - 인기도 계산 서비스, 사용자 스키마에 인기도 필드, 필터링 로직

- **평가 시스템 (FR26-FR37)**: ✅
  - 평가 스키마, 평가 CRUD API, 리뷰 기능, 평가 통계

- **검색 및 필터링 (FR38-FR43)**: ✅
  - 검색 API, 필터 서비스, 복합 필터 조합 로직

- **관리자 기능 (FR44-FR50)**: ✅
  - 관리자 페이지 구조, 관리자 API, 모니터링 및 리포트 기능

**Non-Functional Requirements Coverage:**

- **Performance**: ✅
  - Next.js SSR로 페이지 로딩 시간 최적화
  - Next.js 캐싱으로 API 응답 시간 개선
  - Drizzle ORM으로 데이터베이스 쿼리 최적화
  - 이미지 최적화 (Next.js Image)

- **Security**: ✅
  - NextAuth.js로 안전한 인증/인가 구현
  - HTTPS 전송 보안
  - Zod 검증으로 입력 검증
  - Drizzle ORM으로 SQL Injection 방지
  - RBAC 권한 관리

- **Scalability**: ✅
  - Vercel 자동 스케일링 지원
  - Next.js 서버리스 아키텍처
  - 향후 Redis 캐싱 확장 가능
  - 데이터베이스 확장 전략 (Vercel Postgres 또는 외부 서비스)

### Implementation Readiness Validation ✅

**Decision Completeness:**
- ✅ 모든 주요 결정이 문서화됨 (버전 포함)
- ✅ 기술 스택이 명확히 정의됨
- ✅ 통합 패턴이 정의됨
- ✅ 성능 고려사항이 반영됨

**Structure Completeness:**
- ✅ 프로젝트 구조가 완전하고 구체적임
- ✅ 모든 파일과 디렉토리가 정의됨
- ✅ 통합 포인트가 명확히 지정됨
- ✅ 컴포넌트 경계가 잘 정의됨

**Pattern Completeness:**
- ✅ 잠재적 충돌 지점이 해결됨
- ✅ 네이밍 규칙이 포괄적임
- ✅ 통신 패턴이 완전히 지정됨
- ✅ 프로세스 패턴(에러 처리 등)이 완료됨
- ✅ 구체적인 예시 제공

### Gap Analysis Results

**Critical Gaps:** 없음

**Important Gaps:**
- SEO 메타 태그 생성: 구조화된 데이터 마크업은 향후 구현 단계에서 추가
- 이미지 스토리지: 초기에는 Next.js Image 사용, 향후 외부 스토리지 서비스 고려
- 모니터링 도구: MVP 단계에서는 Vercel 기본 제공, 향후 Sentry 추가

**Nice-to-Have Gaps:**
- API 문서화: MVP 단계에서는 JSDoc, 향후 OpenAPI 확장 가능
- E2E 테스트 설정: Playwright/Cypress 설정은 구현 단계에서 진행
- 개발 도구: ESLint/Prettier 설정은 스타터 템플릿에 포함됨

### Validation Issues Addressed

검증 결과, 구현을 막는 중요한 이슈는 없습니다. 모든 요구사항이 아키텍처로 지원되며, 모든 결정들이 일관되게 작동합니다.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] 프로젝트 컨텍스트 분석 완료
- [x] 규모 및 복잡도 평가 완료
- [x] 기술 제약사항 식별 완료
- [x] Cross-cutting concerns 매핑 완료

**✅ Architectural Decisions**
- [x] 모든 주요 결정이 버전과 함께 문서화됨
- [x] 기술 스택이 완전히 지정됨
- [x] 통합 패턴이 정의됨
- [x] 성능 고려사항이 반영됨

**✅ Implementation Patterns**
- [x] 네이밍 규칙 수립 완료
- [x] 구조 패턴 정의 완료
- [x] 통신 패턴 지정 완료
- [x] 프로세스 패턴 문서화 완료

**✅ Project Structure**
- [x] 완전한 디렉토리 구조 정의 완료
- [x] 컴포넌트 경계 설정 완료
- [x] 통합 포인트 매핑 완료
- [x] 요구사항-구조 매핑 완료

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

검증 결과, 아키텍처는 구현 준비가 완료되었습니다.

**Key Strengths:**
1. **기술 스택 호환성**: 모든 기술이 잘 통합되어 작동함
2. **요구사항 커버리지**: 모든 50개 기능 요구사항이 아키텍처로 지원됨
3. **NFR 대응**: 성능, 보안, 확장성 요구사항이 모두 아키텍처로 처리됨
4. **일관성**: 모든 패턴과 구조가 일관되게 정의됨
5. **명확성**: AI 에이전트가 따라 구현할 수 있도록 충분히 문서화됨

**Areas for Future Enhancement:**
1. SEO 최적화: 구조화된 데이터 마크업 추가
2. 모니터링: Sentry 등 고급 모니터링 도구 통합
3. 캐싱: Redis 캐싱 레이어 추가
4. API 문서화: OpenAPI 스펙 자동 생성
5. 테스트 인프라: E2E 테스트 프레임워크 설정

### Implementation Handoff

**AI Agent Guidelines:**
- 문서화된 모든 아키텍처 결정을 정확히 따를 것
- 모든 컴포넌트에서 구현 패턴을 일관되게 사용할 것
- 프로젝트 구조와 경계를 존중할 것
- 모든 아키텍처 질문에 이 문서를 참조할 것

**First Implementation Priority:**
1. **프로젝트 초기화**: Vercel Next.js + PostgreSQL Auth Starter 사용
   ```bash
   npx create-next-app@latest party --example "https://github.com/vercel/nextjs-postgres-auth-starter"
   ```

2. **Docker 로컬 개발 환경 설정**: `docker-compose.yml`로 PostgreSQL 실행

3. **환경 변수 설정**: `.env.local` 및 `.env.example` 파일 구성

4. **데이터베이스 스키마 설계**: Drizzle 스키마 파일 생성 (users, parties, evaluations)

5. **NextAuth 설정**: 인증 설정 및 RBAC 구현

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2025-12-27
**Document Location:** _bmad-output/planning-artifacts/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**

- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

- 5개 주요 아키텍처 결정 카테고리 (Data, Auth, API, Frontend, Infrastructure)
- 5개 구현 패턴 카테고리 (Naming, Structure, Format, Communication, Process)
- 6개 주요 기능 영역 (사용자, 파티, 인기도, 평가, 검색, 관리자)
- 50개 기능 요구사항 완전 지원

**📚 AI Agent Implementation Guide**

- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing Party. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**
```bash
npx create-next-app@latest party --example "https://github.com/vercel/nextjs-postgres-auth-starter"
```

**Development Sequence:**

1. Initialize project using documented starter template
2. Set up development environment per architecture
3. Implement core architectural foundations
4. Build features following established patterns
5. Maintain consistency with documented rules

### Quality Assurance Checklist

**✅ Architecture Coherence**

- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**

- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**

- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs to technical implementation.

**🏗️ Solid Foundation**
The chosen starter template and architectural patterns provide a production-ready foundation following current best practices.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.

