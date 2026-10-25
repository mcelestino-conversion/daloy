import type { Template, WorkflowNodeData } from "./types";

function node(
  id: string,
  order: number,
  type: WorkflowNodeData["type"],
  appId: WorkflowNodeData["appId"],
  name: string,
  event: string,
  summary: string,
  config: Record<string, string>,
): WorkflowNodeData {
  return { id, order, type, appId, name, event, summary, configured: true, config };
}

function makeTemplate(input: Omit<Template, "edges">): Template {
  return {
    ...input,
    nodes: Object.freeze(input.nodes.map((item) => Object.freeze({ ...item, config: Object.freeze({ ...item.config }) }))),
    edges: Object.freeze(
      input.nodes.slice(0, -1).map((item, index) =>
        Object.freeze({ id: `${input.id}-edge-${index}`, source: item.id, target: input.nodes[index + 1]!.id }),
      ),
    ),
  };
}

export const workflowTemplates: readonly Template[] = Object.freeze([
  makeTemplate({
    id: "gmail-to-sheets",
    name: "Gmail to Google Sheets",
    description: "Capture matching Gmail messages as structured rows in a spreadsheet.",
    category: "Productivity",
    appIds: ["gmail", "google-sheets"],
    nodes: [
      node("gmail-trigger", 0, "trigger", "gmail", "New Gmail message", "New email", "Watch the inbox for new messages", { mailbox: "Inbox" }),
      node("subject-filter", 1, "condition", "filter", "Match email subject", "Text contains", "Subject contains “Job Application”", { field: "subject", operator: "contains", value: "Job Application" }),
      node("sheets-action", 2, "action", "google-sheets", "Append spreadsheet row", "Append row", "Add sender, subject, and date", { spreadsheet: "Job Applications", sheet: "Sheet1", fields: "from,subject,date" }),
    ],
  }),
  makeTemplate({
    id: "sheets-to-slack",
    name: "Google Sheets to Slack",
    description: "Notify a Slack channel whenever a new spreadsheet row appears.",
    category: "Communication",
    appIds: ["google-sheets", "slack"],
    nodes: [
      node("sheet-row-trigger", 0, "trigger", "google-sheets", "New spreadsheet row", "New row", "Watch the Leads spreadsheet", { spreadsheet: "Leads", sheet: "New leads" }),
      node("slack-row-action", 1, "action", "slack", "Send Slack message", "Send channel message", "Post the row in #sales", { channel: "#sales", message: "New lead: {{name}}" }),
    ],
  }),
  makeTemplate({
    id: "calendar-to-gmail",
    name: "Google Calendar to Gmail",
    description: "Send a prepared reminder before a calendar event begins.",
    category: "Productivity",
    appIds: ["google-calendar", "gmail"],
    nodes: [
      node("calendar-trigger", 0, "trigger", "google-calendar", "Event starting", "Event starting", "15 minutes before an event", { leadTime: "15 minutes" }),
      node("gmail-reminder-action", 1, "action", "gmail", "Send reminder email", "Send email", "Email the event attendees", { to: "Event attendees", subject: "Your event starts soon" }),
    ],
  }),
  makeTemplate({
    id: "gmail-to-drive",
    name: "Gmail to Google Drive",
    description: "Save email attachments into an organized Drive folder.",
    category: "Productivity",
    appIds: ["gmail", "google-drive"],
    nodes: [
      node("attachment-trigger", 0, "trigger", "gmail", "Email with attachment", "New email", "Watch for messages with files", { mailbox: "Inbox", hasAttachment: "true" }),
      node("drive-file-action", 1, "action", "google-drive", "Save attachment", "Create file", "Store files in Email uploads", { folder: "Email uploads", filename: "{{attachment.name}}" }),
    ],
  }),
  makeTemplate({
    id: "webhook-to-sheets",
    name: "Webhook to Google Sheets",
    description: "Turn incoming webhook payloads into spreadsheet rows.",
    category: "Developer tools",
    appIds: ["webhooks", "google-sheets"],
    nodes: [
      node("webhook-trigger", 0, "trigger", "webhooks", "Catch webhook", "Catch webhook", "Receive a demo JSON payload", { path: "/new-submission" }),
      node("webhook-sheets-action", 1, "action", "google-sheets", "Append payload row", "Append row", "Write name, email, and source", { spreadsheet: "Submissions", sheet: "Responses", fields: "name,email,source" }),
    ],
  }),
  makeTemplate({
    id: "tasks-to-gmail",
    name: "Tasks to Gmail",
    description: "Send an email when a task reaches its due date.",
    category: "Productivity",
    appIds: ["tasks", "gmail"],
    nodes: [
      node("task-trigger", 0, "trigger", "tasks", "Task due", "Task due", "Watch tasks due today", { list: "My tasks", due: "Today" }),
      node("task-email-action", 1, "action", "gmail", "Send task reminder", "Send email", "Email the task owner", { to: "Task owner", subject: "Task due: {{task.title}}" }),
    ],
  }),
]);

export const templateCategories = ["All", "Productivity", "Communication", "Data", "Developer tools"] as const;
