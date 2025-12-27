'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { handleEvaluationAction } from '@/app/actions/admin';
import type { Report } from '@/lib/db/schema/admin';
import type { User } from '@/lib/db/schema/users';
import type { Evaluation } from '@/lib/db/schema/evaluations';

interface ReportedEvaluationsListProps {
  reports: Array<
    Report & {
      reporter: User;
      reportedUser: User | null;
      evaluation: Evaluation | null;
    }
  >;
}

export function ReportedEvaluationsList({ reports }: ReportedEvaluationsListProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(
    reportId: number,
    action: 'approve' | 'reject',
    evaluationId?: number
  ) {
    setIsPending(reportId);
    setError(null);

    const result = await handleEvaluationAction(reportId, action, evaluationId);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || '작업 처리에 실패했습니다.');
      setIsPending(null);
    }
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">대기 중인 신고가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}
      {reports.map((report) => (
        <div
          key={report.id}
          className="rounded-lg border border-gray-200 bg-white p-6"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2">
                <span className="text-xs font-medium text-gray-500">신고자:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {report.reporter.name || report.reporter.email}
                </span>
              </div>
              {report.reportedUser && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">신고 대상:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {report.reportedUser.name || report.reportedUser.email}
                  </span>
                </div>
              )}
              <div className="mb-2">
                <span className="text-xs font-medium text-gray-500">신고 사유:</span>
                <p className="mt-1 text-sm text-gray-700">{report.reason}</p>
              </div>
              {report.evidence && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">증거/상세:</span>
                  <p className="mt-1 text-sm text-gray-700">{report.evidence}</p>
                </div>
              )}
              {report.evaluation && (
                <div className="mt-4 rounded-md bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">평가 내용:</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>매너: {report.evaluation.mannerScore}/5</p>
                    <p>참여도: {report.evaluation.participationScore}/5</p>
                    <p>분위기: {report.evaluation.atmosphereScore}/5</p>
                    {report.evaluation.comment && (
                      <p className="mt-2 text-gray-700">{report.evaluation.comment}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className="ml-4 text-xs text-gray-500">
              {new Date(report.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleAction(report.id, 'approve', report.evaluationId || undefined)}
              disabled={isPending === report.id}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isPending === report.id ? '처리 중...' : '신고 승인'}
            </button>
            <button
              type="button"
              onClick={() => handleAction(report.id, 'reject')}
              disabled={isPending === report.id}
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              신고 거절
            </button>
            {report.evaluationId && (
              <button
                type="button"
                onClick={() => handleAction(report.id, 'approve', report.evaluationId || undefined)}
                disabled={isPending === report.id}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                평가 삭제
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

