import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getActionLogs } from '@/lib/db/admin';
import { getUserById } from '@/lib/db/users';
import { ActionLogsList } from '@/components/features/admin/ActionLogsList';

export default async function ActionLogsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== '관리자') {
    redirect('/unauthorized');
  }

  const logs = await getActionLogs(100);
  const logsWithDetails = await Promise.all(
    logs.map(async (log) => {
      const admin = await getUserById(log.adminId);
      const targetUser = log.targetUserId ? await getUserById(log.targetUserId) : null;
      return {
        ...log,
        admin: admin!,
        targetUser,
      };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">작업 이력</h1>
            <p className="mt-1 text-sm text-gray-600">관리자 작업 로그를 조회합니다</p>
          </div>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
            ← 대시보드로 돌아가기
          </Link>
        </div>

        <ActionLogsList logs={logsWithDetails} />
      </div>
    </div>
  );
}

