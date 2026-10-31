import type { Pool, PoolClient } from "pg";
import { createDemoSnapshot } from "../daloy/demo-data";
import type { WorkspaceSnapshot } from "../daloy/storage";
import { reduceWorkspace, type WorkspaceAction } from "../daloy/workspace-state";
import { workspaceActionSchema, workspaceSnapshotSchema } from "../daloy/workspace-validation";

export class WorkspaceImportError extends Error {}

const tables = ["workflows", "connections", "executions"] as const;

export function createWorkspaceRepository(pool: Pool) {
  async function transaction<T>(run: (client: PoolClient) => Promise<T>) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await run(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async function read(client: PoolClient, workspaceId: string): Promise<WorkspaceSnapshot> {
    const snapshot: WorkspaceSnapshot = { version: 1, workflows: [], connections: [], executions: [] };
    for (const table of tables) {
      const result = await client.query(`SELECT data FROM daloy.${table} WHERE workspace_id = $1 ORDER BY position`, [workspaceId]);
      snapshot[table] = result.rows.map(row => row.data);
    }
    return workspaceSnapshotSchema.parse(snapshot);
  }

  async function write(client: PoolClient, workspaceId: string, snapshot: WorkspaceSnapshot) {
    // The workspace row lock serializes this replacement with all other mutations.
    // Entity rows keep independently addressable IDs rather than one workspace blob.
    for (const table of tables) {
      await client.query(`DELETE FROM daloy.${table} WHERE workspace_id = $1`, [workspaceId]);
      const rows = snapshot[table].map((data, position) => ({ id: "appId" in data ? data.appId : data.id, position, data }));
      await client.query(`INSERT INTO daloy.${table} (workspace_id, id, position, data)
        SELECT $1, item.id, item.position, item.data
        FROM jsonb_to_recordset($2::jsonb) AS item(id text, position integer, data jsonb)`, [workspaceId, JSON.stringify(rows)]);
    }
  }

  return {
    async load(workspaceId: string, initial?: unknown) {
      return transaction(async client => {
        const inserted = await client.query("INSERT INTO daloy.workspaces (id) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id", [workspaceId]);
        await client.query("SELECT id FROM daloy.workspaces WHERE id = $1 FOR UPDATE", [workspaceId]);
        if (inserted.rowCount) {
          let snapshot: WorkspaceSnapshot;
          try {
            snapshot = workspaceSnapshotSchema.parse(typeof initial === "string" ? JSON.parse(initial) : initial ?? createDemoSnapshot());
          } catch {
            throw new WorkspaceImportError("Your browser workspace could not be imported. Its backup has been preserved.");
          }
          await write(client, workspaceId, snapshot);
        }
        return read(client, workspaceId);
      });
    },
    async mutate(workspaceId: string, input: WorkspaceAction) {
      const action = workspaceActionSchema.parse(input);
      return transaction(async client => {
        const locked = await client.query("SELECT id FROM daloy.workspaces WHERE id = $1 FOR UPDATE", [workspaceId]);
        if (!locked.rowCount) throw new Error("Workspace session expired. Reload the page.");
        const current = await read(client, workspaceId);
        const next = workspaceSnapshotSchema.parse(reduceWorkspace(current, action));
        await write(client, workspaceId, next);
        return next;
      });
    },
  };
}
