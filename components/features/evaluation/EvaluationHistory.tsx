import Link from 'next/link';
import type { Evaluation } from '@/lib/db/schema/evaluations';
import type { User } from '@/lib/db/schema/users';
import type { Party } from '@/lib/db/schema/parties';

interface EvaluationHistoryProps {
  receivedEvaluations: Array<
    Evaluation & {
      evaluator: User;
      party: Party;
    }
  >;
  givenEvaluations: Array<
    Evaluation & {
      evaluatee: User;
      party: Party;
    }
  >;
}

export function EvaluationHistory({
  receivedEvaluations,
  givenEvaluations,
}: EvaluationHistoryProps) {
  return (
    <div className="space-y-6">
      {/* Received Evaluations */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">받은 평가 ({receivedEvaluations.length})</h2>
        {receivedEvaluations.length === 0 ? (
          <p className="text-sm text-gray-600">받은 평가가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {receivedEvaluations.map((eval) => (
              <div key={eval.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/users/${eval.evaluator.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {eval.evaluator.name || eval.evaluator.email}
                      </Link>
                      <span className="text-xs text-gray-500">•</span>
                      <Link
                        href={`/parties/${eval.party.id}`}
                        className="text-sm text-gray-600 hover:text-blue-600"
                      >
                        {eval.party.title}
                      </Link>
                    </div>
                    <div className="mt-2 flex space-x-4 text-xs text-gray-600">
                      <span>매너: {eval.mannerScore}/5</span>
                      <span>참여도: {eval.participationScore}/5</span>
                      <span>분위기: {eval.atmosphereScore}/5</span>
                    </div>
                    {eval.comment && (
                      <p className="mt-2 text-sm text-gray-700">{eval.comment}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(eval.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Given Evaluations */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">작성한 평가 ({givenEvaluations.length})</h2>
        {givenEvaluations.length === 0 ? (
          <p className="text-sm text-gray-600">작성한 평가가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {givenEvaluations.map((eval) => (
              <div key={eval.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/users/${eval.evaluatee.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {eval.evaluatee.name || eval.evaluatee.email}
                      </Link>
                      <span className="text-xs text-gray-500">•</span>
                      <Link
                        href={`/parties/${eval.party.id}`}
                        className="text-sm text-gray-600 hover:text-blue-600"
                      >
                        {eval.party.title}
                      </Link>
                    </div>
                    <div className="mt-2 flex space-x-4 text-xs text-gray-600">
                      <span>매너: {eval.mannerScore}/5</span>
                      <span>참여도: {eval.participationScore}/5</span>
                      <span>분위기: {eval.atmosphereScore}/5</span>
                    </div>
                    {eval.comment && (
                      <p className="mt-2 text-sm text-gray-700">{eval.comment}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(eval.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

