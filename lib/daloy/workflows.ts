import type { Template, Workflow, WorkflowEdge, WorkflowNodeData } from "./types";

type CreateOptions = { id?: string; now?: string };

export function makeId(prefix: string) {
  const value = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${value}`;
}

function timestamp(value?: string) {
  return value ?? new Date().toISOString();
}

export function buildSequentialEdges(nodes: readonly WorkflowNodeData[]): WorkflowEdge[] {
  return nodes.slice(0, -1).map((node, index) => ({
    id: `edge-${node.id}-${nodes[index + 1]!.id}`,
    source: node.id,
    target: nodes[index + 1]!.id,
  }));
}

function cloneNodes(nodes: readonly WorkflowNodeData[], renewIds = false) {
  const idMap = new Map<string, string>();
  const copied = nodes.map((node, index) => {
    const id = renewIds ? makeId(node.type) : node.id;
    idMap.set(node.id, id);
    return { ...node, id, order: index, config: { ...node.config } };
  });
  return { nodes: copied, idMap };
}

function withSequence(workflow: Workflow, nodes: readonly WorkflowNodeData[], now?: string): Workflow {
  const normalized = nodes.map((node, index) => ({ ...node, order: index, config: { ...node.config } }));
  return { ...workflow, nodes: normalized, edges: buildSequentialEdges(normalized), updatedAt: timestamp(now) };
}

export function createBlankWorkflow(options: CreateOptions = {}): Workflow {
  const now = timestamp(options.now);
  const triggerId = makeId("trigger");
  const nodes: WorkflowNodeData[] = [
    {
      id: triggerId,
      order: 0,
      type: "trigger",
      appId: "webhooks",
      name: "Choose a trigger",
      event: "Not configured",
      summary: "Select what starts this flow",
      configured: false,
      config: {},
    },
  ];
  return {
    id: options.id ?? makeId("flow"),
    name: "Untitled flow",
    description: "A new Daloy automation",
    status: "draft",
    nodes,
    edges: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function createWorkflowFromTemplate(template: Template, options: CreateOptions = {}): Workflow {
  const now = timestamp(options.now);
  const { nodes } = cloneNodes(template.nodes);
  return {
    id: options.id ?? makeId("flow"),
    templateId: template.id,
    name: template.name,
    description: template.description,
    status: "draft",
    nodes,
    edges: buildSequentialEdges(nodes),
    createdAt: now,
    updatedAt: now,
  };
}

export function duplicateWorkflow(workflow: Workflow, options: CreateOptions = {}): Workflow {
  const now = timestamp(options.now);
  const { nodes } = cloneNodes(workflow.nodes, true);
  return {
    ...workflow,
    id: options.id ?? makeId("flow"),
    name: `${workflow.name} copy`,
    status: "draft",
    nodes,
    edges: buildSequentialEdges(nodes),
    createdAt: now,
    updatedAt: now,
    lastRunAt: undefined,
  };
}

export function insertNode(workflow: Workflow, node: WorkflowNodeData, index: number, now?: string) {
  const next = [...workflow.nodes];
  next.splice(Math.max(0, Math.min(index, next.length)), 0, { ...node, config: { ...node.config } });
  return withSequence(workflow, next, now);
}

export function removeNode(workflow: Workflow, nodeId: string, now?: string) {
  return withSequence(workflow, workflow.nodes.filter((node) => node.id !== nodeId), now);
}

export function moveNode(workflow: Workflow, nodeId: string, targetIndex: number, now?: string) {
  const currentIndex = workflow.nodes.findIndex((node) => node.id === nodeId);
  if (currentIndex < 0) return workflow;
  const next = [...workflow.nodes];
  const [node] = next.splice(currentIndex, 1);
  next.splice(Math.max(0, Math.min(targetIndex, next.length)), 0, node!);
  return withSequence(workflow, next, now);
}

export function updateNodeConfig(
  workflow: Workflow,
  nodeId: string,
  config: Record<string, string>,
  summary: string,
  now?: string,
) {
  return withSequence(
    workflow,
    workflow.nodes.map((node) =>
      node.id === nodeId ? { ...node, config: { ...config }, summary, configured: true } : node,
    ),
    now,
  );
}

export function updateWorkflowDetails(workflow: Workflow, changes: Partial<Pick<Workflow, "name" | "description" | "status">>, now?: string) {
  return { ...workflow, ...changes, updatedAt: timestamp(now) };
}
