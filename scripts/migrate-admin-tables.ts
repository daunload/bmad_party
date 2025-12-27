/**
 * Migration script to create admin-related tables
 * Run this script once to create the tables
 *
 * Usage: npx tsx scripts/migrate-admin-tables.ts
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
    console.log('Starting admin tables migration...');

    // Create enums
    const reportStatusExists = await client`
      SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status');
    `;
    if (!reportStatusExists[0].exists) {
      await client`
        CREATE TYPE report_status AS ENUM ('pending', 'approved', 'rejected', 'resolved');
      `;
      console.log('✅ Created report_status enum');
    }

    const reportTypeExists = await client`
      SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_type');
    `;
    if (!reportTypeExists[0].exists) {
      await client`
        CREATE TYPE report_type AS ENUM ('evaluation', 'user', 'party');
      `;
      console.log('✅ Created report_type enum');
    }

    const actionTypeExists = await client`
      SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'action_type');
    `;
    if (!actionTypeExists[0].exists) {
      await client`
        CREATE TYPE action_type AS ENUM ('delete_evaluation', 'warn_user', 'suspend_user', 'dismiss_report');
      `;
      console.log('✅ Created action_type enum');
    }

    // Create reports table
    const reportsExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'reports'
      );
    `;
    if (!reportsExists[0].exists) {
      await client`
        CREATE TABLE reports (
          id SERIAL PRIMARY KEY,
          reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          reported_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          evaluation_id INTEGER REFERENCES evaluations(id) ON DELETE CASCADE,
          party_id INTEGER,
          report_type report_type NOT NULL,
          reason TEXT NOT NULL,
          evidence TEXT,
          status report_status DEFAULT 'pending' NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          resolved_at TIMESTAMP,
          resolved_by INTEGER REFERENCES users(id) ON DELETE SET NULL
        );
      `;
      await client`CREATE INDEX IF NOT EXISTS reporter_id_idx ON reports (reporter_id);`;
      await client`CREATE INDEX IF NOT EXISTS reported_user_id_idx ON reports (reported_user_id);`;
      await client`CREATE INDEX IF NOT EXISTS evaluation_id_idx ON reports (evaluation_id);`;
      await client`CREATE INDEX IF NOT EXISTS status_idx ON reports (status);`;
      console.log('✅ Created reports table');
    }

    // Create action_logs table
    const actionLogsExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'action_logs'
      );
    `;
    if (!actionLogsExists[0].exists) {
      await client`
        CREATE TABLE action_logs (
          id SERIAL PRIMARY KEY,
          admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          action_type action_type NOT NULL,
          target_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          target_evaluation_id INTEGER REFERENCES evaluations(id) ON DELETE CASCADE,
          report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
          reason TEXT,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `;
      await client`CREATE INDEX IF NOT EXISTS admin_id_idx ON action_logs (admin_id);`;
      await client`CREATE INDEX IF NOT EXISTS target_user_id_idx ON action_logs (target_user_id);`;
      console.log('✅ Created action_logs table');
    }

    // Create guidelines table
    const guidelinesExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'guidelines'
      );
    `;
    if (!guidelinesExists[0].exists) {
      await client`
        CREATE TABLE guidelines (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT,
          is_active BOOLEAN DEFAULT true NOT NULL,
          created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `;
      await client`CREATE INDEX IF NOT EXISTS is_active_idx ON guidelines (is_active);`;
      console.log('✅ Created guidelines table');
    }

    console.log('✅ Admin tables migration completed successfully');
  } catch (error) {
    console.error('❌ Admin tables migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate();

