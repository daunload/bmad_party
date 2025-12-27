import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/db';
import { evaluations } from '@/lib/db/schema/evaluations';
import { getPendingReports } from '@/lib/db/admin';
import { getUserById } from '@/lib/db/users';
import { ReportedEvaluationsList } from '@/components/features/admin/ReportedEvaluationsList';

export default async function AdminEvaluationsPage() {
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
      .filter((r) => r.evaluationId)
      .map(async (report) => {
        const reporter = await getUserById(report.reporterId);
        const reportedUser = report.reportedUserId
          ? await getUserById(report.reportedUserId)
          : null;
        // Get evaluation by ID if available
        const evaluation = report.evaluationId
          ? await db
              .select()
              .from(evaluations)
              .where(eq(evaluations.id, report.evaluationId))
              .limit(1)
              .then((r) => r[0] || null)
          : null;

        return {
          ...report,
          reporter: reporter!,
          reportedUser,
          evaluation,
        };
      })
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">신고된 평가 검토</h1>
            <p className="mt-1 text-sm text-gray-600">신고된 평가를 검토하고 조치를 취하세요</p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← 대시보드로 돌아가기
          </Link>
        </div>

        <ReportedEvaluationsList reports={reportsWithDetails} />
      </div>
    </div>
  );
}

