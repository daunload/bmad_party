/**
 * Migration script to update users table with new fields
 * Run this script once to migrate existing User table to users table with new schema
 * 
 * Usage: npx tsx scripts/migrate-users-table.ts
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
    console.log('Starting migration...');

    // Check if old User table exists
    const oldTableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'User'
      );
    `;

    // Check if new users table exists
    const newTableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;

    if (oldTableExists[0].exists && !newTableExists[0].exists) {
      // Create user_role enum
      await client`
        DO $$ BEGIN
          CREATE TYPE user_role AS ENUM ('일반 사용자', '멘토', '관리자');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `;

      // Create new users table with extended schema
      await client`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(100),
          profile_image TEXT,
          role user_role DEFAULT '일반 사용자' NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `;

      // Migrate data from old User table to new users table
      await client`
        INSERT INTO users (id, email, password, role, created_at, updated_at)
        SELECT id, email, password, '일반 사용자'::user_role, NOW(), NOW()
        FROM "User";
      `;

      console.log('✅ Migration completed: Data migrated from User to users table');
    } else if (newTableExists[0].exists) {
      console.log('✅ users table already exists');
      
      // Check if role column exists
      const roleColumnExists = await client`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'users' 
          AND column_name = 'role'
        );
      `;

      if (!roleColumnExists[0].exists) {
        console.log('Adding role column to existing users table...');
        
        // Create user_role enum if it doesn't exist
        await client`
          DO $$ BEGIN
            CREATE TYPE user_role AS ENUM ('일반 사용자', '멘토', '관리자');
          EXCEPTION
            WHEN duplicate_object THEN null;
          END $$;
        `;

        // Add role column with default value
        await client`
          ALTER TABLE users 
          ADD COLUMN role user_role DEFAULT '일반 사용자' NOT NULL;
        `;

        console.log('✅ Added role column to users table');
      } else {
        console.log('✅ role column already exists');
      }
    } else if (!oldTableExists[0].exists && !newTableExists[0].exists) {
      // Create user_role enum
      await client`
        DO $$ BEGIN
          CREATE TYPE user_role AS ENUM ('일반 사용자', '멘토', '관리자');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `;

      // Create new users table if neither exists
      await client`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(100),
          profile_image TEXT,
          role user_role DEFAULT '일반 사용자' NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `;

      console.log('✅ Created new users table');
    }

    // Add updated_at trigger if it doesn't exist
    await client`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    await client`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    `;

    await client`
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `;

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate();

