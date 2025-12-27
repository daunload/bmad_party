import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { generateAnalyticsReport } from '@/lib/services/admin/analytics';
import { AnalyticsReportViewer } from '@/components/features/admin/AnalyticsReportViewer';

interface GenerateReportPageProps {
  searchParams: Promise<{
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function GenerateReportPage({ searchParams }: GenerateReportPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== '관리자') {
    redirect('/unauthorized');
  }

  const params = await searchParams;
  const reportType = params.type || 'user_activity';
  const dateFrom = params.dateFrom;
  const dateTo = params.dateTo;

  const report = await generateAnalyticsReport(reportType, dateFrom, dateTo);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">분석 리포트 생성</h1>
            <p className="mt-1 text-sm text-gray-600">플랫폼 사용 통계 및 트렌드 분석</p>
          </div>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
            ← 대시보드로 돌아가기
          </Link>
        </div>

        <AnalyticsReportViewer report={report} />
      </div>
    </div>
  );
}

