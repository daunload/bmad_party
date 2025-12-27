# Docker 설정 가이드

이 프로젝트는 Docker를 사용하여 PostgreSQL 데이터베이스를 실행할 수 있습니다.

## 개발 환경 설정

### 1. PostgreSQL만 Docker로 실행 (권장)

개발 환경에서는 Next.js는 로컬에서 실행하고 PostgreSQL만 Docker로 실행하는 것을 권장합니다.

```bash
# PostgreSQL 컨테이너 시작
docker-compose -f docker-compose.dev.yml up -d

# 컨테이너 상태 확인
docker-compose -f docker-compose.dev.yml ps

# 로그 확인
docker-compose -f docker-compose.dev.yml logs -f postgres

# 컨테이너 중지
docker-compose -f docker-compose.dev.yml down

# 데이터까지 삭제하고 중지
docker-compose -f docker-compose.dev.yml down -v
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
POSTGRES_URL=postgresql://party_user:party_password@localhost:5432/party_db?sslmode=disable
AUTH_SECRET=your-secret-key-here
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

AUTH_SECRET 생성:
```bash
openssl rand -base64 32
```

### 3. 데이터베이스 마이그레이션 실행

PostgreSQL 컨테이너가 실행된 후, 마이그레이션 스크립트를 실행하세요:

```bash
# 사용자 테이블 마이그레이션
npx tsx scripts/migrate-users-table.ts

# 파티 테이블 마이그레이션
npx tsx scripts/migrate-parties-table.ts

# 참여자 테이블 마이그레이션
npx tsx scripts/migrate-party-participants-table.ts

# 평가 테이블 마이그레이션
npx tsx scripts/migrate-evaluations-table.ts

# 관리자 테이블 마이그레이션
npx tsx scripts/migrate-admin-tables.ts
```

### 4. Next.js 개발 서버 실행

```bash
npm run dev
```

## 프로덕션 환경 설정

### 전체 스택 실행 (PostgreSQL + Next.js)

```bash
# 환경 변수 파일 생성
cp .env.local.example .env.production

# .env.production 파일 편집하여 실제 값 입력

# 전체 스택 시작
docker-compose -f docker-compose.prod.yml up -d

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f

# 중지
docker-compose -f docker-compose.prod.yml down
```

## 유용한 Docker 명령어

### 데이터베이스 접속

```bash
# PostgreSQL 컨테이너에 접속
docker exec -it party-postgres-dev psql -U party_user -d party_db

# 또는 직접 psql 클라이언트 사용
psql postgresql://party_user:party_password@localhost:5432/party_db
```

### 데이터베이스 백업

```bash
# 백업
docker exec party-postgres-dev pg_dump -U party_user party_db > backup.sql

# 복원
docker exec -i party-postgres-dev psql -U party_user party_db < backup.sql
```

### 볼륨 관리

```bash
# 볼륨 목록 확인
docker volume ls

# 볼륨 상세 정보
docker volume inspect party_postgres_dev_data

# 볼륨 삭제 (주의: 모든 데이터가 삭제됩니다)
docker volume rm party_postgres_dev_data
```

## 문제 해결

### 포트 충돌

PostgreSQL 기본 포트(5432)가 이미 사용 중인 경우:

```yaml
# docker-compose.dev.yml에서 포트 변경
ports:
  - '5433:5432'  # 호스트의 5433 포트를 컨테이너의 5432 포트로 매핑
```

그리고 `.env.local`의 `POSTGRES_URL`도 변경:
```env
POSTGRES_URL=postgresql://party_user:party_password@localhost:5433/party_db?sslmode=disable
```

### 컨테이너 재시작

```bash
# 컨테이너 재시작
docker-compose -f docker-compose.dev.yml restart postgres

# 컨테이너 재생성
docker-compose -f docker-compose.dev.yml up -d --force-recreate postgres
```

### 데이터 초기화

```bash
# 컨테이너와 볼륨 모두 삭제
docker-compose -f docker-compose.dev.yml down -v

# 다시 시작
docker-compose -f docker-compose.dev.yml up -d
```

## 보안 주의사항

⚠️ **중요**: 프로덕션 환경에서는 반드시 다음을 변경하세요:

1. 기본 사용자명/비밀번호 변경
2. 강력한 AUTH_SECRET 사용
3. SSL/TLS 연결 활성화 (`sslmode=require`)
4. 방화벽 설정으로 데이터베이스 포트 제한
5. 환경 변수를 안전하게 관리 (Secrets Manager 사용)

