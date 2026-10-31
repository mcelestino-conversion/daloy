import "server-only";
import { Pool } from "pg";
import { createWorkspaceRepository } from "./workspace-repository";

const globalDatabase = globalThis as typeof globalThis & { daloyPool?: Pool };

export function getWorkspaceRepository() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  const pool = globalDatabase.daloyPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    enableChannelBinding: true,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
    statement_timeout: 15000,
  });
  return createWorkspaceRepository(pool);
}
