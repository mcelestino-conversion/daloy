import { readFile } from 'node:fs/promises';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) throw new Error('Set DATABASE_URL in the environment or .env.local first.');
const direct = new URL(connectionString);
direct.hostname = direct.hostname.replace('-pooler.', '.');
const client = new pg.Client({ connectionString: direct.toString(), enableChannelBinding: true, connectionTimeoutMillis: 15000 });
try {
  await client.connect();
  await client.query(await readFile(new URL('../db/migrations/001-workspaces.sql', import.meta.url), 'utf8'));
  console.log('Workspace schema ready.');
} catch {
  console.error('Migration failed. Check database connectivity and permissions.');
  process.exitCode = 1;
} finally {
  await client.end();
}
