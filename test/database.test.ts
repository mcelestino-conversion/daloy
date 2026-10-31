import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Pool } from "pg";
import { createDemoSnapshot } from "../lib/daloy/demo-data";
import { createWorkspaceRepository } from "../lib/server/workspace-repository";

// Explicit opt-in: writes only random test workspaces and removes them afterwards.
test("Postgres preserves changes, isolates workspaces and serializes concurrent mutations", { skip: !process.env.TEST_DATABASE_URL }, async () => {
  const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL, max: 3 });
  const repository = createWorkspaceRepository(pool);
  const id = randomUUID();
  const other = randomUUID();
  try {
    await pool.query(await readFile("db/migrations/001-workspaces.sql", "utf8"));
    const initial = createDemoSnapshot();
    const imported = { ...initial, workflows: [{ ...initial.workflows[0], name: "Imported flow" }] };
    assert.deepEqual(await repository.load(id, imported), imported);
    assert.deepEqual(await repository.load(id, "invalid old backup"), imported);
    assert.equal((await repository.load(id, initial)).workflows[0].name, "Imported flow", "repeated initialization must not overwrite saved data");
    await repository.load(other, initial);
    const flow = { ...imported.workflows[0], name: "Saved in Postgres" };
    await repository.mutate(id, { type: "save-workflow", workflow: flow });
    assert.equal((await repository.load(id)).workflows[0].name, "Saved in Postgres");
    assert.notEqual((await repository.load(other)).workflows[0].name, "Saved in Postgres");
    await repository.mutate(id, { type: "set-workflow-status", workflowId: flow.id, status: "paused", now: new Date().toISOString() });
    await repository.mutate(id, { type: "toggle-connection", appId: "gmail", now: new Date().toISOString() });
    await repository.mutate(id, { type: "add-execution", execution: { ...initial.executions[0], id: "persisted-run" } });
    const persisted = await repository.load(id);
    assert.equal(persisted.workflows[0].status, "paused");
    assert.equal(persisted.connections.find(connection => connection.appId === "gmail")?.status, "disconnected");
    assert.equal(persisted.executions[0].id, "persisted-run");
    await Promise.all([1, 2].map(n => repository.mutate(id, { type: "save-workflow", workflow: { ...flow, id: `concurrent-${n}` } })));
    assert.equal((await repository.load(id)).workflows.length, 3);
    await repository.mutate(id, { type: "delete-workflow", workflowId: flow.id });
    assert.equal((await repository.load(id)).workflows.length, 2);
    await assert.rejects(repository.mutate(id, { type: "save-workflow", workflow: { id: "invalid" } } as never));
    assert.equal((await repository.load(id)).workflows.length, 2);
    await assert.rejects(repository.mutate(randomUUID(), { type: "delete-workflow", workflowId: flow.id }));
    await repository.mutate(id, { type: "replace", snapshot: { ...initial, workflows: [], executions: [] } });
    assert.equal((await repository.load(id)).workflows.length, 0, "empty workspace stays empty");
  } finally {
    await pool.query("DELETE FROM daloy.workspaces WHERE id = ANY($1::uuid[])", [[id, other]]).catch(() => {});
    await pool.end();
  }
});
