---
project_name: 'party'
user_name: 'Seodaun'
date: '2025-12-27'
sections_completed: ['technology_stack', 'language_specific', 'framework_specific', 'testing', 'code_quality', 'workflow', 'critical_rules']
status: 'complete'
rule_count: 50+
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

**Core Technologies:**
- Next.js 14+ (App Router) - 필수
- TypeScript (strict mode) - 필수
- PostgreSQL
- Drizzle ORM (PostgreSQL 드라이버 포함)
- NextAuth.js (JWT 세션 전략)
- Tailwind CSS
- Headless UI
- React Hook Form
- Zod (검증 스키마)
- Vercel (배포 플랫폼)
- Docker (로컬 개발 환경)

**Important Dependencies:**
- React 18+
- Node.js (LTS 버전)

**Critical Version Constraints:**
- Next.js 14+ 필수 (App Router 사용)
- TypeScript strict mode 필수
- Drizzle ORM은 PostgreSQL 드라이버와 함께 사용

## Critical Implementation Rules

### Language-Specific Rules

**TypeScript Configuration:**
- TypeScript strict mode 필수 - `tsconfig.json`에서 `strict: true` 확인
- `any` 타입 사용 금지 - 타입 안전성 최우선
- 타입 추론 활용 - 불필요한 타입 명시 지양

**Type Generation:**
- Zod 스키마에서 TypeScript 타입 자동 생성: `z.infer<typeof schema>`
- Drizzle ORM의 타입 추론 활용 - `db.select().from(users)`의 반환 타입 자동 추론
- 타입과 값 import 구분: `import type { User } from './types'` vs `import { getUser } from './utils'`

**Error Handling:**
- 타입 가드 활용: `if (error instanceof ZodError)`
- 에러 타입 명시: `catch (error: unknown)` 후 타입 체크

### Framework-Specific Rules

**Next.js App Router:**
- Server Components 우선 사용 - 기본적으로 Server Component로 작성
- Client Components는 인터랙티브 기능에만 사용 - `'use client'` 지시어 최소화
- Route Handlers: `app/api/` 디렉토리 구조, RESTful 패턴
- Server Actions: 폼 제출 처리에 사용
- Server Components에서 직접 데이터베이스 쿼리 또는 API 호출

**React Patterns:**
- Hooks: useState, useEffect 등 표준 React hooks 사용
- 상태 관리: Server Components 우선, React Context는 전역 UI 상태에만 사용
- 불변 업데이트 필수: `setUsers([...users, newUser])` 패턴
- React Hook Form + Zod로 폼 검증 및 제출

**Performance:**
- Next.js Image 컴포넌트 사용 (이미지 최적화)
- 동적 import로 필요 시 컴포넌트 로드: `const Component = dynamic(() => import('./Component'))`
- Server Components에서 데이터 페칭 (클라이언트 사이드 fetch 지양)

### Testing Rules

**Test Organization:**
- 테스트 파일은 컴포넌트와 같은 디렉토리에 co-located: `components/features/party/PartyCard.test.tsx`
- 테스트 파일 네이밍: `{ComponentName}.test.tsx` 형식 (파스칼 케이스)
- E2E 테스트는 `tests/e2e/` 디렉토리에 위치
- Mock 데이터는 `tests/__mocks__/` 디렉토리 사용

**Test Structure:**
- 컴포넌트 테스트는 컴포넌트 파일과 같은 위치에 배치
- 테스트 유틸리티는 `tests/utils/test-utils.tsx`에 위치

### Code Quality & Style Rules

**Naming Conventions:**
- 컴포넌트: 파스칼 케이스 (`UserCard`, `PartyList`)
- 파일명: 컴포넌트는 파스칼 케이스 (`UserCard.tsx`), 유틸은 카멜 케이스 (`formatDate.ts`)
- 함수/변수: 카멜 케이스 (`getUserData`, `userId`)
- 데이터베이스: 스네이크 케이스 (`users`, `user_id`, `created_at`)
- API 엔드포인트: 케밥 케이스 (`/api/parties`, `/api/users`)

**Code Organization:**
- 프로젝트 구조: `app/`, `components/`, `lib/` 디렉토리 구조 엄격히 준수
- 컴포넌트: `ui/`, `features/`, `layout/` 디렉토리로 분리
- 유틸리티: `lib/utils/` 디렉토리
- 타입: `lib/types/` 디렉토리
- 스키마: `lib/db/schema/` 디렉토리

**Linting & Formatting:**
- ESLint 규칙 준수 (스타터 템플릿 포함)
- Prettier 포맷팅 (스타터 템플릿 포함)
- 모든 네이밍 규칙은 아키텍처 문서의 Implementation Patterns 섹션 참조

### Development Workflow Rules

**Git/Repository:**
- 브랜치 전략: main → 프로덕션, develop → 프리뷰 배포
- 브랜치 네이밍: 기능별 브랜치 사용 (예: `feature/party-management`)
- 커밋 메시지: 명확하고 설명적인 커밋 메시지 작성

**Deployment:**
- Vercel 자동 배포: GitHub 연결 시 자동 배포
- 환경 변수: Vercel 대시보드에서 프로덕션 환경 변수 설정
- 빌드 검증: Vercel 빌드 시 TypeScript 타입 체크 및 린트 실행

**Code Review:**
- PR 요구사항: 코드 리뷰 및 아키텍처 패턴 준수 확인
- 모든 PR에서 네이밍 규칙 및 프로젝트 구조 준수 여부 확인

### Critical Don't-Miss Rules

**Anti-Patterns to Avoid:**
- ❌ `any` 타입 사용 금지 (TypeScript strict mode)
- ❌ 데이터베이스 네이밍: 대문자, 단수형, 카멜 케이스 사용 금지
- ❌ API 응답 형식 불일치: 일관된 응답 형식 사용 필수
- ❌ 에러 메시지: 기술적 에러를 사용자에게 노출 금지
- ❌ 상태 업데이트: 직접 mutation 금지 (`users.push()` 대신 `setUsers([...users, newUser])`)

**Security Rules:**
- SQL Injection 방지: Drizzle ORM의 파라미터화된 쿼리만 사용
- XSS 방지: React의 기본 이스케이핑 활용
- 인증/인가: NextAuth.js 및 Middleware로 라우트 보호 필수
- 입력 검증: Zod 스키마로 모든 입력 검증 (서버/클라이언트 모두)

**Performance Gotchas:**
- 클라이언트 사이드 fetch 지양: Server Components에서 데이터 페칭
- 이미지 최적화: Next.js Image 컴포넌트 사용 필수
- 불필요한 Client Components 생성 금지: Server Components 우선

**Data Format Rules:**
- API 응답 형식: `{ success: boolean, data?: T, error?: { code, message } }` 형식 준수
- 에러 처리: 사용자 친화적 메시지 사용, 기술적 에러는 서버 로깅
- null vs undefined: JSON에서는 `null` 사용, `undefined` 사용 금지
- 날짜 형식: ISO 8601 문자열 (`"2025-12-27T10:00:00Z"`)
- 불린 값: `true`/`false` 사용, 문자열이나 숫자 사용 금지

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge
- Refer to architecture document (`_bmad-output/planning-artifacts/architecture.md`) for detailed patterns

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

**Last Updated:** 2025-12-27
