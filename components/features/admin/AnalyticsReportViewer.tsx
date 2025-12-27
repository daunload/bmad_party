'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { AnalyticsReport } from '@/lib/services/admin/analytics';

interface AnalyticsReportViewerProps {
  report: AnalyticsReport;
}

const REPORT_TYPES = [
  { value: 'user_activity', label: '사용자 활동' },
  { value: 'party_statistics', label: '파티 통계' },
  { value: 'evaluation_trends', label: '평가 트렌드' },
  { value: 'popularity_distribution', label: '인기도 분포' },
];

export function AnalyticsReportViewer({ report: initialReport }: AnalyticsReportViewerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [reportType, setReportType] = useState(initialReport.type);
  const [dateFrom, setDateFrom] = useState(initialReport.dateRange?.from || '');
  const [dateTo, setDateTo] = useState(initialReport.dateRange?.to || '');

  function handleGenerate() {
    startTransition(() => {
      const params = new URLSearchParams();
      params.set('type', reportType);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      router.push(`/admin/reports/generate?${params.toString()}`);
    });
  }

  return (
    <div className="space-y-6">
      {/* Report Generator */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">리포트 생성</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
              리포트 유형
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              {REPORT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                시작 날짜
              </label>
              <input
                type="date"
                id="dateFrom"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
                종료 날짜
              </label>
              <input
                type="date"
                id="dateTo"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? '생성 중...' : '리포트 생성'}
          </button>
        </div>
      </div>

      {/* Report Summary */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">요약</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {report.summary.totalUsers !== undefined && (
            <div>
              <p className="text-sm text-gray-600">전체 사용자</p>
              <p className="text-2xl font-bold text-gray-900">{report.summary.totalUsers}</p>
            </div>
          )}
          {report.summary.activeParties !== undefined && (
            <div>
              <p className="text-sm text-gray-600">활성 파티</p>
              <p className="text-2xl font-bold text-gray-900">{report.summary.activeParties}</p>
            </div>
          )}
          {report.summary.totalEvaluations !== undefined && (
            <div>
              <p className="text-sm text-gray-600">평가 수</p>
              <p className="text-2xl font-bold text-gray-900">{report.summary.totalEvaluations}</p>
            </div>
          )}
          {report.summary.averagePopularity !== undefined && (
            <div>
              <p className="text-sm text-gray-600">평균 인기도</p>
              <p className="text-2xl font-bold text-gray-900">
                {report.summary.averagePopularity.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trends */}
      {report.trends && report.trends.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">트렌드</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    기간
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    값
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {report.trends.map((trend: any, index: number) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {trend.month || trend.date}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {trend.count !== undefined
                        ? trend.count
                        : trend.avgScore !== undefined
                          ? trend.avgScore.toFixed(2)
                          : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Distribution */}
      {report.distribution && report.distribution.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">분포</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    항목
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    수량
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {report.distribution.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {item.category || item.rating || '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

