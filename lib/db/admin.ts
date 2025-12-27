import { eq, and, desc, count, avg, sql } from 'drizzle-orm';
import { db } from './db';
import { users } from './schema/users';
import { parties } from './schema/parties';
import { evaluations } from './schema/evaluations';
import { reports, actionLogs, guidelines, type Report, type NewReport, type NewActionLog, type NewGuideline } from './schema/admin';

// Metrics
export async function getCommunityMetrics() {
  const startTime = Date.now();

  const [userCount] = await db.select({ count: count() }).from(users);
  const [partyCount] = await db.select({ count: count() }).from(parties);
  const [evaluationCount] = await db.select({ count: count() }).from(evaluations);
  const [reportCount] = await db.select({ count: count() }).from(reports).where(eq(reports.status, 'pending'));

  // Get average popularity score (using raw SQL since popularityScore is stored as text)
  let avgPopularity = 0;
  try {
    const popularityResult = await db.execute(
      sql`SELECT AVG(CAST(popularity_score AS DECIMAL)) as avg_score FROM users WHERE popularity_score IS NOT NULL AND popularity_score != ''`
    );
    
    avgPopularity = popularityResult.rows[0]?.avg_score 
      ? parseFloat(popularityResult.rows[0].avg_score.toString()) 
      : 0;
  } catch (error) {
    // If popularity_score column doesn't exist yet, default to 0
    console.warn('Popularity score calculation failed:', error);
    avgPopularity = 0;
  }

  const responseTime = Date.now() - startTime;
  if (responseTime > 500) {
    console.warn(`Metrics calculation took ${responseTime}ms (exceeds 500ms threshold)`);
  }

  return {
    totalUsers: userCount.count,
    activeParties: partyCount.count,
    averagePopularity: Math.round(avgPopularity * 100) / 100,
    evaluationCount: evaluationCount.count,
    pendingReports: reportCount.count,
  };
}

// Reports
export async function getPendingReports(): Promise<Report[]> {
  return await db
    .select()
    .from(reports)
    .where(eq(reports.status, 'pending'))
    .orderBy(desc(reports.createdAt));
}

export async function createReport(data: NewReport): Promise<Report> {
  const result = await db.insert(reports).values(data).returning();
  return result[0];
}

export async function updateReportStatus(
  reportId: number,
  status: 'approved' | 'rejected' | 'resolved',
  resolvedBy: number
): Promise<Report> {
  const result = await db
    .update(reports)
    .set({
      status,
      resolvedAt: new Date(),
      resolvedBy,
    })
    .where(eq(reports.id, reportId))
    .returning();

  return result[0];
}

// Action Logs
export async function createActionLog(data: NewActionLog) {
  const result = await db.insert(actionLogs).values(data).returning();
  return result[0];
}

export async function getActionLogs(limit: number = 50) {
  return await db
    .select()
    .from(actionLogs)
    .orderBy(desc(actionLogs.createdAt))
    .limit(limit);
}

// Guidelines
export async function getActiveGuidelines() {
  return await db
    .select()
    .from(guidelines)
    .where(eq(guidelines.isActive, true))
    .orderBy(guidelines.createdAt);
}

export async function getAllGuidelines() {
  return await db.select().from(guidelines).orderBy(desc(guidelines.createdAt));
}

export async function createGuideline(data: NewGuideline) {
  const result = await db.insert(guidelines).values(data).returning();
  return result[0];
}

export async function updateGuideline(id: number, data: Partial<NewGuideline>) {
  const result = await db
    .update(guidelines)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(guidelines.id, id))
    .returning();

  return result[0];
}

export async function deleteGuideline(id: number) {
  await db.delete(guidelines).where(eq(guidelines.id, id));
}

