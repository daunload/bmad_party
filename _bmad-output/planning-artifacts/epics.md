---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md", "_bmad-output/planning-artifacts/architecture.md", "_bmad-output/planning-artifacts/ux-design-specification.md"]
status: 'complete'
total_epics: 6
total_stories: 39
fr_coverage: '100%'
completed_at: '2025-12-27'
---

# party - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for party, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: 사용자는 계정을 생성할 수 있다
FR2: 사용자는 프로필 정보를 입력하고 수정할 수 있다
FR3: 사용자는 자신의 프로필을 조회할 수 있다
FR4: 사용자는 다른 사용자의 프로필을 조회할 수 있다
FR5: 사용자는 자신의 인기도를 조회할 수 있다
FR6: 시스템은 사용자 타입을 구분할 수 있다 (일반 사용자, 멘토, 관리자)
FR7: 파티 주최자는 파티를 생성할 수 있다
FR8: 파티 주최자는 파티 정보를 입력할 수 있다 (제목, 설명, 날짜, 시간, 장소, 인원, 카테고리)
FR9: 파티 주최자는 파티 이미지를 업로드할 수 있다
FR10: 파티 주최자는 파티 정보를 수정할 수 있다
FR11: 파티 주최자는 파티를 삭제할 수 있다
FR12: 파티 주최자는 파티 상태를 관리할 수 있다 (모집 중, 모집 완료, 진행 중, 종료)
FR13: 파티 주최자는 참여 신청을 승인할 수 있다
FR14: 파티 주최자는 참여 신청을 거절할 수 있다
FR15: 파티 주최자는 참여자 목록을 조회할 수 있다
FR16: 사용자는 파티 상세 정보를 조회할 수 있다
FR17: 사용자는 파티 목록을 조회할 수 있다
FR18: 시스템은 참여자들의 평가를 기반으로 인기도를 계산할 수 있다
FR19: 시스템은 인기도를 등급으로 표시할 수 있다 (높음, 보통, 낮음)
FR20: 사용자는 자신의 인기도를 프로필에서 확인할 수 있다
FR21: 사용자는 파티 참여자 목록에서 다른 사용자의 인기도를 확인할 수 있다
FR22: 사용자는 인기도 히스토리를 조회할 수 있다
FR23: 파티 주최자는 인기도 기준을 설정할 수 있다
FR24: 시스템은 인기도 기준에 따라 참여자를 자동으로 필터링할 수 있다
FR25: 시스템은 인기도가 낮은 참여자의 파티 참여를 제한할 수 있다
FR26: 사용자는 파티 후 다른 참여자에 대한 평가를 작성할 수 있다
FR27: 사용자는 평가 항목을 입력할 수 있다 (매너, 참여도, 분위기 기여 등)
FR28: 사용자는 평가 점수를 입력할 수 있다
FR29: 사용자는 평가 코멘트를 작성할 수 있다
FR30: 사용자는 파티에 대한 리뷰를 작성할 수 있다
FR31: 사용자는 파티 주최자에 대한 리뷰를 작성할 수 있다
FR32: 사용자는 리뷰를 조회할 수 있다
FR33: 사용자는 리뷰 공개 설정을 변경할 수 있다
FR34: 사용자는 받은 평가 목록을 조회할 수 있다
FR35: 사용자는 작성한 평가 목록을 조회할 수 있다
FR36: 사용자는 평가 통계 및 요약을 조회할 수 있다
FR37: 사용자는 평가 이력을 조회할 수 있다
FR38: 사용자는 파티를 카테고리로 검색할 수 있다
FR39: 사용자는 파티를 날짜로 필터링할 수 있다
FR40: 사용자는 파티를 지역으로 필터링할 수 있다
FR41: 사용자는 파티를 키워드로 검색할 수 있다
FR42: 사용자는 여러 필터를 조합하여 파티를 검색할 수 있다
FR43: 시스템은 검색 결과를 목록으로 표시할 수 있다
FR44: 관리자는 커뮤니티 품질 지표를 모니터링할 수 있다
FR45: 관리자는 신고된 평가를 검토할 수 있다
FR46: 관리자는 악의적 평가 패턴을 탐지할 수 있다
FR47: 관리자는 평가에 대한 제재 조치를 취할 수 있다
FR48: 관리자는 사용자 신고를 처리할 수 있다
FR49: 관리자는 커뮤니티 가이드라인을 관리할 수 있다
FR50: 관리자는 분석 리포트를 생성할 수 있다

### NonFunctional Requirements

