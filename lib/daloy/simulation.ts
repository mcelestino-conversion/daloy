import type { Execution, ExecutionStep, Workflow, WorkflowNodeData } from "./types";
import { makeId } from "./workflows";

const sampleEmail = {
  from: "applicant@example.com",
  subject: "Job Application",
  date: "2026-10-25",
};

function triggerOutput(node: WorkflowNodeData): Record<string, unknown> {
  if (node.appId === "gmail") return { ...sampleEmail };
  if (node.appId === "google-sheets") return { row: 24, name: "Avery Santos", email: "avery@example.com", source: "Website" };
  if (node.appId === "google-calendar") return { title: "Portfolio review", startsAt: "2026-10-25T15:00:00.000Z", attendees: ["alex@example.com"] };
  if (node.appId === "webhooks") return { name: "Avery Santos", email: "avery@example.com", source: "Demo webhook" };
  if (node.appId === "tasks") return { title: "Review application", owner: "alex@example.com", due: "2026-10-25" };
  return { event: node.event, status: "simulated_trigger" };
}

function conditionMatches(input: Record<string, unknown>, config: Record<string, string>) {
  const actual = String(input[config.field ?? ""] ?? "").toLocaleLowerCase();
  const expected = (config.value ?? "").toLocaleLowerCase();
  if (config.operator === "equals") return actual === expected;
  if (config.operator === "not_contains") return !actual.includes(expected);
  return actual.includes(expected);
}

function actionOutput(node: WorkflowNodeData, input: Record<string, unknown>) {
  if (node.appId === "google-sheets") {
    const requested = (node.config.fields || "from,subject,date").split(",").map((field) => field.trim());
    return {
      action: "append_row",
      spreadsheet: node.config.spreadsheet || "Untitled spreadsheet",
      sheet: node.config.sheet || "Sheet1",
      row: requested.map((field) => input[field] ?? ""),
      status: "simulated_success",
      externalCallsMade: false,
    };
  }
  if (node.appId === "slack") {
    return { action: "send_message", channel: node.config.channel, message: node.config.message, status: "simulated_success", externalCallsMade: false };
  }
  if (node.appId === "gmail") {
    return { action: node.event === "Create draft" ? "create_draft" : "send_email", to: node.config.to, subject: node.config.subject, status: "simulated_success", externalCallsMade: false };
  }
  if (node.appId === "google-drive") {
    return { action: "create_file", folder: node.config.folder, filename: node.config.filename, status: "simulated_success", externalCallsMade: false };
  }
  return { action: node.event.toLocaleLowerCase().replaceAll(" ", "_"), status: "simulated_success", externalCallsMade: false };
}

export function simulateWorkflow(workflow: Workflow, now = new Date().toISOString(), id = makeId("run")): Execution {
  const steps: ExecutionStep[] = [];
  let payload: Record<string, unknown> = {};
  let filtered = false;

  for (const node of workflow.nodes) {
    if (filtered) {
      steps.push({
        id: `${id}-${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        status: "skipped",
        durationMs: 0,
        input: { ...payload },
        output: {},
        message: "Skipped because the previous condition did not match.",
      });
      continue;
    }

    const input = { ...payload };
    if (node.type === "trigger") {
      payload = triggerOutput(node);
      steps.push({ id: `${id}-${node.id}`, nodeId: node.id, nodeName: node.name, status: "success", durationMs: 180, input, output: { ...payload }, message: "Received deterministic sample data. No external call was made." });
      continue;
    }

    if (node.type === "condition") {
      const matches = conditionMatches(payload, node.config);
      filtered = !matches;
      steps.push({
        id: `${id}-${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        status: matches ? "success" : "filtered",
        durationMs: 24,
        input,
        output: { matched: matches, field: node.config.field, operator: node.config.operator, value: node.config.value },
        message: matches ? `Condition matched “${node.config.value}”.` : `Condition did not match “${node.config.value}”.`,
      });
      continue;
    }

    payload = actionOutput(node, payload);
    steps.push({ id: `${id}-${node.id}`, nodeId: node.id, nodeName: node.name, status: "success", durationMs: 320, input, output: { ...payload }, message: "Action simulated successfully. No external call was made." });
  }

  const durationMs = steps.reduce((total, step) => total + step.durationMs, 0);
  return {
    id,
    workflowId: workflow.id,
    workflowName: workflow.name,
    status: filtered ? "filtered" : "success",
    startedAt: now,
    finishedAt: new Date(new Date(now).getTime() + durationMs).toISOString(),
    durationMs,
    simulated: true,
    steps,
  };
}
