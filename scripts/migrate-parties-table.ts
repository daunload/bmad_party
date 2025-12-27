/**
 * Migration script to create parties table
 * Run this script once to create the parties table with all required fields
 * 
 * Usage: npx tsx scripts/migrate-parties-table.ts
 */

import postgres from 'postgres';
import { loadEnv } from './load-env';

// Load environment variables from .env.local
loadEnv();

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set. Please create .env.local file with POSTGRES_URL.');
}

// Use sslmode=disable for local development, require for production
const postgresUrl = process.env.POSTGRES_URL.includes('sslmode=')
  ? process.env.POSTGRES_URL
  : `${process.env.POSTGRES_URL}?sslmode=disable`;

const client = postgres(postgresUrl);

async function migrate() {
  try {
    console.log('Starting parties table migration...');

    // Check if parties table exists
    const tableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'parties'
      );
    `;

    if (tableExists[0].exists) {
      console.log('✅ parties table already exists');
      return;
    }

    // Create enums
    console.log('Creating enums...');
    await client`
      DO $$ BEGIN
        CREATE TYPE party_status AS ENUM ('모집 중', '모집 완료', '진행 중', '종료');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await client`
      DO $$ BEGIN
        CREATE TYPE party_category AS ENUM ('보드게임', '네트워킹', '취미 활동', '스포츠', '음식/맛집', '문화/예술', '여행', '기타');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await client`
      DO $$ BEGIN
        CREATE TYPE popularity_rating AS ENUM ('높음', '보통', '낮음');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create parties table
    console.log('Creating parties table...');
    await client`
      CREATE TABLE parties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TIME NOT NULL,
        location VARCHAR(255) NOT NULL,
        max_participants INTEGER NOT NULL,
        category party_category NOT NULL,
        image_url TEXT,
        status party_status DEFAULT '모집 중' NOT NULL,
        host_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        min_popularity_rating popularity_rating,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Create indexes for search performance
    console.log('Creating indexes...');
    await client`CREATE INDEX IF NOT EXISTS idx_parties_date ON parties(date);`;
    await client`CREATE INDEX IF NOT EXISTS idx_parties_category ON parties(category);`;
    await client`CREATE INDEX IF NOT EXISTS idx_parties_location ON parties(location);`;
    await client`CREATE INDEX IF NOT EXISTS idx_parties_host_id ON parties(host_id);`;
    await client`CREATE INDEX IF NOT EXISTS idx_parties_status ON parties(status);`;

    // Add updated_at trigger
    await client`
      CREATE OR REPLACE FUNCTION update_parties_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    await client`
      DROP TRIGGER IF EXISTS update_parties_updated_at ON parties;
    `;

    await client`
      CREATE TRIGGER update_parties_updated_at
      BEFORE UPDATE ON parties
      FOR EACH ROW
      EXECUTE FUNCTION update_parties_updated_at_column();
    `;

    console.log('✅ Parties table migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate();

