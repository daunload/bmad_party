import { auth } from 'app/auth';
import { redirect } from 'next/navigation';
import { getEvaluationsReceived, getEvaluationsGiven } from '@/lib/db/evaluations';
import { getUserById } from '@/lib/db/users';
import { getPartyById } from '@/lib/db/parties';
import { EvaluationHistory } from '@/components/features/evaluation/EvaluationHistory';

export default async function EvaluationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userId = parseInt(session.user.id as string);

  // Get evaluations received and given
  const receivedEvaluations = await getEvaluationsReceived(userId);
  const givenEvaluations = await getEvaluationsGiven(userId);

  // Enrich with user and party info
  const receivedWithDetails = await Promise.all(
    receivedEvaluations.map(async (eval) => {
      const evaluator = await getUserById(eval.evaluatorId);
      const party = await getPartyById(eval.partyId);
      return {
        ...eval,
        evaluator: evaluator!,
        party: party!,
      };
    })
  );

  const givenWithDetails = await Promise.all(
    givenEvaluations.map(async (eval) => {
      const evaluatee = await getUserById(eval.evaluateeId);
      const party = await getPartyById(eval.partyId);
      return {
        ...eval,
        evaluatee: evaluatee!,
        party: party!,
      };
    })
  );

  // Calculate statistics
  const totalReceived = receivedEvaluations.length;
  const totalGiven = givenEvaluations.length;
  const avgScore =
    receivedEvaluations.length > 0
      ? receivedEvaluations.reduce(
          (sum, e) => sum + (e.mannerScore + e.participationScore + e.atmosphereScore) / 3,
          0
        ) / receivedEvaluations.length
      : 0;

  const user = await getUserById(userId);
  const popularityRating = (user as any)?.popularityRating || '보통';
  const popularityScore = (user as any)?.popularityScore
    ? parseFloat((user as any).popularityScore)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">평가 이력</h1>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">받은 평가</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{totalReceived}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">작성한 평가</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{totalGiven}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">평균 점수</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {avgScore > 0 ? avgScore.toFixed(2) : '-'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">인기도</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {popularityRating}
              {popularityScore !== null && (
                <span className="ml-1 text-sm text-gray-500">({popularityScore.toFixed(2)})</span>
              )}
            </p>
          </div>
        </div>

        {/* Evaluation History */}
        <EvaluationHistory
          receivedEvaluations={receivedWithDetails}
          givenEvaluations={givenWithDetails}
        />
      </div>
    </div>
  );
}

