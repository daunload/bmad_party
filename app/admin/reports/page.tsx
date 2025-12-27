import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getPendingReports } from '@/lib/db/admin';
import { getUserById } from '@/lib/db/users';
import { UserReportsList } from '@/components/features/admin/UserReportsList';

export default async function UserReportsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== '관리자') {
    redirect('/unauthorized');
  }

  const reports = await getPendingReports();
  const reportsWithDetails = await Promise.all(
    reports
      .filter((r) => r.reportType === 'user')
      .map(async (report) => {
        const reporter = await getUserById(report.reporterId);
        const reportedUser = report.reportedUserId
          ? await getUserById(report.reportedUserId)
          : null;

        return {
          ...report,
          reporter: reporter!,
          reportedUser,
        };
      })
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">사용자 신고 처리</h1>
            <p className="mt-1 text-sm text-gray-600">사용자 신고를 검토하고 조치를 취하세요</p>
          </div>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
            ← 대시보드로 돌아가기
          </Link>
        </div>

        <UserReportsList reports={reportsWithDetails} />
      </div>
    </div>
  );
}

