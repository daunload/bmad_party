import { pgTable, serial, integer, text, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { evaluations } from './evaluations';

// Report status enum
export const reportStatusEnum = pgEnum('report_status', ['pending', 'approved', 'rejected', 'resolved']);

// Report type enum
export const reportTypeEnum = pgEnum('report_type', ['evaluation', 'user', 'party']);

// Action type enum
export const actionTypeEnum = pgEnum('action_type', ['delete_evaluation', 'warn_user', 'suspend_user', 'dismiss_report']);

// Reports table
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  reporterId: integer('reporter_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  reportedUserId: integer('reported_user_id').references(() => users.id, { onDelete: 'cascade' }),
  evaluationId: integer('evaluation_id').references(() => evaluations.id, { onDelete: 'cascade' }),
  partyId: integer('party_id'), // Can reference parties if needed
  reportType: reportTypeEnum('report_type').notNull(),
  reason: text('reason').notNull(),
  evidence: text('evidence'), // Additional context or evidence
  status: reportStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: integer('resolved_by').references(() => users.id, { onDelete: 'set null' }),
});

// Action logs table
export const actionLogs = pgTable('action_logs', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  actionType: actionTypeEnum('action_type').notNull(),
  targetUserId: integer('target_user_id').references(() => users.id, { onDelete: 'cascade' }),
  targetEvaluationId: integer('target_evaluation_id').references(() => evaluations.id, { onDelete: 'cascade' }),
  reportId: integer('report_id').references(() => reports.id, { onDelete: 'cascade' }),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Guidelines table
export const guidelines = pgTable('guidelines', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category'), // e.g., 'community', 'participation', 'evaluation'
  isActive: boolean('is_active').default(true).notNull(),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
    relationName: 'reporter',
  }),
  reportedUser: one(users, {
    fields: [reports.reportedUserId],
    references: [users.id],
    relationName: 'reportedUser',
  }),
  evaluation: one(evaluations, {
    fields: [reports.evaluationId],
    references: [evaluations.id],
  }),
  resolver: one(users, {
    fields: [reports.resolvedBy],
    references: [users.id],
    relationName: 'resolver',
  }),
}));

export const actionLogsRelations = relations(actionLogs, ({ one }) => ({
  admin: one(users, {
    fields: [actionLogs.adminId],
    references: [users.id],
    relationName: 'admin',
  }),
  targetUser: one(users, {
    fields: [actionLogs.targetUserId],
    references: [users.id],
    relationName: 'targetUser',
  }),
  targetEvaluation: one(evaluations, {
    fields: [actionLogs.targetEvaluationId],
    references: [evaluations.id],
  }),
  report: one(reports, {
    fields: [actionLogs.reportId],
    references: [reports.id],
  }),
}));

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
export type ActionLog = typeof actionLogs.$inferSelect;
export type NewActionLog = typeof actionLogs.$inferInsert;
export type Guideline = typeof guidelines.$inferSelect;
export type NewGuideline = typeof guidelines.$inferInsert;

