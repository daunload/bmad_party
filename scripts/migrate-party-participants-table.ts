/**
 * Migration script to create party_participants table
 * Run this script once to create the party_participants table
 *
 * Usage: npx tsx scripts/migrate-party-participants-table.ts
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
    console.log('Starting party_participants table migration...');

    // Check if participation_status enum exists
    const enumExists = await client`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'participation_status'
      );
    `;
    if (!enumExists[0].exists) {
      await client`
        CREATE TYPE participation_status AS ENUM ('pending', 'approved', 'rejected');
      `;
      console.log('✅ Created participation_status enum');
    }

    // Check if party_participants table exists
    const tableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'party_participants'
      );
    `;

    if (!tableExists[0].exists) {
      await client`
        CREATE TABLE party_participants (
          id SERIAL PRIMARY KEY,
          party_id INTEGER NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          status participation_status DEFAULT 'pending' NOT NULL,
          requested_at TIMESTAMP DEFAULT NOW() NOT NULL,
          approved_at TIMESTAMP,
          rejected_at TIMESTAMP,
          UNIQUE(user_id, party_id)
        );
      `;
      console.log('✅ Created party_participants table');

      // Add indexes
      await client`CREATE INDEX IF NOT EXISTS party_id_idx ON party_participants (party_id);`;
      await client`CREATE INDEX IF NOT EXISTS user_id_idx ON party_participants (user_id);`;
      await client`CREATE INDEX IF NOT EXISTS status_idx ON party_participants (status);`;
      console.log('✅ Added indexes to party_participants table');
    } else {
      console.log('✅ party_participants table already exists');
    }

    console.log('✅ Party participants table migration completed successfully');
  } catch (error) {
    console.error('❌ Party participants table migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate();

