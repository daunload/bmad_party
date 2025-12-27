import { db } from '@/lib/db/db';
import { evaluations } from '@/lib/db/schema/evaluations';
import { users } from '@/lib/db/schema/users';
import { eq, and, avg, sql } from 'drizzle-orm';

export interface PopularityResult {
  score: number;
  rating: '높음' | '보통' | '낮음';
}

/**
 * Calculate user popularity based on evaluations
 * 높음: 4.0+, 보통: 2.5-3.9, 낮음: <2.5
 */
export async function calculatePopularity(userId: number): Promise<PopularityResult> {
  const startTime = Date.now();

  // Get average scores for all evaluations received by this user
  const result = await db
    .select({
      avgManner: avg(evaluations.mannerScore),
      avgParticipation: avg(evaluations.participationScore),
      avgAtmosphere: avg(evaluations.atmosphereScore),
    })
    .from(evaluations)
    .where(eq(evaluations.evaluateeId, userId));

  const avgManner = result[0]?.avgManner ? parseFloat(result[0].avgManner) : null;
  const avgParticipation = result[0]?.avgParticipation
    ? parseFloat(result[0].avgParticipation)
    : null;
  const avgAtmosphere = result[0]?.avgAtmosphere ? parseFloat(result[0].avgAtmosphere) : null;

  // Calculate overall average
  let overallScore = 0;
  if (avgManner !== null && avgParticipation !== null && avgAtmosphere !== null) {
    overallScore = (avgManner + avgParticipation + avgAtmosphere) / 3;
  } else {
    // Default to "보통" (3.0) if no evaluations
    overallScore = 3.0;
  }

  // Determine rating
  let rating: '높음' | '보통' | '낮음';
  if (overallScore >= 4.0) {
    rating = '높음';
  } else if (overallScore >= 2.5) {
    rating = '보통';
  } else {
    rating = '낮음';
  }

  const responseTime = Date.now() - startTime;
  if (responseTime > 200) {
    console.warn(`Popularity calculation took ${responseTime}ms (exceeds 200ms threshold)`);
  }

  return {
    score: Math.round(overallScore * 100) / 100, // Round to 2 decimal places
    rating,
  };
}

/**
 * Update user's popularity in the database
 */
export async function updateUserPopularity(userId: number): Promise<void> {
  const { score, rating } = await calculatePopularity(userId);

  await db
    .update(users)
    .set({
      popularityScore: score.toString(),
      popularityRating: rating,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

