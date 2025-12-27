import { db } from '@/lib/db/db';
import { users } from '@/lib/db/schema/users';
import { parties } from '@/lib/db/schema/parties';
import { evaluations } from '@/lib/db/schema/evaluations';
import { count, avg, sql, gte, lte } from 'drizzle-orm';

export interface AnalyticsReport {
  type: string;
  dateRange?: { from?: string; to?: string };
  summary: {
    totalUsers?: number;
    activeParties?: number;
    totalEvaluations?: number;
    averagePopularity?: number;
  };
  trends?: any[];
  distribution?: any[];
}

export async function generateAnalyticsReport(
  reportType: string,
  dateFrom?: string,
  dateTo?: string
): Promise<AnalyticsReport> {
  const startTime = Date.now();

  let report: AnalyticsReport = {
    type: reportType,
    summary: {},
  };

  if (dateFrom || dateTo) {
    report.dateRange = { from: dateFrom, to: dateTo };
  }

  switch (reportType) {
    case 'user_activity':
      const [userCount] = await db.select({ count: count() }).from(users);
      report.summary.totalUsers = userCount.count;

      // Get user activity trends (users created per month)
      const userTrends = await db
        .select({
          month: sql<string>`TO_CHAR(${users.createdAt}, 'YYYY-MM')`,
          count: count(),
        })
        .from(users)
        .groupBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`);

      report.trends = userTrends;
      break;

    case 'party_statistics':
      const [partyCount] = await db.select({ count: count() }).from(parties);
      report.summary.activeParties = partyCount.count;

      // Get party statistics by category
      const partyByCategory = await db
        .select({
          category: parties.category,
          count: count(),
        })
        .from(parties)
        .groupBy(parties.category);

      report.distribution = partyByCategory;
      break;

    case 'evaluation_trends':
      const [evalCount] = await db.select({ count: count() }).from(evaluations);
      report.summary.totalEvaluations = evalCount.count;

      // Get average scores over time
      const scoreTrends = await db
        .select({
          month: sql<string>`TO_CHAR(${evaluations.createdAt}, 'YYYY-MM')`,
          avgScore: sql<number>`AVG((${evaluations.mannerScore} + ${evaluations.participationScore} + ${evaluations.atmosphereScore}) / 3.0)`,
        })
        .from(evaluations)
        .groupBy(sql`TO_CHAR(${evaluations.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${evaluations.createdAt}, 'YYYY-MM')`);

      report.trends = scoreTrends;
      break;

    case 'popularity_distribution':
      const popularityDist = await db
        .select({
          rating: users.popularityRating,
          count: count(),
        })
        .from(users)
        .where(sql`${users.popularityRating} IS NOT NULL`)
        .groupBy(users.popularityRating);

      report.distribution = popularityDist;

      const [avgPop] = await db
        .select({
          avg: sql<number>`AVG(CAST(${users.popularityScore} AS DECIMAL))`,
        })
        .from(users)
        .where(sql`${users.popularityScore} IS NOT NULL`);

      report.summary.averagePopularity = avgPop?.avg
        ? parseFloat(avgPop.avg.toString())
        : 0;
      break;
  }

  const responseTime = Date.now() - startTime;
  if (responseTime > 5000) {
    console.warn(`Report generation took ${responseTime}ms (exceeds 5s threshold)`);
  }

  return report;
}

