import { eq } from 'drizzle-orm';
import { db } from './db';
import { users, type User } from './schema/users';

export async function getUserById(id: number): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

export async function updateUserProfile(
  userId: number,
  data: { name?: string; profileImage?: string }
): Promise<User> {
  const updateData: { name?: string; profileImage?: string; updatedAt?: Date } = {
    ...data,
    updatedAt: new Date(),
  };

  const result = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning();

  return result[0];
}