NFR1: 초기 페이지 로딩 시간: 3초 이내
NFR2: API 응답 시간: 500ms 이내
NFR3: 이미지 최적화 및 지연 로딩
NFR4: SSR 렌더링 시간: 200ms 이내
NFR5: 정적 페이지 생성 (Static Site Generation) 활용 가능 영역 식별
NFR6: 데이터베이스 쿼리 응답 시간: 200ms 이내
NFR7: 인덱싱 최적화를 통한 검색 성능 보장
NFR8: 모든 사용자 데이터는 암호화되어 저장되어야 한다
NFR9: 전송 중 데이터는 HTTPS를 통해 암호화되어야 한다
NFR10: 민감한 정보(비밀번호, 개인정보)는 적절한 해싱 및 암호화를 사용해야 한다
NFR11: 안전한 인증 메커니즘을 사용해야 한다
NFR12: 사용자 권한에 따른 접근 제어가 구현되어야 한다
NFR13: 세션 관리가 안전하게 처리되어야 한다
NFR14: 일반적인 웹 보안 표준을 준수해야 한다 (OWASP Top 10 고려)
NFR15: SQL Injection, XSS, CSRF 등의 공격에 대한 보호가 필요하다
NFR16: 입력 데이터 검증 및 sanitization이 구현되어야 한다
NFR17: 시스템은 동시에 1,000명 이상의 사용자를 지원할 수 있어야 한다
NFR18: 10배 사용자 성장(1,000명 → 10,000명)을 지원할 수 있어야 한다
NFR19: 성능 저하 없이 사용자 수 증가를 처리할 수 있어야 한다
NFR20: 예상되는 트래픽 패턴을 처리할 수 있어야 한다
NFR21: 피크 시간대의 트래픽 증가를 처리할 수 있어야 한다
NFR22: 데이터베이스 및 서버 리소스가 효율적으로 사용되어야 한다
NFR23: 수평 확장(horizontal scaling)이 가능한 아키텍처를 고려해야 한다
NFR24: 데이터베이스 확장 전략이 수립되어야 한다
NFR25: 캐싱 전략을 통한 성능 최적화가 고려되어야 한다

### Additional Requirements

**From Architecture:**
- Starter Template: Vercel Next.js + PostgreSQL Auth Starter 사용 (프로젝트 초기화 명령어: `npx create-next-app@latest party --example "https://github.com/vercel/nextjs-postgres-auth-starter"`)
- Docker setup for local PostgreSQL development environment
- Environment variables configuration (.env.local, .env.example)
- Database schema design for Party's data model (Drizzle ORM)
- Headless UI installation and configuration
- NextAuth.js configuration with JWT session strategy
- RBAC (Role-Based Access Control) implementation
- API response format standardization: `{ success: boolean, data?: T, error?: { code, message } }`
- Error handling patterns (user-friendly messages, server-side logging)
- Data format rules (ISO 8601 dates, null vs undefined, boolean values)

**From UX Design:**
- Mobile-first responsive design approach
- Browser support: Chrome, Edge (최신 2개 버전)
- Tailwind CSS + Headless UI design system
- Component structure: ui/, features/, layout/ directories
- Accessibility: Low priority (MVP)
- SEO requirements: 파티 목록 및 상세 페이지 검색 엔진 노출
- Image optimization: Next.js Image component 사용
- Loading states: Skeleton UI 또는 Spinner components

### FR Coverage Map

FR1: Epic 1 - 사용자 계정 생성
FR2: Epic 1 - 프로필 정보 입력 및 수정
FR3: Epic 1 - 자신의 프로필 조회
FR4: Epic 1 - 다른 사용자의 프로필 조회
FR5: Epic 1 - 자신의 인기도 조회
FR6: Epic 1 - 사용자 타입 구분 (일반 사용자, 멘토, 관리자)
FR7: Epic 2 - 파티 생성
FR8: Epic 2 - 파티 정보 입력
FR9: Epic 2 - 파티 이미지 업로드
FR10: Epic 2 - 파티 정보 수정
FR11: Epic 2 - 파티 삭제
FR12: Epic 2 - 파티 상태 관리
FR13: Epic 4 - 참여 신청 승인
FR14: Epic 4 - 참여 신청 거절
FR15: Epic 4 - 참여자 목록 조회
FR16: Epic 2 - 파티 상세 정보 조회
FR17: Epic 2 - 파티 목록 조회
FR18: Epic 5 - 인기도 계산
FR19: Epic 5 - 인기도 등급 표시
FR20: Epic 5 - 자신의 인기도 확인
FR21: Epic 5 - 다른 사용자의 인기도 확인
FR22: Epic 5 - 인기도 히스토리 조회
FR23: Epic 5 - 인기도 기준 설정
FR24: Epic 5 - 인기도 기준 필터링
FR25: Epic 5 - 인기도 낮은 참여자 참여 제한
FR26: Epic 5 - 평가 작성
FR27: Epic 5 - 평가 항목 입력
FR28: Epic 5 - 평가 점수 입력
FR29: Epic 5 - 평가 코멘트 작성
FR30: Epic 5 - 파티 리뷰 작성
FR31: Epic 5 - 파티 주최자 리뷰 작성
FR32: Epic 5 - 리뷰 조회
FR33: Epic 5 - 리뷰 공개 설정 변경
FR34: Epic 5 - 받은 평가 목록 조회
FR35: Epic 5 - 작성한 평가 목록 조회
FR36: Epic 5 - 평가 통계 및 요약 조회
FR37: Epic 5 - 평가 이력 조회
FR38: Epic 3 - 카테고리 검색
FR39: Epic 3 - 날짜 필터링
FR40: Epic 3 - 지역 필터링
FR41: Epic 3 - 키워드 검색
FR42: Epic 3 - 복합 필터 조합 검색
FR43: Epic 3 - 검색 결과 목록 표시
FR44: Epic 6 - 커뮤니티 품질 지표 모니터링
FR45: Epic 6 - 신고된 평가 검토
FR46: Epic 6 - 악의적 평가 패턴 탐지
FR47: Epic 6 - 평가 제재 조치
FR48: Epic 6 - 사용자 신고 처리
FR49: Epic 6 - 커뮤니티 가이드라인 관리
FR50: Epic 6 - 분석 리포트 생성

