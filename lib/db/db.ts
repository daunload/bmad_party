import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// POSTGRES_URL에 이미 sslmode가 포함되어 있으면 그대로 사용, 없으면 환경에 따라 설정
const postgresUrl = process.env.POSTGRES_URL.includes('sslmode=')
  ? process.env.POSTGRES_URL
  : process.env.NODE_ENV === 'production'
    ? `${process.env.POSTGRES_URL}?sslmode=require`
    : `${process.env.POSTGRES_URL}?sslmode=disable`;

const client = postgres(postgresUrl);
export const db = drizzle(client);

