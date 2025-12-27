import { pgTable, serial, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { parties } from './parties';

// User role enum
export const userRoleEnum = pgEnum('user_role', ['일반 사용자', '멘토', '관리자']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  profileImage: text('profile_image'),
  role: userRoleEnum('role').default('일반 사용자').notNull(),
  popularityScore: text('popularity_score'), // DECIMAL stored as text
  popularityRating: varchar('popularity_rating', { length: 10 }), // 높음, 보통, 낮음
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  hostedParties: many(parties), // 사용자가 주최한 파티들
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = '일반 사용자' | '멘토' | '관리자';