## Epic List

### Epic 1: 프로젝트 초기화 및 사용자 인증 시스템

사용자가 계정을 생성하고 로그인하여 프로필을 관리할 수 있도록 하는 기본 인증 및 사용자 관리 시스템을 구축합니다.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6

**Implementation Notes:**
- Starter Template 초기화 (Vercel Next.js + PostgreSQL Auth Starter)
- NextAuth.js 설정 (JWT 세션 전략)
- 기본 사용자 스키마 (Drizzle ORM)
- RBAC 기반 권한 관리 (일반 사용자, 멘토, 관리자)
- Docker 로컬 개발 환경 설정
- 환경 변수 설정

### Epic 2: 파티 생성 및 관리

파티 주최자가 파티를 생성, 수정, 삭제하고 상태를 관리할 수 있는 핵심 파티 관리 기능을 제공합니다.

**FRs covered:** FR7, FR8, FR9, FR10, FR11, FR12, FR16, FR17

**Implementation Notes:**
- 파티 스키마 설계 (Drizzle ORM)
- 이미지 업로드 기능 (Next.js Image 최적화)
- 파티 상태 관리 (모집 중, 모집 완료, 진행 중, 종료)
- 파티 목록 및 상세 페이지 (SSR 최적화)

### Epic 3: 파티 검색 및 발견

사용자가 원하는 파티를 다양한 필터를 통해 검색하고 발견할 수 있는 검색 시스템을 구축합니다.

**FRs covered:** FR38, FR39, FR40, FR41, FR42, FR43

**Implementation Notes:**
- 검색 API 설계 (복합 필터 조합)
- 검색 성능 최적화 (인덱싱, 캐싱)
- 검색 결과 UI (반응형 디자인)

### Epic 4: 파티 참여 시스템

사용자가 파티에 참여 신청하고, 주최자가 승인/거절할 수 있는 참여 관리 시스템을 구축합니다.

**FRs covered:** FR13, FR14, FR15

**Implementation Notes:**
- 참여 신청 플로우
- 주최자 승인/거절 UI
- 참여자 목록 관리

### Epic 5: 평가 및 인기도 시스템

사용자가 파티 후 평가를 작성하고, 시스템이 인기도를 계산하여 표시하는 평가 및 인기도 시스템을 구축합니다.

**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36, FR37

**Implementation Notes:**
- 평가 스키마 설계
- 인기도 계산 로직 (평균 평가 점수 기반)
- 인기도 표시 및 필터링
- 평가 작성 UI/UX
- 리뷰 시스템

### Epic 6: 관리자 기능

관리자가 커뮤니티를 모니터링하고 관리할 수 있는 관리자 대시보드 및 관리 기능을 제공합니다.

**FRs covered:** FR44, FR45, FR46, FR47, FR48, FR49, FR50

**Implementation Notes:**
- 관리자 대시보드
- 모니터링 도구
- 신고 처리 시스템
- 리포트 생성 기능

## Epic 1: 프로젝트 초기화 및 사용자 인증 시스템

사용자가 계정을 생성하고 로그인하여 프로필을 관리할 수 있도록 하는 기본 인증 및 사용자 관리 시스템을 구축합니다.

### Story 1.1: 프로젝트 초기화 및 개발 환경 설정

As a developer,
I want to initialize the project with the starter template and set up the local development environment,
So that I can begin implementing features with a solid foundation.

**Acceptance Criteria:**

**Given** the starter template command is available
**When** the project is initialized using `npx create-next-app@latest party --example "https://github.com/vercel/nextjs-postgres-auth-starter"`
**Then** the Next.js 14+ App Router project structure is created
**And** Docker Compose PostgreSQL setup is configured for local development
**And** environment variables template (.env.example) is created with required variables
**And** TypeScript strict mode is enabled in tsconfig.json
**And** the project can be started with `npm run dev`

### Story 1.2: 사용자 인증 시스템 구축 (NextAuth.js)

As a user,
I want to register and login with email and password,
So that I can access the platform securely.

**Acceptance Criteria:**

