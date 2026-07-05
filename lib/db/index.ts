import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL?.trim();
const hasDatabaseConnection = Boolean(
  connectionString && !['undefined', 'null', 'none'].includes(connectionString.toLowerCase())
);

const createDbStub = () =>
  new Proxy(
    {},
    {
      get() {
        throw new Error('DATABASE_URL is not configured. Set it before calling the database layer.');
      },
    }
  );

const globalForDb = globalThis as typeof globalThis & {
  db?: unknown;
};

function getDb() {
  if (globalForDb.db) {
    return globalForDb.db;
  }

  if (!hasDatabaseConnection) {
    const stub = createDbStub();
    globalForDb.db = stub;
    return stub;
  }

  const { drizzle } = require('drizzle-orm/neon-http') as typeof import('drizzle-orm/neon-http');
  const dbClient = drizzle(neon(connectionString!), { schema });
  globalForDb.db = dbClient;
  return dbClient;
}

export const db = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getDb() as Record<string, unknown>;
      const value = client[prop as string];

      if (typeof value === 'function') {
        return (...args: unknown[]) => (value as (...args: unknown[]) => unknown).apply(client, args);
      }

      return value;
    },
  }
) as any;

export { getDb };
export * from './schema';
