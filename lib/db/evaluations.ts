import { eq, and } from 'drizzle-orm';
import { db } from './db';
import { evaluations, reviews, type Evaluation, type NewEvaluation, type Review, type NewReview } from './schema/evaluations';
import { updateUserPopularity } from '@/lib/services/popularity/calculate';

export async function createEvaluation(data: NewEvaluation): Promise<Evaluation> {
  const result = await db.insert(evaluations).values(data).returning();
  
  // Update evaluatee's popularity
  await updateUserPopularity(data.evaluateeId);
  
  return result[0];
}

export async function getEvaluation(
  evaluatorId: number,
  evaluateeId: number,
  partyId: number
): Promise<Evaluation | null> {
  const result = await db
    .select()
    .from(evaluations)
    .where(
      and(
        eq(evaluations.evaluatorId, evaluatorId),
        eq(evaluations.evaluateeId, evaluateeId),
        eq(evaluations.partyId, partyId)
      )
    )
    .limit(1);
  return result[0] || null;
}

export async function getEvaluationsReceived(userId: number): Promise<Evaluation[]> {
  return await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.evaluateeId, userId))
    .orderBy(evaluations.createdAt);
}

export async function getEvaluationsGiven(userId: number): Promise<Evaluation[]> {
  return await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.evaluatorId, userId))
    .orderBy(evaluations.createdAt);
}

export async function createReview(data: NewReview): Promise<Review> {
  const result = await db.insert(reviews).values(data).returning();
  return result[0];
}

export async function getPartyReviews(partyId: number, includePrivate: boolean = false) {
  const whereConditions: any[] = [eq(reviews.partyId, partyId)];
  
  if (!includePrivate) {
    whereConditions.push(eq(reviews.isPublic, true));
  }
  
  return await db
    .select()
    .from(reviews)
    .where(and(...whereConditions))
    .orderBy(reviews.createdAt);
}

export async function getHostReviews(hostId: number, includePrivate: boolean = false) {
  const whereConditions: any[] = [eq(reviews.hostId, hostId)];
  
  if (!includePrivate) {
    whereConditions.push(eq(reviews.isPublic, true));
  }
  
  return await db
    .select()
    .from(reviews)
    .where(and(...whereConditions))
    .orderBy(reviews.createdAt);
}

export async function getUserReviews(userId: number) {
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.reviewerId, userId))
    .orderBy(reviews.createdAt);
}

export async function deleteEvaluation(evaluationId: number): Promise<void> {
  await db.delete(evaluations).where(eq(evaluations.id, evaluationId));
}

