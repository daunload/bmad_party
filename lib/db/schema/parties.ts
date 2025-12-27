import { pgTable, serial, varchar, text, timestamp, integer, pgEnum, date, time } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Party status enum
export const partyStatusEnum = pgEnum('party_status', ['모집 중', '모집 완료', '진행 중', '종료']);

// Party category enum (common categories for parties)
export const partyCategoryEnum = pgEnum('party_category', [
  '보드게임',
  '네트워킹',
  '취미 활동',
  '스포츠',
  '음식/맛집',
  '문화/예술',
  '여행',
  '기타',
]);

// Popularity rating enum (for min_popularity_rating field)
export const popularityRatingEnum = pgEnum('popularity_rating', ['높음', '보통', '낮음']);

export const parties = pgTable(
  'parties',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 200 }).notNull(), // 제목
    description: text('description'), // 설명
    date: date('date').notNull(), // 날짜
    time: time('time').notNull(), // 시간
    location: varchar('location', { length: 255 }).notNull(), // 장소
    maxParticipants: integer('max_participants').notNull(), // 인원
    category: partyCategoryEnum('category').notNull(), // 카테고리
    imageUrl: text('image_url'), // 이미지 URL
    status: partyStatusEnum('status').default('모집 중').notNull(), // 상태
    hostId: integer('host_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }), // 주최자 ID
    minPopularityRating: popularityRatingEnum('min_popularity_rating'), // 인기도 기준 (선택사항)
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for search performance
    dateIdx: table.date, // 날짜 인덱스
    categoryIdx: table.category, // 카테고리 인덱스
    locationIdx: table.location, // 지역 인덱스
    hostIdIdx: table.hostId, // 주최자 ID 인덱스
    statusIdx: table.status, // 상태 인덱스
  })
);

// Relations
export const partiesRelations = relations(parties, ({ one }) => ({
  host: one(users, {
    fields: [parties.hostId],
    references: [users.id],
  }),
}));

export type Party = typeof parties.$inferSelect;
export type NewParty = typeof parties.$inferInsert;
export type PartyStatus = '모집 중' | '모집 완료' | '진행 중' | '종료';
export type PartyCategory =
  | '보드게임'
  | '네트워킹'
  | '취미 활동'
  | '스포츠'
  | '음식/맛집'
  | '문화/예술'
  | '여행'
  | '기타';
export type PopularityRating = '높음' | '보통' | '낮음';

