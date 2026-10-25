import assert from "node:assert/strict";
import test from "node:test";

import { createStepFromChoice, deriveNodeSummary, stepChoices, validateNodeConfig } from "../lib/daloy/node-config";
import type { WorkflowNodeData } from "../lib/daloy/types";

const condition: WorkflowNodeData = {
  id: "condition-1",
  order: 1,
  type: "condition",
  appId: "filter",
  name: "Filter message",
  event: "Text contains",
  summary: "",
  configured: false,
  config: { field: "subject", operator: "contains", value: "Portfolio" },
};

test("node summaries are derived from editable configuration", () => {
  assert.equal(deriveNodeSummary(condition), "Subject contains “Portfolio”");
  assert.equal(
    deriveNodeSummary({ ...condition, type: "action", appId: "google-sheets", event: "Append row", config: { spreadsheet: "Applicants", sheet: "Review", fields: "from,subject" } }),
    "Append from and subject to Applicants / Review",
  );
});

test("node validation returns concise missing-field errors", () => {
  assert.deepEqual(validateNodeConfig(condition), []);
  assert.deepEqual(validateNodeConfig({ ...condition, config: { field: "subject", operator: "contains", value: "" } }), ["Comparison value is required."]);
});

test("step choices create configured sequential node candidates", () => {
  assert.equal(stepChoices.length >= 6, true);
  const choice = stepChoices.find((item) => item.id === "slack-message")!;
  const node = createStepFromChoice(choice, "node-slack");

  assert.equal(node.id, "node-slack");
  assert.equal(node.type, "action");
  assert.equal(node.appId, "slack");
  assert.equal(node.config.channel, "#hiring");
});
