// backend/drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'better-sqlite3', // Mantener esto para las migraciones
  dbCredentials: {
    url: './sqlite.db'
  }
} satisfies Config;
