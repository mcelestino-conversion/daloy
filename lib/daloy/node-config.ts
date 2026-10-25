import type { AppId, NodeType, WorkflowNodeData } from "./types";

export type StepChoice = {
  id: string;
  type: Exclude<NodeType, "trigger">;
  appId: AppId;
  name: string;
  event: string;
  description: string;
  config: Record<string, string>;
};

export const stepChoices: readonly StepChoice[] = [
  { id: "condition", type: "condition", appId: "filter", name: "Filter data", event: "Text contains", description: "Continue only when a field matches.", config: { field: "subject", operator: "contains", value: "Job Application" } },
  { id: "sheets-row", type: "action", appId: "google-sheets", name: "Append spreadsheet row", event: "Append row", description: "Add selected fields to a sheet.", config: { spreadsheet: "Job Applications", sheet: "Sheet1", fields: "from,subject,date" } },
  { id: "slack-message", type: "action", appId: "slack", name: "Send Slack message", event: "Send channel message", description: "Notify a channel with workflow data.", config: { channel: "#hiring", message: "New applicant: {{from}}" } },
  { id: "gmail-send", type: "action", appId: "gmail", name: "Send Gmail message", event: "Send email", description: "Send a prepared email to a recipient.", config: { to: "applicant@example.com", subject: "Application received" } },
  { id: "drive-file", type: "action", appId: "google-drive", name: "Create Drive file", event: "Create file", description: "Save workflow data as a file.", config: { folder: "Applications", filename: "{{subject}}.txt" } },
  { id: "http-request", type: "action", appId: "http-api", name: "Make HTTP request", event: "Make request", description: "Simulate sending data to an endpoint.", config: { method: "POST", url: "https://example.com/webhook" } },
];

function humanize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1).replaceAll("_", " ") : "Field";
}

export function deriveNodeSummary(node: WorkflowNodeData) {
  const config = node.config;
  if (node.type === "condition") return `${humanize(config.field ?? "field")} ${(config.operator ?? "contains").replaceAll("_", " ")} “${config.value ?? ""}”`;
  if (node.type === "trigger") {
    if (node.appId === "gmail") return `Watch ${config.mailbox || "Inbox"} for new messages`;
    if (node.appId === "webhooks") return `Receive payloads at ${config.path || "/new-event"}`;
    return node.summary || node.event;
  }
  if (node.appId === "google-sheets") {
    const fields = (config.fields || "selected fields").split(",").map((field) => field.trim()).filter(Boolean);
    const fieldLabel = fields.length > 1 ? `${fields.slice(0, -1).join(", ")} and ${fields.at(-1)}` : fields[0];
    return `Append ${fieldLabel} to ${config.spreadsheet || "a spreadsheet"} / ${config.sheet || "Sheet1"}`;
  }
  if (node.appId === "slack") return `Post to ${config.channel || "a channel"}`;
  if (node.appId === "gmail") return `Email ${config.to || "a recipient"}`;
  if (node.appId === "google-drive") return `Create ${config.filename || "a file"} in ${config.folder || "Drive"}`;
  if (node.appId === "http-api") return `${config.method || "POST"} ${config.url || "an endpoint"}`;
  return node.summary || node.event;
}

export function validateNodeConfig(node: WorkflowNodeData) {
  const errors: string[] = [];
  const require = (key: string, message: string) => {
    if (!node.config[key]?.trim()) errors.push(message);
  };
  if (node.type === "condition") {
    require("field", "Field is required.");
    require("operator", "Operator is required.");
    require("value", "Comparison value is required.");
  } else if (node.appId === "google-sheets") {
    require("spreadsheet", "Spreadsheet is required.");
    require("sheet", "Sheet is required.");
    require("fields", "At least one field is required.");
  } else if (node.appId === "slack") {
    require("channel", "Channel is required.");
    require("message", "Message is required.");
  } else if (node.appId === "gmail" && node.type === "action") {
    require("to", "Recipient is required.");
    require("subject", "Subject is required.");
  } else if (node.appId === "http-api") {
    require("method", "Method is required.");
    require("url", "URL is required.");
  }
  return errors;
}

export function createStepFromChoice(choice: StepChoice, id: string): WorkflowNodeData {
  const draft: WorkflowNodeData = { id, order: 0, type: choice.type, appId: choice.appId, name: choice.name, event: choice.event, summary: "", configured: true, config: { ...choice.config } };
  return { ...draft, summary: deriveNodeSummary(draft) };
}
