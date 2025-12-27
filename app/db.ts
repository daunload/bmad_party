import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { db } from '@/lib/db/db';
import { users } from '@/lib/db/schema/users';

// Legacy functions for backward compatibility
// These will be migrated to use the new schema structure

export async function getUser(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result;
}

export async function createUser(email: string, password: string, role: '일반 사용자' | '멘토' | '관리자' = '일반 사용자') {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  const result = await db.insert(users).values({ 
    email, 
    password: hash,
    role,
  }).returning();

  return result;
}
