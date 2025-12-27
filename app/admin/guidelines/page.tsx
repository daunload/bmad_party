import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAllGuidelines } from '@/lib/db/admin';
import { GuidelinesManager } from '@/components/features/admin/GuidelinesManager';

export default async function GuidelinesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== '관리자') {
    redirect('/unauthorized');
  }

  const guidelines = await getAllGuidelines();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">커뮤니티 가이드라인 관리</h1>
            <p className="mt-1 text-sm text-gray-600">커뮤니티 규칙 및 가이드라인을 관리합니다</p>
          </div>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
            ← 대시보드로 돌아가기
          </Link>
        </div>

        <GuidelinesManager guidelines={guidelines} />
      </div>
    </div>
  );
}

