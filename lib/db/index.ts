import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is not set. Database operations will fail.');
}

// We use a dummy string during build to avoid 'postgres' library validation errors if URL is missing
const client = postgres(connectionString || 'postgresql://postgres:postgres@localhost:5432/postgres');
export const db = drizzle(client, { schema });
