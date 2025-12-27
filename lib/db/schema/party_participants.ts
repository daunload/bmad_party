import { pgTable, serial, integer, timestamp, pgEnum, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { parties } from './parties';

// Participation status enum
export const participationStatusEnum = pgEnum('participation_status', ['pending', 'approved', 'rejected']);

export const partyParticipants = pgTable(
  'party_participants',
  {
    id: serial('id').primaryKey(),
    partyId: integer('party_id')
      .notNull()
      .references(() => parties.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: participationStatusEnum('status').default('pending').notNull(),
    requestedAt: timestamp('requested_at').defaultNow().notNull(),
    approvedAt: timestamp('approved_at'),
    rejectedAt: timestamp('rejected_at'),
  },
  (table) => ({
    // Unique constraint: one request per user per party
    uniqueUserParty: unique().on(table.userId, table.partyId),
  })
);

// Relations
export const partyParticipantsRelations = relations(partyParticipants, ({ one }) => ({
  party: one(parties, {
    fields: [partyParticipants.partyId],
    references: [parties.id],
  }),
  user: one(users, {
    fields: [partyParticipants.userId],
    references: [users.id],
  }),
}));

export type PartyParticipant = typeof partyParticipants.$inferSelect;
export type NewPartyParticipant = typeof partyParticipants.$inferInsert;
export type ParticipationStatus = 'pending' | 'approved' | 'rejected';

