import { eq, and } from 'drizzle-orm';
import { db } from './db';
import { partyParticipants, type PartyParticipant, type NewPartyParticipant } from './schema/party_participants';
import { users } from './schema/users';

export async function createParticipationRequest(
  data: NewPartyParticipant
): Promise<PartyParticipant> {
  const result = await db.insert(partyParticipants).values(data).returning();
  return result[0];
}

export async function getParticipationRequest(
  partyId: number,
  userId: number
): Promise<PartyParticipant | null> {
  const result = await db
    .select()
    .from(partyParticipants)
    .where(and(eq(partyParticipants.partyId, partyId), eq(partyParticipants.userId, userId)))
    .limit(1);
  return result[0] || null;
}

export async function getPartyParticipants(partyId: number): Promise<PartyParticipant[]> {
  return await db
    .select()
    .from(partyParticipants)
    .where(eq(partyParticipants.partyId, partyId));
}

export async function getApprovedParticipants(partyId: number): Promise<PartyParticipant[]> {
  return await db
    .select()
    .from(partyParticipants)
    .where(and(eq(partyParticipants.partyId, partyId), eq(partyParticipants.status, 'approved')));
}

export async function getPendingParticipants(partyId: number): Promise<PartyParticipant[]> {
  return await db
    .select()
    .from(partyParticipants)
    .where(and(eq(partyParticipants.partyId, partyId), eq(partyParticipants.status, 'pending')));
}

export async function updateParticipationStatus(
  id: number,
  status: 'approved' | 'rejected'
): Promise<PartyParticipant> {
  const updateData: any = {
    status,
  };

  if (status === 'approved') {
    updateData.approvedAt = new Date();
  } else if (status === 'rejected') {
    updateData.rejectedAt = new Date();
  }

  const result = await db
    .update(partyParticipants)
    .set(updateData)
    .where(eq(partyParticipants.id, id))
    .returning();

  if (result.length === 0) {
    throw new Error('Participation request not found');
  }

  return result[0];
}

export async function getUserParticipations(userId: number): Promise<PartyParticipant[]> {
  return await db
    .select()
    .from(partyParticipants)
    .where(eq(partyParticipants.userId, userId));
}

