import { z } from "zod";

const id = z.string().min(1).max(200);
const text = z.string().max(10000);
const date = z.string().datetime();
const externalApp = z.enum(["gmail", "google-sheets", "google-calendar", "google-drive", "slack", "webhooks", "http-api"]);
const app = z.enum([...externalApp.options, "tasks", "filter"]);
const status = z.enum(["draft", "active", "paused"]);
const workflow = z.object({
  id, templateId: id.optional(), name: text, description: text, status,
  nodes: z.array(z.object({
    id, type: z.enum(["trigger", "condition", "action"]), appId: app,
    name: text, event: text, summary: text, configured: z.boolean(), order: z.number().int().nonnegative(),
    config: z.record(z.string(), text),
  })).max(200),
  edges: z.array(z.object({ id, source: id, target: id })).max(400),
  createdAt: date, updatedAt: date, lastRunAt: date.optional(),
});
const connection = z.object({
  appId: externalApp, status: z.enum(["connected", "disconnected"]),
  accountLabel: text.optional(), connectedAt: date.optional(), simulated: z.literal(true),
});
const execution = z.object({
  id, workflowId: id, workflowName: text,
  status: z.enum(["running", "success", "filtered", "failed"]),
  startedAt: date, finishedAt: date, durationMs: z.number().nonnegative(), simulated: z.literal(true),
  steps: z.array(z.object({
    id, nodeId: id, nodeName: text,
    status: z.enum(["success", "filtered", "failed", "skipped"]), durationMs: z.number().nonnegative(),
    input: z.record(z.string(), z.unknown()), output: z.record(z.string(), z.unknown()), message: text,
  })).max(200),
});
export const workspaceSnapshotSchema = z.object({
  version: z.literal(1), workflows: z.array(workflow).max(1000),
  connections: z.array(connection).max(7), executions: z.array(execution).max(10000),
});
export const workspaceActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("replace"), snapshot: workspaceSnapshotSchema }),
  z.object({ type: z.literal("save-workflow"), workflow }),
  z.object({ type: z.literal("delete-workflow"), workflowId: id }),
  z.object({ type: z.literal("set-workflow-status"), workflowId: id, status, now: date }),
  z.object({ type: z.literal("toggle-connection"), appId: externalApp, now: date }),
  z.object({ type: z.literal("add-execution"), execution }),
]);
