import assert from "node:assert/strict";
import test from "node:test";

import { createDemoSnapshot } from "../lib/daloy/demo-data";
import { parseWorkspaceSnapshot, serializeWorkspaceSnapshot, STORAGE_VERSION } from "../lib/daloy/storage";

test("workspace state round-trips through the versioned storage envelope", () => {
  const snapshot = createDemoSnapshot();
  const parsed = parseWorkspaceSnapshot(serializeWorkspaceSnapshot(snapshot));

  assert.equal(parsed.recovered, false);
  assert.equal(parsed.snapshot.version, STORAGE_VERSION);
  assert.deepEqual(parsed.snapshot, snapshot);
});

test("invalid or incompatible storage recovers to deterministic demo data", () => {
  const invalidJson = parseWorkspaceSnapshot("not-json");
  const wrongVersion = parseWorkspaceSnapshot(JSON.stringify({ version: 999, workflows: [] }));

  assert.equal(invalidJson.recovered, true);
  assert.equal(wrongVersion.recovered, true);
  assert.deepEqual(invalidJson.snapshot, createDemoSnapshot());
  assert.deepEqual(wrongVersion.snapshot, createDemoSnapshot());
});
