import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCommunityMetrics } from '@/lib/db/admin';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== '관리자') {
    redirect('/unauthorized');
  }

  const metrics = await getCommunityMetrics();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="mt-2 text-gray-600">커뮤니티 관리 및 모니터링</p>
        </div>

        {/* Navigation */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link
            href="/admin/evaluations"
            className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:bg-gray-50"
          >
            <p className="text-sm font-medium text-gray-900">신고된 평가</p>
            <p className="mt-1 text-xs text-gray-500">검토 및 처리</p>
          </Link>
          <Link
            href="/admin/pattern-detection"
            className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:bg-gray-50"
          >
            <p className="text-sm font-medium text-gray-900">패턴 탐지</p>
            <p className="mt-1 text-xs text-gray-500">악의적 패턴 분석</p>
          </Link>
          <Link
            href="/admin/reports"
            className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:bg-gray-50"
          >
            <p className="text-sm font-medium text-gray-900">사용자 신고</p>
            <p className="mt-1 text-xs text-gray-500">신고 처리</p>
          </Link>
          <Link
            href="/admin/guidelines"
            className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:bg-gray-50"
          >
            <p className="text-sm font-medium text-gray-900">가이드라인</p>
            <p className="mt-1 text-xs text-gray-500">관리</p>
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-600">전체 사용자</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.totalUsers}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-600">활성 파티</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.activeParties}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-600">평균 인기도</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {metrics.averagePopularity.toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-600">평가 수</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.evaluationCount}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-600">대기 중인 신고</p>
            <p className="mt-2 text-3xl font-bold text-red-600">{metrics.pendingReports}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">빠른 작업</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/reports/generate"
              className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
            >
              <p className="text-sm font-medium text-gray-900">분석 리포트 생성</p>
              <p className="mt-1 text-xs text-gray-500">플랫폼 사용 통계 및 트렌드 분석</p>
            </Link>
            <Link
              href="/admin/action-logs"
              className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
            >
              <p className="text-sm font-medium text-gray-900">작업 이력</p>
              <p className="mt-1 text-xs text-gray-500">관리자 작업 로그 조회</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