**Given** NextAuth.js is configured with JWT session strategy
**When** a user registers with email and password
**Then** a user account is created in the database with hashed password
**And** the user can login with their credentials
**And** a secure JWT session is established
**And** the user is redirected to the dashboard after successful login
**And** invalid credentials show appropriate error messages
**And** password validation enforces security requirements

### Story 1.3: 사용자 프로필 관리

As a user,
I want to view and edit my profile information,
So that I can manage my personal information.

**Acceptance Criteria:**

**Given** a logged-in user
**When** the user views their profile page
**Then** their profile information is displayed (name, email, profile image, etc.)
**And** the user can edit their profile information
**And** changes are validated using Zod schemas
**And** changes are saved to the database
**And** the updated profile is displayed immediately
**And** validation errors are shown for invalid input

### Story 1.4: 다른 사용자 프로필 조회

As a user,
I want to view other users' profiles,
So that I can see their information and popularity rating.

**Acceptance Criteria:**

**Given** a user exists in the system
**When** a user (logged in or not) views another user's profile page
**Then** the other user's public profile information is displayed
**And** the user's popularity rating is shown (if available, default to "보통")
**And** the profile page is accessible via `/users/[id]` route
**And** the page uses Server Components for data fetching
**And** the page is SEO-optimized with proper meta tags

### Story 1.5: 사용자 타입 및 권한 관리 (RBAC)

As a system,
I want to distinguish user types and manage permissions,
So that different user roles have appropriate access levels.

**Acceptance Criteria:**

**Given** user types are defined (일반 사용자, 멘토, 관리자)
**When** a user is created
**Then** their user type is assigned (default: 일반 사용자)
**And** the user type is stored in the database
**And** permissions are enforced based on user type via Next.js Middleware
**And** admin routes (`/admin/*`) are only accessible to 관리자 users
**And** unauthorized access attempts are redirected with appropriate error messages
**And** the user's role is included in the NextAuth session

## Epic 2: 파티 생성 및 관리

파티 주최자가 파티를 생성, 수정, 삭제하고 상태를 관리할 수 있는 핵심 파티 관리 기능을 제공합니다.

### Story 2.1: 파티 데이터 모델 및 스키마 설계

As a developer,
I want to create the party database schema,
So that party data can be stored and retrieved efficiently.

**Acceptance Criteria:**

**Given** Drizzle ORM is configured
**When** the party schema is created in `lib/db/schema/parties.ts`
**Then** the parties table includes all required fields (제목, 설명, 날짜, 시간, 장소, 인원, 카테고리, 이미지 URL, 상태, 주최자 ID)
**And** relationships are defined with users table using Drizzle relations
**And** appropriate indexes are created for search performance (날짜, 카테고리, 지역)
**And** the schema is type-safe with TypeScript
**And** database migrations are created and can be run

### Story 2.2: 파티 생성 기능

As a party host,
I want to create a new party with all necessary information,
So that I can organize and share my party with potential participants.

**Acceptance Criteria:**

**Given** a logged-in user
**When** the user navigates to `/parties/create`
**Then** a form is displayed with all required fields (제목, 설명, 날짜, 시간, 장소, 인원, 카테고리)
**And** the form uses React Hook Form with Zod validation
**And** when submitted via Server Action, the party is created in the database
**And** the party status is set to "모집 중" by default
**And** the user is redirected to the party detail page
**And** validation errors are displayed for invalid input
**And** only logged-in users can create parties

### Story 2.3: 파티 이미지 업로드

As a party host,
I want to upload an image for my party,
So that participants can see what the party is about.

**Acceptance Criteria:**

**Given** a user is creating or editing a party
**When** the user uploads an image
**Then** the image is validated (file type: jpg, png, webp; max size: 5MB)
**And** the image is optimized using Next.js Image optimization
**And** the image URL is stored in the database
**And** the image is displayed in the party detail page using Next.js Image component
**And** image upload errors are handled gracefully with user-friendly messages
**And** the image upload uses Server Actions or API route

### Story 2.4: 파티 목록 조회

As a user,
I want to view a list of available parties,
So that I can discover parties I might want to join.

**Acceptance Criteria:**

**Given** parties exist in the database
**When** a user visits `/parties` page
**Then** all active parties (status: 모집 중, 모집 완료) are displayed in a list
**And** each party card shows essential information (제목, 날짜, 장소, 카테고리, 이미지, 주최자)
**And** the page uses Server Components for data fetching
**And** the page is paginated for performance (e.g., 20 parties per page)
**And** the page is SEO-optimized with proper meta tags
**And** the page loads within 3 seconds (NFR1)

### Story 2.5: 파티 상세 정보 조회

As a user,
I want to view detailed information about a party,
So that I can decide whether to participate.

**Acceptance Criteria:**

**Given** a party exists in the database
**When** a user visits `/parties/[id]` page
**Then** all party information is displayed (제목, 설명, 날짜, 시간, 장소, 인원, 카테고리, 이미지, 주최자 정보, 상태)
**And** the page uses Server Components for data fetching
**And** the page is SEO-optimized with proper meta tags and structured data
**And** 404 error is shown for non-existent parties
**And** the page loads within 3 seconds (NFR1)
**And** the page is accessible to both logged-in and non-logged-in users

