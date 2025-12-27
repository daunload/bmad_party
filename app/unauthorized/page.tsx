import Link from 'next/link';
import { Suspense } from 'react';

interface UnauthorizedPageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const { message } = await searchParams;
  const errorMessage = message || '이 페이지에 접근할 권한이 없습니다.';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">403</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">접근 권한 없음</h2>
        <p className="mt-2 text-gray-500">{errorMessage}</p>
        <div className="mt-6 space-x-4">
          <Link
            href="/dashboard"
            className="inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            대시보드로 돌아가기
          </Link>
          <Link
            href="/"
            className="inline-block rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

