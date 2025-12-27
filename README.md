# Party - 파티 커뮤니티 플랫폼

파티를 구하는 커뮤니티 앱입니다. 사용자들이 파티를 생성하고 참여하며, 평가 시스템을 통해 신뢰할 수 있는 커뮤니티를 구축합니다.

## 기술 스택

- **Framework**: [Next.js](https://nextjs.org/) 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Deploy Your Own

You can clone & deploy it to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=Next.js%20Prisma%20PostgreSQL%20Auth%20Starter&demo-description=Simple%20Next.js%2013%20starter%20kit%20that%20uses%20Next-Auth%20for%20auth%20and%20Prisma%20PostgreSQL%20as%20a%20database.&demo-url=https%3A%2F%2Fnextjs-postgres-auth.vercel.app%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F7rsVQ1ZBSiWe9JGO6FUeZZ%2F210cba91036ca912b2770e0bd5d6cc5d%2Fthumbnail.png&project-name=Next.js%%20Prisma%20PostgreSQL%20Auth%20Starter&repository-name=nextjs-postgres-auth-starter&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnextjs-postgres-auth-starter&from=templates&skippable-integrations=1&env=AUTH_SECRET&envDescription=Generate%20a%20random%20secret%3A&envLink=https://generate-secret.vercel.app/&stores=%5B%7B"type"%3A"postgres"%7D%5D)

## Developing Locally

You can clone & create this repo with the following command

```bash
npx create-next-app nextjs-typescript-starter --example "https://github.com/vercel/nextjs-postgres-auth-starter"
```

## 빠른 시작

### Docker를 사용한 개발 환경 설정 (권장)

1. **Docker 환경 설정 스크립트 실행**:
   ```bash
   ./scripts/docker-setup.sh
   ```
   이 스크립트는 다음을 수행합니다:
   - `.env.local` 파일 생성 (없는 경우)
   - PostgreSQL Docker 컨테이너 시작
   - 데이터베이스 마이그레이션 실행 (선택사항)

2. **수동 설정**:
   ```bash
   # PostgreSQL 컨테이너 시작
   docker-compose -f docker-compose.dev.yml up -d
   
   # 환경 변수 설정 (.env.local 파일 생성)
   POSTGRES_URL=postgresql://party_user:party_password@localhost:5432/party_db?sslmode=disable
   AUTH_SECRET=$(openssl rand -base64 32)
   AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # 마이그레이션 실행
   npx tsx scripts/migrate-users-table.ts
   npx tsx scripts/migrate-parties-table.ts
   npx tsx scripts/migrate-party-participants-table.ts
   npx tsx scripts/migrate-evaluations-table.ts
   npx tsx scripts/migrate-admin-tables.ts
   ```

3. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

4. **브라우저에서 접속**:
   [http://localhost:3000](http://localhost:3000)

### Docker 없이 개발하기

PostgreSQL을 직접 설치하고 실행한 후, `.env.local` 파일에 연결 정보를 설정하세요.

자세한 Docker 사용법은 [README.docker.md](./README.docker.md)를 참조하세요.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