### Story 2.6: 파티 정보 수정

As a party host,
I want to edit my party information,
So that I can update details as needed.

**Acceptance Criteria:**

**Given** a logged-in user who created a party
**When** the user visits `/parties/[id]/edit` page
**Then** the form is pre-filled with existing party data
**And** the user can modify any field
**And** changes are validated using Zod schemas
**And** when submitted via Server Action, the party is updated in the database
**And** the user is redirected to the party detail page
**And** only the party host can edit their party (authorization check)
**And** unauthorized access attempts show appropriate error messages

### Story 2.7: 파티 삭제

As a party host,
I want to delete my party,
So that I can remove parties that are no longer relevant.

**Acceptance Criteria:**

**Given** a logged-in user who created a party
**When** the user attempts to delete their party
**Then** a confirmation dialog is shown
**And** when confirmed, the party is deleted from the database via Server Action
**And** the user is redirected to the parties list page
**And** only the party host can delete their party (authorization check)
**And** appropriate error messages are shown for unauthorized attempts
**And** related data (참여 신청, 평가 등) is handled appropriately (cascade or soft delete)

### Story 2.8: 파티 상태 관리

As a party host,
I want to manage my party's status,
So that I can control the party lifecycle (모집 중, 모집 완료, 진행 중, 종료).

**Acceptance Criteria:**

**Given** a logged-in user who created a party
**When** the user changes the party status
**Then** the status is updated in the database via API route or Server Action
**And** the status change is reflected immediately on the party detail page
**And** appropriate status transitions are validated (e.g., cannot go from "종료" to "모집 중")
**And** only the party host can change the party status (authorization check)
**And** the status is displayed on the party detail page with appropriate visual indicators
**And** status change history is logged (optional, for future use)

## Epic 3: 파티 검색 및 발견

사용자가 원하는 파티를 다양한 필터를 통해 검색하고 발견할 수 있는 검색 시스템을 구축합니다.

### Story 3.1: 파티 검색 API 구현

As a user,
I want to search for parties using keywords,
So that I can find parties that match my interests.

**Acceptance Criteria:**

**Given** parties exist in the database
**When** a user searches with keywords via `/api/parties/search` API
**Then** the search queries party 제목, 설명, 카테고리 fields
**And** the API returns matching parties
**And** the API response follows the standard format `{ success: boolean, data?: T, error?: { code, message } }`
**And** the API response time is within 500ms (NFR2)
**And** search results are paginated (e.g., 20 results per page)
**And** database queries use proper indexes for performance
**And** case-insensitive search is implemented

### Story 3.2: 파티 카테고리 필터링

As a user,
I want to filter parties by category,
So that I can find parties in specific categories.

**Acceptance Criteria:**

**Given** parties exist with different categories
**When** a user selects a category filter on the search page
**Then** only parties matching that category are displayed
**And** the filter can be combined with other filters (날짜, 지역, 키워드)
**And** the filter state is maintained in the URL query parameters
**And** the page updates using Server Components re-fetch or client-side filtering
**And** the filter UI is accessible and mobile-friendly

### Story 3.3: 파티 날짜 필터링

As a user,
I want to filter parties by date,
So that I can find parties happening on specific dates.

**Acceptance Criteria:**

**Given** parties exist with different dates
**When** a user selects a date range filter
**Then** only parties within that date range are displayed
**And** the filter supports both single date and date range selection
**And** the filter can be combined with other filters
**And** the filter state is maintained in the URL query parameters
**And** date validation ensures only future dates are selectable
**And** the date picker UI is user-friendly and accessible

### Story 3.4: 파티 지역 필터링

As a user,
I want to filter parties by location,
So that I can find parties in my area.

**Acceptance Criteria:**

**Given** parties exist with different locations
**When** a user selects a location filter
**Then** only parties matching that location are displayed
**And** the filter supports location search/autocomplete functionality
**And** the filter can be combined with other filters
**And** the filter state is maintained in the URL query parameters
**And** location matching is case-insensitive
**And** partial location matches are supported (e.g., "서울" matches "서울시 강남구")

### Story 3.5: 복합 필터 조합 검색

As a user,
I want to combine multiple filters to search for parties,
So that I can find parties that match all my criteria.

**Acceptance Criteria:**

**Given** multiple filter options are available (카테고리, 날짜, 지역, 키워드)
**When** a user selects multiple filters
**Then** the search API combines all filters using AND logic
**And** only parties matching ALL selected filters are returned
**And** the filter combination is reflected in the URL query parameters
**And** the search results update dynamically
**And** the API response time is within 500ms (NFR2)
**And** database queries are optimized with proper indexes
**And** the filter combination is displayed clearly to the user

### Story 3.6: 검색 결과 UI 및 사용자 경험

