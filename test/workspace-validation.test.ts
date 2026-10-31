import assert from "node:assert/strict";
import test from "node:test";
import { createDemoSnapshot } from "../lib/daloy/demo-data";
import { workspaceActionSchema, workspaceSnapshotSchema } from "../lib/daloy/workspace-validation";

test("accepts legacy workspace data and rejects malformed nested records", () => {
  const snapshot = createDemoSnapshot();
  assert.deepEqual(workspaceSnapshotSchema.parse(snapshot), snapshot);
  assert.equal(workspaceSnapshotSchema.safeParse({ ...snapshot, workflows: [{ id: "broken" }] }).success, false);
  assert.equal(workspaceActionSchema.safeParse({ type: "set-workflow-status", workflowId: "a", status: "anything", now: new Date().toISOString() }).success, false);
  assert.equal(workspaceActionSchema.safeParse({ type: "toggle-connection", appId: "tasks", now: new Date().toISOString() }).success, false);
});
