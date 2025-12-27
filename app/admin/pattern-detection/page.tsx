import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { detectSuspiciousPatterns } from '@/lib/services/admin/pattern-detection';
import { SuspiciousPatternsList } from '@/components/features/admin/SuspiciousPatternsList';

export default async function PatternDetectionPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== '관리자') {
    redirect('/unauthorized');
  }

  const patterns = await detectSuspiciousPatterns();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">악의적 평가 패턴 탐지</h1>
            <p className="mt-1 text-sm text-gray-600">의심스러운 평가 패턴을 탐지하고 분석합니다</p>
          </div>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
            ← 대시보드로 돌아가기
          </Link>
        </div>

        <SuspiciousPatternsList patterns={patterns} />
      </div>
    </div>
  );
}