As a user,
I want to see search results in a clear and organized way,
So that I can easily browse and select parties.

**Acceptance Criteria:**

**Given** search results are returned from the API
**When** the results are displayed on the search page
**Then** each party is shown in a card format with key information (제목, 날짜, 장소, 카테고리, 이미지)
**And** the results are displayed in a responsive grid layout (mobile-first)
**And** loading states are shown during search using Skeleton UI
**And** empty states are shown when no results are found with helpful messaging
**And** the search interface is mobile-friendly and accessible
**And** the page uses Server Components for initial load, Client Components for interactive filtering
**And** pagination controls are provided for navigating through results

## Epic 4: 파티 참여 시스템

사용자가 파티에 참여 신청하고, 주최자가 승인/거절할 수 있는 참여 관리 시스템을 구축합니다.

### Story 4.1: 파티 참여 신청 데이터 모델

As a developer,
I want to create the party participation schema,
So that participation requests can be stored and managed.

**Acceptance Criteria:**

**Given** Drizzle ORM is configured
**When** the participation schema is created in `lib/db/schema/party_participants.ts`
**Then** a party_participants table includes fields (party_id, user_id, status, requested_at, approved_at, rejected_at)
**And** relationships are defined with parties and users tables using Drizzle relations
**And** status values are defined as enum (pending, approved, rejected)
**And** unique constraint ensures one request per user per party
**And** the schema is type-safe with TypeScript
**And** database migrations are created and can be run

### Story 4.2: 파티 참여 신청 기능

As a user,
I want to apply to join a party,
So that I can participate in parties I'm interested in.

**Acceptance Criteria:**

**Given** a logged-in user viewing a party detail page
**When** the user clicks "참여 신청" button
**Then** a participation request is created with status "pending" via Server Action
**And** the request is stored in the database
**And** the user sees a confirmation message
**And** the button state changes to "신청 완료" or "대기 중"
**And** duplicate applications are prevented (same user, same party)
**And** users cannot apply to their own parties
**And** validation ensures the party is still accepting applications (status: 모집 중)
**And** appropriate error messages are shown for invalid attempts

### Story 4.3: 주최자 참여 신청 승인/거절

As a party host,
I want to approve or reject participation requests,
So that I can manage who joins my party.

**Acceptance Criteria:**

**Given** a logged-in party host viewing their party management page
**When** the host views pending participation requests
**Then** all pending requests are displayed with user information (name, profile, popularity rating)
**And** the host can approve or reject each request via Server Action
**And** when approved, the status is updated to "approved" in the database
**And** when rejected, the status is updated to "rejected" in the database
**And** the applicant sees the status update on their party detail page
**And** only the party host can approve/reject requests for their party (authorization check)
**And** the participant count is updated when requests are approved
**And** the party status can be changed to "모집 완료" when capacity is reached
**And** appropriate error messages are shown for unauthorized attempts

### Story 4.4: 참여자 목록 조회

As a party host,
I want to view the list of participants for my party,
So that I can see who will be attending.

**Acceptance Criteria:**

**Given** a logged-in party host viewing their party
**When** the host views the participants section
**Then** all approved participants are displayed with their information (name, profile image, popularity rating)
**And** the list is organized clearly in a card or list format
**And** the page uses Server Components for data fetching
**And** only the party host can view the full participants list
**And** other users see limited participant information (count, public profiles only)
**And** the participant list is displayed on the party detail page
**And** the list is responsive and mobile-friendly

## Epic 5: 평가 및 인기도 시스템

사용자가 파티 후 평가를 작성하고, 시스템이 인기도를 계산하여 표시하는 평가 및 인기도 시스템을 구축합니다.

### Story 5.1: 평가 데이터 모델 및 스키마 설계

As a developer,
I want to create the evaluation database schema,
So that party evaluations can be stored and managed.

**Acceptance Criteria:**

**Given** Drizzle ORM is configured
**When** the evaluation schema is created in `lib/db/schema/evaluations.ts`
**Then** an evaluations table includes fields (evaluator_id, evaluatee_id, party_id, 매너_점수, 참여도_점수, 분위기_기여_점수, 코멘트, created_at)
**And** a reviews table includes fields (reviewer_id, party_id, host_id, 리뷰_내용, 공개_설정, created_at)
**And** relationships are defined with users and parties tables using Drizzle relations
**And** unique constraint ensures one evaluation per evaluator-evaluatee-party combination
**And** the schema is type-safe with TypeScript
**And** database migrations are created and can be run

### Story 5.2: 파티 후 평가 작성 기능

As a user,
I want to write an evaluation for other participants after a party,
So that I can provide feedback about their participation.

**Acceptance Criteria:**

