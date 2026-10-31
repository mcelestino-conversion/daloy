import type { AppDefinition } from "./types";

export const appCatalog: readonly AppDefinition[] = Object.freeze([
  {
    id: "gmail",
    name: "Gmail",
    description: "Trigger flows from messages and send email actions.",
    category: "Google Workspace",
    availableTriggers: ["New email", "New labeled email"],
    availableActions: ["Send email", "Create draft"],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Read rows and append structured workflow data.",
    category: "Google Workspace",
    availableTriggers: ["New row", "Updated row"],
    availableActions: ["Append row", "Update row"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Start flows from events and schedule calendar items.",
    category: "Google Workspace",
    availableTriggers: ["Event starting", "New event"],
    availableActions: ["Create event", "Update event"],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Organize files and save workflow outputs.",
    category: "Google Workspace",
    availableTriggers: ["New file"],
    availableActions: ["Create file", "Move file"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send team notifications and react to messages.",
    category: "Communication",
    availableTriggers: ["New channel message"],
    availableActions: ["Send channel message", "Send direct message"],
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description: "Receive structured demo events from another system.",
    category: "Developer tools",
    availableTriggers: ["Catch webhook"],
    availableActions: ["Return response"],
  },
  {
    id: "http-api",
    name: "HTTP API",
    description: "Model outbound requests without contacting a real service.",
    category: "Developer tools",
    availableTriggers: [],
    availableActions: ["Make request"],
  },
]);

export function getApp(appId: string) {
  return appCatalog.find((app) => app.id === appId);
}
