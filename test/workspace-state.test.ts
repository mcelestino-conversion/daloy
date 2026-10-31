import assert from "node:assert/strict";
import test from "node:test";

import { createDemoSnapshot } from "../lib/daloy/demo-data";
import { loadWorkspace, saveWorkspace } from "../lib/daloy/storage";
import { reduceWorkspace } from "../lib/daloy/workspace-state";

function memoryStorage(initial?: string) {
  let value = initial ?? null;
  return {
    getItem: () => value,
    setItem: (_key: string, next: string) => {
      value = next;
    },
    removeItem: () => {
      value = null;
    },
  };
}

test("storage adapters seed invalid state and persist actions", () => {
  const storage = memoryStorage("broken");
  const loaded = loadWorkspace(storage);
  const updated = reduceWorkspace(loaded.snapshot, { type: "set-workflow-status", workflowId: "demo-applications-flow", status: "paused", now: "2026-10-25T16:00:00.000Z" });
  saveWorkspace(storage, updated);

  assert.equal(loaded.recovered, true);
  assert.equal(loadWorkspace(storage).snapshot.workflows[0]!.status, "paused");
});

test("workspace reducer upserts workflows and appends executions immutably", () => {
  const snapshot = createDemoSnapshot();
  const workflow = { ...snapshot.workflows[0]!, name: "Updated flow" };
  const withWorkflow = reduceWorkspace(snapshot, { type: "save-workflow", workflow });
  const execution = { ...snapshot.executions[0]!, id: "new-run" };
  const withExecution = reduceWorkspace(withWorkflow, { type: "add-execution", execution });

  assert.equal(withWorkflow.workflows[0]!.name, "Updated flow");
  assert.equal(snapshot.workflows[0]!.name, "Track job applications");
  assert.equal(withExecution.executions[0]!.id, "new-run");
});

test("workspace reducer toggles demo connections without losing catalog entries", () => {
  const snapshot = createDemoSnapshot();
  const connected = reduceWorkspace(snapshot, { type: "toggle-connection", appId: "slack", now: "2026-10-25T16:00:00.000Z" });
  const disconnected = reduceWorkspace(connected, { type: "toggle-connection", appId: "slack", now: "2026-10-25T16:05:00.000Z" });

  assert.equal(connected.connections.find((item) => item.appId === "slack")!.status, "connected");
  assert.equal(disconnected.connections.find((item) => item.appId === "slack")!.status, "disconnected");
  assert.equal(disconnected.connections.length, 7);
});
