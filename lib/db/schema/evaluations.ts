import { pgTable, serial, integer, text, timestamp, pgEnum, boolean, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { parties } from './parties';

export const evaluations = pgTable(
  'evaluations',
  {
    id: serial('id').primaryKey(),
    evaluatorId: integer('evaluator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    evaluateeId: integer('evaluatee_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    partyId: integer('party_id')
      .notNull()
      .references(() => parties.id, { onDelete: 'cascade' }),
    mannerScore: integer('manner_score').notNull(), // 매너 점수 (1-5)
    participationScore: integer('participation_score').notNull(), // 참여도 점수 (1-5)
    atmosphereScore: integer('atmosphere_score').notNull(), // 분위기 기여 점수 (1-5)
    comment: text('comment'), // 코멘트
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    // Unique constraint: one evaluation per evaluator-evaluatee-party combination
    uniqueEvaluation: unique().on(table.evaluatorId, table.evaluateeId, table.partyId),
  })
);

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  reviewerId: integer('reviewer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  partyId: integer('party_id')
    .notNull()
    .references(() => parties.id, { onDelete: 'cascade' }),
  hostId: integer('host_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(), // 리뷰 내용
  isPublic: boolean('is_public').default(true).notNull(), // 공개 설정
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  evaluator: one(users, {
    fields: [evaluations.evaluatorId],
    references: [users.id],
    relationName: 'evaluator',
  }),
  evaluatee: one(users, {
    fields: [evaluations.evaluateeId],
    references: [users.id],
    relationName: 'evaluatee',
  }),
  party: one(parties, {
    fields: [evaluations.partyId],
    references: [parties.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
  party: one(parties, {
    fields: [reviews.partyId],
    references: [parties.id],
  }),
  host: one(users, {
    fields: [reviews.hostId],
    references: [users.id],
  }),
}));

export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

