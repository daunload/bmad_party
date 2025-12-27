import { db } from '@/lib/db/db';
import { evaluations } from '@/lib/db/schema/evaluations';
import { users } from '@/lib/db/schema/users';
import { eq, and, count, sql, lt } from 'drizzle-orm';

export interface SuspiciousPattern {
  type: 'multiple_negative' | 'coordinated_attack' | 'unusual_pattern';
  userId?: number;
  description: string;
  evidence: any;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Detect suspicious evaluation patterns
 */
export async function detectSuspiciousPatterns(): Promise<SuspiciousPattern[]> {
  const patterns: SuspiciousPattern[] = [];

  // Pattern 1: Multiple negative evaluations from same user
  const negativeEvaluators = await db
    .select({
      evaluatorId: evaluations.evaluatorId,
      count: count(),
      avgScore: sql<number>`AVG((${evaluations.mannerScore} + ${evaluations.participationScore} + ${evaluations.atmosphereScore}) / 3.0)`,
    })
    .from(evaluations)
    .groupBy(evaluations.evaluatorId)
    .having(sql`COUNT(*) >= 5 AND AVG((${evaluations.mannerScore} + ${evaluations.participationScore} + ${evaluations.atmosphereScore}) / 3.0) < 2.0`);

  for (const evaluator of negativeEvaluators) {
    patterns.push({
      type: 'multiple_negative',
      userId: evaluator.evaluatorId,
      description: `사용자가 ${evaluator.count}개의 평가를 작성했으며, 평균 점수가 ${evaluator.avgScore.toFixed(2)}점입니다.`,
      evidence: {
        evaluatorId: evaluator.evaluatorId,
        evaluationCount: evaluator.count,
        averageScore: evaluator.avgScore,
      },
      severity: evaluator.count >= 10 ? 'high' : 'medium',
    });
  }

  // Pattern 2: Coordinated attacks (multiple users evaluating same person negatively)
  const coordinatedTargets = await db
    .select({
      evaluateeId: evaluations.evaluateeId,
      count: count(),
      avgScore: sql<number>`AVG((${evaluations.mannerScore} + ${evaluations.participationScore} + ${evaluations.atmosphereScore}) / 3.0)`,
    })
    .from(evaluations)
    .groupBy(evaluations.evaluateeId)
    .having(sql`COUNT(*) >= 3 AND AVG((${evaluations.mannerScore} + ${evaluations.participationScore} + ${evaluations.atmosphereScore}) / 3.0) < 2.0`);

  for (const target of coordinatedTargets) {
    patterns.push({
      type: 'coordinated_attack',
      userId: target.evaluateeId,
      description: `${target.count}명의 사용자가 동일한 사용자에게 낮은 점수를 주었습니다. (평균: ${target.avgScore.toFixed(2)}점)`,
      evidence: {
        evaluateeId: target.evaluateeId,
        evaluationCount: target.count,
        averageScore: target.avgScore,
      },
      severity: target.count >= 5 ? 'high' : 'medium',
    });
  }

  // Pattern 3: Unusual patterns (very low scores in short time)
  const recentLowScores = await db
    .select({
      evaluatorId: evaluations.evaluatorId,
      count: count(),
    })
    .from(evaluations)
    .where(
      and(
        sql`(${evaluations.mannerScore} + ${evaluations.participationScore} + ${evaluations.atmosphereScore}) / 3.0 < 2.0`,
        sql`${evaluations.createdAt} > NOW() - INTERVAL '7 days'`
      )
    )
    .groupBy(evaluations.evaluatorId)
    .having(sql`COUNT(*) >= 3`);

  for (const evaluator of recentLowScores) {
    patterns.push({
      type: 'unusual_pattern',
      userId: evaluator.evaluatorId,
      description: `최근 7일 내에 ${evaluator.count}개의 낮은 점수 평가를 작성했습니다.`,
      evidence: {
        evaluatorId: evaluator.evaluatorId,
        recentLowScoreCount: evaluator.count,
      },
      severity: evaluator.count >= 5 ? 'high' : 'low',
    });
  }

  return patterns;
}

