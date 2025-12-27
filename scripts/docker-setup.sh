#!/bin/bash

# Docker 환경 설정 스크립트

set -e

echo "🚀 Party 프로젝트 Docker 환경 설정을 시작합니다..."

# Docker daemon 확인
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker daemon이 실행되지 않았습니다."
  echo "   Docker Desktop을 시작하거나 Docker daemon을 실행해주세요."
  echo ""
  echo "   macOS: Docker Desktop 앱을 실행하세요"
  echo "   Linux: sudo systemctl start docker"
  exit 1
fi

echo "✅ Docker daemon이 실행 중입니다."

# .env.local 파일 확인
if [ ! -f .env.local ]; then
  echo "📝 .env.local 파일이 없습니다. 생성합니다..."
  cat > .env.local << EOF
# Database
POSTGRES_URL=postgresql://party_user:party_password@localhost:5432/party_db?sslmode=disable

# NextAuth
AUTH_SECRET=$(openssl rand -base64 32)
AUTH_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
  echo "✅ .env.local 파일이 생성되었습니다."
else
  echo "✅ .env.local 파일이 이미 존재합니다."
fi

# PostgreSQL 컨테이너 시작
echo "🐘 PostgreSQL 컨테이너를 시작합니다..."
docker-compose -f docker-compose.dev.yml up -d

# 컨테이너가 준비될 때까지 대기
echo "⏳ PostgreSQL이 준비될 때까지 대기 중..."
sleep 5

# Health check
until docker exec party-postgres-dev pg_isready -U party_user -d party_db > /dev/null 2>&1; do
  echo "⏳ PostgreSQL이 준비될 때까지 대기 중..."
  sleep 2
done

echo "✅ PostgreSQL이 준비되었습니다!"

# 마이그레이션 실행 여부 확인
read -p "데이터베이스 마이그레이션을 실행하시겠습니까? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "📦 마이그레이션을 실행합니다..."
  
  echo "  - 사용자 테이블 마이그레이션..."
  npx tsx scripts/migrate-users-table.ts || echo "  ⚠️  사용자 테이블 마이그레이션 실패 (이미 존재할 수 있음)"
  
  echo "  - 파티 테이블 마이그레이션..."
  npx tsx scripts/migrate-parties-table.ts || echo "  ⚠️  파티 테이블 마이그레이션 실패 (이미 존재할 수 있음)"
  
  echo "  - 참여자 테이블 마이그레이션..."
  npx tsx scripts/migrate-party-participants-table.ts || echo "  ⚠️  참여자 테이블 마이그레이션 실패 (이미 존재할 수 있음)"
  
  echo "  - 평가 테이블 마이그레이션..."
  npx tsx scripts/migrate-evaluations-table.ts || echo "  ⚠️  평가 테이블 마이그레이션 실패 (이미 존재할 수 있음)"
  
  echo "  - 관리자 테이블 마이그레이션..."
  npx tsx scripts/migrate-admin-tables.ts || echo "  ⚠️  관리자 테이블 마이그레이션 실패 (이미 존재할 수 있음)"
  
  echo "✅ 마이그레이션이 완료되었습니다!"
fi

echo ""
echo "🎉 설정이 완료되었습니다!"
echo ""
echo "다음 단계:"
echo "  1. Next.js 개발 서버 실행: npm run dev"
echo "  2. 브라우저에서 http://localhost:3000 접속"
echo ""
echo "유용한 명령어:"
echo "  - 컨테이너 상태 확인: docker-compose -f docker-compose.dev.yml ps"
echo "  - 로그 확인: docker-compose -f docker-compose.dev.yml logs -f postgres"
echo "  - 컨테이너 중지: docker-compose -f docker-compose.dev.yml down"
echo ""

