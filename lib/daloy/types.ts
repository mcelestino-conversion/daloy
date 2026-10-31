export type AppId =
  | "gmail"
  | "google-sheets"
  | "google-calendar"
  | "google-drive"
  | "slack"
  | "webhooks"
  | "http-api"
  | "tasks"
  | "filter";

export type NodeType = "trigger" | "condition" | "action";
export type WorkflowStatus = "draft" | "active" | "paused";
export type ExecutionStatus = "running" | "success" | "filtered" | "failed";

export type AppDefinition = {
  id: Exclude<AppId, "tasks" | "filter">;
  name: string;
  description: string;
  category: "Google Workspace" | "Communication" | "Developer tools";
  availableTriggers: readonly string[];
  availableActions: readonly string[];
};

export type WorkflowNodeConfig = Record<string, string>;

export type WorkflowNodeData = {
  id: string;
  type: NodeType;
  appId: AppId;
  name: string;
  event: string;
  summary: string;
  configured: boolean;
  order: number;
  config: WorkflowNodeConfig;
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
};

export type Template = {
  id: string;
  name: string;
  description: string;
  category: "Productivity" | "Communication" | "Data" | "Developer tools";
  appIds: readonly AppId[];
  nodes: readonly WorkflowNodeData[];
  edges: readonly WorkflowEdge[];
};

export type Workflow = {
  id: string;
  templateId?: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  nodes: WorkflowNodeData[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
};

export type Connection = {
  appId: Exclude<AppId, "tasks" | "filter">;
  status: "connected" | "disconnected";
  accountLabel?: string;
  connectedAt?: string;
  simulated: true;
};

export type ExecutionStep = {
  id: string;
  nodeId: string;
  nodeName: string;
  status: "success" | "filtered" | "failed" | "skipped";
  durationMs: number;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  message: string;
};

export type Execution = {
  id: string;
  workflowId: string;
  workflowName: string;
  status: ExecutionStatus;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  simulated: true;
  steps: ExecutionStep[];
};
