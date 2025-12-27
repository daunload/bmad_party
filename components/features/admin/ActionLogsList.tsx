import Link from 'next/link';
import type { ActionLog } from '@/lib/db/schema/admin';
import type { User } from '@/lib/db/schema/users';

interface ActionLogsListProps {
  logs: Array<
    ActionLog & {
      admin: User;
      targetUser: User | null;
    }
  >;
}

const actionTypeLabels: Record<string, string> = {
  delete_evaluation: '평가 삭제',
  warn_user: '사용자 경고',
  suspend_user: '계정 정지',
  dismiss_report: '신고 기각',
};

export function ActionLogsList({ logs }: ActionLogsListProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">작업 이력이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              날짜
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              관리자
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              작업 유형
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              대상
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              사유
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {new Date(log.createdAt).toLocaleString('ko-KR')}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                <Link
                  href={`/users/${log.admin.id}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {log.admin.name || log.admin.email}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {actionTypeLabels[log.actionType] || log.actionType}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {log.targetUser ? (
                  <Link
                    href={`/users/${log.targetUser.id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {log.targetUser.name || log.targetUser.email}
                  </Link>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{log.reason || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

