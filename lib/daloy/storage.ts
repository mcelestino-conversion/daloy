import { createDemoSnapshot } from "./demo-data";
import type { Connection, Execution, Workflow } from "./types";

export const STORAGE_VERSION = 1;
export const STORAGE_KEY = "daloy.workspace.v1";

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type WorkspaceSnapshot = {
  version: typeof STORAGE_VERSION;
  workflows: Workflow[];
  connections: Connection[];
  executions: Execution[];
};

export function serializeWorkspaceSnapshot(snapshot: WorkspaceSnapshot) {
  return JSON.stringify(snapshot);
}

function isSnapshot(value: unknown): value is WorkspaceSnapshot {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return record.version === STORAGE_VERSION && Array.isArray(record.workflows) && Array.isArray(record.connections) && Array.isArray(record.executions);
}

export function parseWorkspaceSnapshot(value: string | null): { snapshot: WorkspaceSnapshot; recovered: boolean } {
  if (!value) return { snapshot: createDemoSnapshot(), recovered: true };
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isSnapshot(parsed)) return { snapshot: createDemoSnapshot(), recovered: true };
    return { snapshot: parsed, recovered: false };
  } catch {
    return { snapshot: createDemoSnapshot(), recovered: true };
  }
}

export function loadWorkspace(storage: StorageLike) {
  return parseWorkspaceSnapshot(storage.getItem(STORAGE_KEY));
}

export function saveWorkspace(storage: StorageLike, snapshot: WorkspaceSnapshot) {
  storage.setItem(STORAGE_KEY, serializeWorkspaceSnapshot(snapshot));
}
