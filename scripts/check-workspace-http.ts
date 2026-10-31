import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Pool } from "pg";
import { createDemoSnapshot } from "../lib/daloy/demo-data";

async function main() {
const base = process.env.APP_URL ?? "http://localhost:3000";
await fetch(base);
const manifest = JSON.parse(await readFile(".next/dev/server/server-reference-manifest.json", "utf8"));
const actionId = (name: string) => Object.entries(manifest.node).find(([, item]) => (item as {exportedName?: string}).exportedName === name)?.[0];
const load = actionId("loadDatabaseWorkspace");
const mutate = actionId("mutateDatabaseWorkspace");
assert.ok(load && mutate, "Server actions must be compiled before testing");
let cookie = "";
let workspaceId = "";
async function call(action: string, value: unknown, authenticated = true) {
  const response = await fetch(base, {
    method: "POST",
    headers: { "Next-Action": action, "Content-Type": "text/plain;charset=UTF-8", Origin: base, ...(authenticated && cookie ? {Cookie: cookie} : {}) },
    body: JSON.stringify([value]),
  });
  assert.equal(response.status, 200);
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    cookie = setCookie.split(";")[0];
    workspaceId = cookie.split("=")[1];
    assert.match(setCookie, /httponly/i);
  }
  const stream = await response.text();
  const line = stream.split("\n").find(line => /^\w+:\{"ok":/.test(line));
  assert.ok(line, "Expected structured action response");
  return JSON.parse(line.slice(line.indexOf(":") + 1));
}
const pool = new Pool({connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000});
try {
  const unauthenticated = await call(mutate, {type: "delete-workflow", workflowId: "none"}, false);
  assert.equal(unauthenticated.ok, false);
  const seed = createDemoSnapshot();
  const loaded = await call(load, seed);
  assert.equal(loaded.ok, true);
  assert.equal((await call(load, "obsolete invalid backup")).ok, true, "Existing database workspace must ignore obsolete browser backup");
  const saved = {...seed.workflows[0], name: "HTTP persistence check"};
  assert.equal((await call(mutate, {type: "save-workflow", workflow: saved})).ok, true);
  const reloaded = await call(load, seed);
  assert.equal(reloaded.snapshot.workflows.find((w: {id: string}) => w.id === saved.id).name, saved.name);
  assert.equal((await call(mutate, {type: "save-workflow", workflow: {id: "invalid"}})).ok, false);
  console.log("PASS: HTTP session cookie, saved workflow reload, legacy import, invalid input, unauthenticated rejection.");
} finally {
  if (workspaceId) await pool.query("DELETE FROM daloy.workspaces WHERE id = $1", [workspaceId]);
  await pool.end();
}

}
main().catch(error => { console.error("HTTP workspace verification failed:", error instanceof assert.AssertionError ? error.message : "request failed"); process.exitCode = 1; });
