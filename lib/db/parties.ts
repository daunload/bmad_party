import { eq, and, or, gte, desc, inArray, ilike, sql } from 'drizzle-orm';
import { db } from './db';
import { parties, type Party, type NewParty } from './schema/parties';
import { users } from './schema/users';

export async function createParty(data: NewParty): Promise<Party> {
  const result = await db.insert(parties).values(data).returning();
  return result[0];
}

export interface PartyWithHostDetail extends Party {
  host: {
    id: number;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
}

export async function getPartyById(id: number): Promise<Party | null> {
  const result = await db.select().from(parties).where(eq(parties.id, id)).limit(1);
  return result[0] || null;
}

export async function getPartyByIdWithHost(id: number): Promise<PartyWithHostDetail | null> {
  const result = await db
    .select({
      id: parties.id,
      title: parties.title,
      description: parties.description,
      date: parties.date,
      time: parties.time,
      location: parties.location,
      maxParticipants: parties.maxParticipants,
      category: parties.category,
      imageUrl: parties.imageUrl,
      status: parties.status,
      hostId: parties.hostId,
      minPopularityRating: parties.minPopularityRating,
      createdAt: parties.createdAt,
      updatedAt: parties.updatedAt,
      host: {
        id: users.id,
        name: users.name,
        email: users.email,
        profileImage: users.profileImage,
      },
    })
    .from(parties)
    .innerJoin(users, eq(parties.hostId, users.id))
    .where(eq(parties.id, id))
    .limit(1);

  return (result[0] as PartyWithHostDetail) || null;
}

export async function getPartiesByHostId(hostId: number): Promise<Party[]> {
  return await db.select().from(parties).where(eq(parties.hostId, hostId));
}

export async function updateParty(
  partyId: number,
  data: Partial<Omit<NewParty, 'hostId' | 'createdAt' | 'updatedAt'>>
): Promise<Party> {
  const updateData: any = {
    ...data,
    updatedAt: new Date(),
  };

  const result = await db
    .update(parties)
    .set(updateData)
    .where(eq(parties.id, partyId))
    .returning();

  if (result.length === 0) {
    throw new Error('Party not found');
  }

  return result[0];
}

export async function deleteParty(partyId: number): Promise<void> {
  const result = await db.delete(parties).where(eq(parties.id, partyId)).returning();

  if (result.length === 0) {
    throw new Error('Party not found');
  }

  // Related data (참여 신청, 평가 등) will be handled by database cascade delete
  // as defined in the schema (onDelete: 'cascade')
}

export interface GetPartiesOptions {
  page?: number;
  limit?: number;
  status?: ('모집 중' | '모집 완료')[];
}

export interface PartyWithHost extends Party {
  host: {
    id: number;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
}

export async function getActiveParties(
  options: GetPartiesOptions = {}
): Promise<{ parties: PartyWithHost[]; total: number }> {
  const page = options.page || 1;
  const limit = options.limit || 20;
  const offset = (page - 1) * limit;

  // Filter for active parties (모집 중, 모집 완료) and future dates
  const statusFilter = options.status || ['모집 중', '모집 완료'];
  const today = new Date().toISOString().split('T')[0];

  // Build query with relations
  const whereConditions = [
    inArray(parties.status, statusFilter),
    gte(parties.date, today),
  ];

  const partiesQuery = db
    .select({
      id: parties.id,
      title: parties.title,
      description: parties.description,
      date: parties.date,
      time: parties.time,
      location: parties.location,
      maxParticipants: parties.maxParticipants,
      category: parties.category,
      imageUrl: parties.imageUrl,
      status: parties.status,
      hostId: parties.hostId,
      minPopularityRating: parties.minPopularityRating,
      createdAt: parties.createdAt,
      updatedAt: parties.updatedAt,
      host: {
        id: users.id,
        name: users.name,
        email: users.email,
        profileImage: users.profileImage,
      },
    })
    .from(parties)
    .innerJoin(users, eq(parties.hostId, users.id))
    .where(and(...whereConditions))
    .orderBy(desc(parties.createdAt))
    .limit(limit)
    .offset(offset);

  const partiesResult = await partiesQuery;

  // Get total count
  const countResult = await db
    .select()
    .from(parties)
    .where(and(...whereConditions));

  const total = countResult.length;

  return {
    parties: partiesResult as PartyWithHost[],
    total,
  };
}

export interface SearchPartiesOptions {
  keyword?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  status?: ('모집 중' | '모집 완료')[];
}

export async function searchParties(
  options: SearchPartiesOptions = {}
): Promise<{ parties: PartyWithHost[]; total: number }> {
  const page = options.page || 1;
  const limit = options.limit || 20;
  const offset = (page - 1) * limit;

  // Filter for active parties (모집 중, 모집 완료) and future dates
  const statusFilter = options.status || ['모집 중', '모집 완료'];
  const today = new Date().toISOString().split('T')[0];

  // Build where conditions
  const whereConditions: any[] = [
    inArray(parties.status, statusFilter),
    gte(parties.date, today),
  ];

  // Add keyword search (case-insensitive)
  if (options.keyword && options.keyword.trim()) {
    const keyword = `%${options.keyword.trim()}%`;
    whereConditions.push(
      or(
        ilike(parties.title, keyword),
        ilike(parties.description, keyword),
        ilike(parties.category, keyword)
      )!
    );
  }

  // Add category filter
  if (options.category) {
    whereConditions.push(eq(parties.category, options.category as any));
  }

  // Add location filter (case-insensitive, partial match)
  if (options.location && options.location.trim()) {
    const locationPattern = `%${options.location.trim()}%`;
    whereConditions.push(ilike(parties.location, locationPattern));
  }

  // Add date range filter
  if (options.dateFrom) {
    whereConditions.push(gte(parties.date, options.dateFrom));
  }
  if (options.dateTo) {
    whereConditions.push(sql`${parties.date} <= ${options.dateTo}`);
  }

  const partiesQuery = db
    .select({
      id: parties.id,
      title: parties.title,
      description: parties.description,
      date: parties.date,
      time: parties.time,
      location: parties.location,
      maxParticipants: parties.maxParticipants,
      category: parties.category,
      imageUrl: parties.imageUrl,
      status: parties.status,
      hostId: parties.hostId,
      minPopularityRating: parties.minPopularityRating,
      createdAt: parties.createdAt,
      updatedAt: parties.updatedAt,
      host: {
        id: users.id,
        name: users.name,
        email: users.email,
        profileImage: users.profileImage,
      },
    })
    .from(parties)
    .innerJoin(users, eq(parties.hostId, users.id))
    .where(and(...whereConditions))
    .orderBy(desc(parties.createdAt))
    .limit(limit)
    .offset(offset);

  const partiesResult = await partiesQuery;

  // Get total count
  const countQuery = db
    .select()
    .from(parties)
    .where(and(...whereConditions));

  const countResult = await countQuery;
  const total = countResult.length;

  return {
    parties: partiesResult as PartyWithHost[],
    total,
  };
}