**Given** a logged-in user who participated in a completed party
**When** the user navigates to the evaluation page (`/evaluations/new?partyId=[id]`)
**Then** a form is displayed with evaluation fields (매너, 참여도, 분위기 기여, 코멘트)
**And** the form uses React Hook Form with Zod validation
**And** score fields accept values 1-5 (or appropriate range)
**And** when submitted via Server Action, the evaluation is saved to the database
**And** users can only evaluate other participants (not themselves)
**And** users can only evaluate participants from parties they attended
**And** duplicate evaluations are prevented (same evaluator-evaluatee-party)
**And** validation ensures all required fields are filled
**And** appropriate error messages are shown for invalid input

### Story 5.3: 인기도 계산 로직 구현

As a system,
I want to calculate user popularity based on evaluations,
So that users' trustworthiness can be quantified.

**Acceptance Criteria:**

**Given** evaluations exist in the database
**When** a new evaluation is created or updated
**Then** the system calculates the user's average evaluation score across all evaluations
**And** the popularity rating is determined based on average score (높음: 4.0+, 보통: 2.5-3.9, 낮음: <2.5)
**And** the popularity is stored in the users table (popularity_score, popularity_rating fields)
**And** the calculation is performed efficiently (within 200ms, NFR6)
**And** the calculation handles edge cases (no evaluations → default "보통", single evaluation → use that score)
**And** the calculation service is located in `lib/services/popularity/calculate.ts`
**And** the calculation is triggered automatically when evaluations are created/updated

### Story 5.4: 인기도 표시 및 조회

As a user,
I want to view popularity ratings for myself and other users,
So that I can understand trust levels in the community.

**Acceptance Criteria:**

**Given** popularity ratings are calculated and stored
**When** a user views their own profile
**Then** their popularity rating is displayed with the rating level (높음, 보통, 낮음)
**And** when viewing other users' profiles, their popularity is displayed
**And** the popularity is displayed on party participant lists
**And** the display uses visual indicators (badges, colors) for clarity
**And** the popularity information is accessible via API endpoint `/api/popularity/[userId]`
**And** the popularity display is responsive and mobile-friendly
**And** users can view their popularity history (if implemented in future)

### Story 5.5: 인기도 기준 설정 및 필터링

As a party host,
I want to set popularity criteria for my party,
So that I can filter participants based on trust levels.

**Acceptance Criteria:**

**Given** a logged-in party host creating or editing a party
**When** the host sets popularity criteria (minimum popularity level)
**Then** the criteria is saved in the party record (min_popularity_rating field)
**And** when participants apply, the system automatically filters based on criteria
**And** participants below the criteria see an appropriate message ("인기도 기준을 충족하지 않습니다")
**And** the host can view filtered participant lists showing only eligible applicants
**And** the criteria can be updated for existing parties
**And** the filtering logic is implemented in the participation application process
**And** the criteria setting UI is clear and user-friendly

### Story 5.6: 파티 및 주최자 리뷰 작성

As a user,
I want to write reviews for parties and hosts,
So that I can share my experience with others.

**Acceptance Criteria:**

**Given** a logged-in user who participated in a completed party
**When** the user writes a review
**Then** the user can write a review for the party (party_id)
**And** the user can write a review for the party host (host_id)
**And** reviews can be set as public or private (공개_설정 field)
**And** reviews are saved to the database via Server Action
**And** users can only review parties they participated in (authorization check)
**And** duplicate reviews are prevented (one review per user per party/host)
**And** the review form uses React Hook Form with Zod validation
**And** appropriate error messages are shown for invalid input

### Story 5.7: 리뷰 조회 및 관리

As a user,
I want to view and manage reviews,
So that I can see feedback about parties and hosts.

**Acceptance Criteria:**

**Given** reviews exist in the database
**When** a user views a party detail page
**Then** public reviews for that party are displayed
**And** public reviews for the host are displayed
**And** users can view their own reviews (public and private) on their profile
**And** users can change the public/private setting of their reviews
**And** reviews are displayed in a user-friendly format (reviewer name, date, content)
**And** the review display uses Server Components for data fetching
**And** the review list is paginated for performance
**And** empty states are shown when no reviews exist

### Story 5.8: 평가 이력 및 통계 조회

As a user,
I want to view my evaluation history and statistics,
So that I can track my feedback and reputation.

**Acceptance Criteria:**

**Given** a logged-in user
**When** the user views their evaluation history page (`/evaluations`)
**Then** they can see evaluations they received (받은 평가 목록)
**And** they can see evaluations they wrote (작성한 평가 목록)
**And** evaluation statistics are displayed (평균 점수, 총 평가 수, 인기도 등급)
**And** the evaluation history is paginated for performance
**And** the data is fetched using Server Components
**And** the statistics are calculated and displayed clearly
**And** users can filter evaluations by party or date
**And** the page is responsive and mobile-friendly

## Epic 6: 관리자 기능

관리자가 커뮤니티를 모니터링하고 관리할 수 있는 관리자 대시보드 및 관리 기능을 제공합니다.

### Story 6.1: 관리자 대시보드 기본 구조

As an admin,
I want to access an admin dashboard,
So that I can manage and monitor the community.

**Acceptance Criteria:**

