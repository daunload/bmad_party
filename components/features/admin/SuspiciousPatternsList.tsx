import Link from 'next/link';
import type { SuspiciousPattern } from '@/lib/services/admin/pattern-detection';

interface SuspiciousPatternsListProps {
  patterns: SuspiciousPattern[];
}

const severityColors = {
  low: 'bg-yellow-100 text-yellow-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
};

export function SuspiciousPatternsList({ patterns }: SuspiciousPatternsListProps) {
  if (patterns.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">의심스러운 패턴이 발견되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {patterns.map((pattern, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-6"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center space-x-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${severityColors[pattern.severity]}`}
                >
                  {pattern.severity === 'high' ? '높음' : pattern.severity === 'medium' ? '중간' : '낮음'}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {pattern.type === 'multiple_negative'
                    ? '다수의 부정적 평가'
                    : pattern.type === 'coordinated_attack'
                      ? '조정된 공격'
                      : '비정상적 패턴'}
                </span>
              </div>
              <p className="mb-2 text-sm text-gray-700">{pattern.description}</p>
              {pattern.userId && (
                <Link
                  href={`/users/${pattern.userId}`}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  사용자 프로필 보기 →
                </Link>
              )}
            </div>
          </div>
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500">증거 데이터:</p>
            <pre className="mt-1 text-xs text-gray-700">
              {JSON.stringify(pattern.evidence, null, 2)}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}

