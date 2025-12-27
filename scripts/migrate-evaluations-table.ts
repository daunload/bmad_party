/**
 * Migration script to create evaluations and reviews tables
 * Run this script once to create the tables
 *
 * Usage: npx tsx scripts/migrate-evaluations-table.ts
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
    console.log('Starting evaluations and reviews tables migration...');

    // Check if evaluations table exists
    const evaluationsExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'evaluations'
      );
    `;

    if (!evaluationsExists[0].exists) {
      await client`
        CREATE TABLE evaluations (
          id SERIAL PRIMARY KEY,
          evaluator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          evaluatee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          party_id INTEGER NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
          manner_score INTEGER NOT NULL,
          participation_score INTEGER NOT NULL,
          atmosphere_score INTEGER NOT NULL,
          comment TEXT,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          UNIQUE(evaluator_id, evaluatee_id, party_id)
        );
      `;
      console.log('✅ Created evaluations table');

      // Add indexes
      await client`CREATE INDEX IF NOT EXISTS evaluator_id_idx ON evaluations (evaluator_id);`;
      await client`CREATE INDEX IF NOT EXISTS evaluatee_id_idx ON evaluations (evaluatee_id);`;
      await client`CREATE INDEX IF NOT EXISTS party_id_idx ON evaluations (party_id);`;
      console.log('✅ Added indexes to evaluations table');
    } else {
      console.log('✅ evaluations table already exists');
    }

    // Check if reviews table exists
    const reviewsExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'reviews'
      );
    `;

    if (!reviewsExists[0].exists) {
      await client`
        CREATE TABLE reviews (
          id SERIAL PRIMARY KEY,
          reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          party_id INTEGER NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
          host_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          is_public BOOLEAN DEFAULT true NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `;
      console.log('✅ Created reviews table');

      // Add indexes
      await client`CREATE INDEX IF NOT EXISTS reviewer_id_idx ON reviews (reviewer_id);`;
      await client`CREATE INDEX IF NOT EXISTS party_id_idx ON reviews (party_id);`;
      await client`CREATE INDEX IF NOT EXISTS host_id_idx ON reviews (host_id);`;
      console.log('✅ Added indexes to reviews table');
    } else {
      console.log('✅ reviews table already exists');
    }

    // Add popularity fields to users table if not exists
    const popularityScoreExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'popularity_score'
      );
    `;

    if (!popularityScoreExists[0].exists) {
      await client`
        ALTER TABLE users ADD COLUMN popularity_score DECIMAL(3,2) DEFAULT 0.00;
      `;
      console.log('✅ Added popularity_score column to users table');
    }

    const popularityRatingExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'popularity_rating'
      );
    `;

    if (!popularityRatingExists[0].exists) {
      await client`
        ALTER TABLE users ADD COLUMN popularity_rating VARCHAR(10) DEFAULT '보통';
      `;
      console.log('✅ Added popularity_rating column to users table');
    }

    console.log('✅ Evaluations and reviews tables migration completed successfully');
  } catch (error) {
    console.error('❌ Evaluations and reviews tables migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate();

