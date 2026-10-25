import assert from "node:assert/strict";
import test from "node:test";

import { appCatalog } from "../lib/daloy/catalog";
import { workflowTemplates } from "../lib/daloy/templates";

test("catalog exposes the seven supported demo applications", () => {
  assert.deepEqual(
    appCatalog.map((app) => app.name),
    ["Gmail", "Google Sheets", "Google Calendar", "Google Drive", "Slack", "Webhooks", "HTTP API"],
  );
  assert.equal(new Set(appCatalog.map((app) => app.id)).size, 7);
});

test("template catalog contains the six required immutable templates", () => {
  assert.deepEqual(
    workflowTemplates.map((template) => template.name),
    [
      "Gmail to Google Sheets",
      "Google Sheets to Slack",
      "Google Calendar to Gmail",
      "Gmail to Google Drive",
      "Webhook to Google Sheets",
      "Tasks to Gmail",
    ],
  );
  assert.equal(new Set(workflowTemplates.map((template) => template.id)).size, 6);
  assert.equal(Object.isFrozen(workflowTemplates), true);
  assert.equal(workflowTemplates.every((template) => Object.isFrozen(template.nodes)), true);
});

test("every template is a valid ordered single-path workflow", () => {
  for (const template of workflowTemplates) {
    assert.equal(template.nodes[0]?.type, "trigger", `${template.id} begins with a trigger`);
    assert.equal(template.nodes.at(-1)?.type, "action", `${template.id} ends with an action`);
    assert.equal(new Set(template.nodes.map((node) => node.id)).size, template.nodes.length);
    assert.deepEqual(
      template.nodes.map((node) => node.order),
      template.nodes.map((_, index) => index),
    );
    assert.equal(template.edges.length, Math.max(0, template.nodes.length - 1));
  }
});