**Given** a logged-in user with 관리자 role
**When** the user navigates to `/admin`
**Then** an admin dashboard is displayed with navigation menu
**And** the dashboard shows key metrics and overview sections
**And** only 관리자 users can access the dashboard (RBAC check via Next.js Middleware)
**And** unauthorized users are redirected with appropriate error message
**And** the dashboard layout is responsive and mobile-friendly
**And** the dashboard uses Server Components for data fetching

### Story 6.2: 커뮤니티 품질 지표 모니터링

As an admin,
I want to monitor community quality metrics,
So that I can track the health of the platform.

**Acceptance Criteria:**

**Given** a logged-in admin viewing the dashboard
**When** the admin views quality metrics section
**Then** key metrics are displayed (total users, active parties, average popularity, evaluation count, report count)
**And** metrics are calculated from the database using efficient queries
**And** metrics are updated on page load (Server Components)
**And** the metrics are displayed in a clear, visual format (cards, charts if applicable)
**And** the data fetching uses Server Components for performance
**And** metrics are calculated within 500ms (NFR2)

### Story 6.3: 신고된 평가 검토

As an admin,
I want to review reported evaluations,
So that I can identify and address problematic content.

**Acceptance Criteria:**

**Given** evaluations exist that have been reported (reports table with evaluation_id, reporter_id, reason)
**When** an admin views the reported evaluations section (`/admin/evaluations`)
**Then** all reported evaluations are displayed with context (evaluation content, reporter, reason)
**And** the admin can view the full evaluation details
**And** the admin can see the reporter information
**And** the admin can take action (approve report, reject report, delete evaluation)
**And** actions are logged in the database for audit purposes
**And** only 관리자 users can access this section
**And** the report status is updated after action is taken

### Story 6.4: 악의적 평가 패턴 탐지

As an admin,
I want to detect malicious evaluation patterns,
So that I can identify users who abuse the system.

**Acceptance Criteria:**

**Given** evaluation data exists in the database
**When** an admin views the pattern detection section (`/admin/pattern-detection`)
**Then** suspicious patterns are identified (e.g., multiple negative evaluations from same user, coordinated attacks, unusual patterns)
**And** flagged patterns are displayed with evidence and statistics
**And** the admin can review and take action on flagged patterns
**And** detection algorithms are implemented in `lib/services/admin/pattern-detection.ts`
**And** the detection runs on-demand when admin requests it
**And** detection results are cached for performance
**And** only 관리자 users can access this section

### Story 6.5: 평가 제재 조치

As an admin,
I want to take disciplinary actions on evaluations,
So that I can maintain community quality.

**Acceptance Criteria:**

**Given** an admin is reviewing problematic evaluations
**When** the admin takes disciplinary action
**Then** actions can include: delete evaluation, warn user, suspend user account
**And** the action is recorded in the database (action_log table)
**And** the affected user is notified via UI update (future: notification system)
**And** action history is maintained for audit purposes
**And** only 관리자 users can take these actions
**And** confirmation dialogs are shown for destructive actions
**And** appropriate error messages are shown for invalid actions

### Story 6.6: 사용자 신고 처리

As an admin,
I want to process user reports,
So that I can address community concerns.

**Acceptance Criteria:**

**Given** user reports exist in the system (reports table with reporter_id, reported_user_id, reason, evidence)
**When** an admin views the reports section (`/admin/reports`)
**Then** all pending reports are displayed with details
**And** the admin can view report details (reporter, reported user, reason, evidence, timestamp)
**And** the admin can take action (dismiss report, warn user, suspend user)
**And** actions are logged and tracked in the database
**And** the reporter can see the status of their report (future enhancement)
**And** only 관리자 users can process reports
**And** report status is updated after action is taken

### Story 6.7: 커뮤니티 가이드라인 관리

As an admin,
I want to manage community guidelines,
So that users know the rules and expectations.

**Acceptance Criteria:**

**Given** a logged-in admin
**When** the admin views the guidelines management section (`/admin/guidelines`)
**Then** the admin can view current guidelines
**And** the admin can create, edit, or delete guidelines
**And** guidelines are stored in the database (guidelines table)
**And** guidelines are displayed to users (on signup page, in help section)
**And** changes are logged for audit purposes
**And** only 관리자 users can manage guidelines
**And** the guidelines management UI is user-friendly

### Story 6.8: 분석 리포트 생성

As an admin,
I want to generate analytical reports,
So that I can understand platform usage and trends.

**Acceptance Criteria:**

**Given** a logged-in admin
**When** the admin requests a report (`/admin/reports/generate`)
**Then** the admin can select report type (user activity, party statistics, evaluation trends, popularity distribution)
**And** the admin can select date range for the report
**And** the report is generated from database queries
**And** the report is displayed in a readable format (tables, summary statistics)
**And** report generation completes within reasonable time (within 5 seconds)
**And** the report data is accurate and reflects current database state
**And** only 관리자 users can generate reports
**And** reports can be viewed on the dashboard (future: export to CSV/PDF)

