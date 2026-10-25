import assert from "node:assert/strict";
import test from "node:test";

import { filterTemplates, workflowTemplates } from "../lib/daloy/templates";

test("template search is case-insensitive across names, descriptions, and apps", () => {
  assert.deepEqual(filterTemplates(workflowTemplates, "GMAIL", "All").map((item) => item.id), ["gmail-to-sheets", "calendar-to-gmail", "gmail-to-drive", "tasks-to-gmail"]);
  assert.deepEqual(filterTemplates(workflowTemplates, "payload", "All").map((item) => item.id), ["webhook-to-sheets"]);
});

test("template search and category filters intersect", () => {
  assert.deepEqual(filterTemplates(workflowTemplates, "slack", "Communication").map((item) => item.id), ["sheets-to-slack"]);
  assert.deepEqual(filterTemplates(workflowTemplates, "slack", "Productivity"), []);
});

test("template filtering returns an empty list when nothing matches", () => {
  assert.deepEqual(filterTemplates(workflowTemplates, "salesforce", "All"), []);
});
