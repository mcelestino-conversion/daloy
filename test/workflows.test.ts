import assert from "node:assert/strict";
import test from "node:test";

import { workflowTemplates } from "../lib/daloy/templates";
import {
  createBlankWorkflow,
  createWorkflowFromTemplate,
  duplicateWorkflow,
  insertNode,
  moveNode,
  removeNode,
  updateNodeConfig,
} from "../lib/daloy/workflows";

const now = "2026-10-25T12:00:00.000Z";

test("template workflows are deep independent copies", () => {
  const template = workflowTemplates[0]!;
  const workflow = createWorkflowFromTemplate(template, { id: "flow-copy", now });

  workflow.nodes[0]!.config.mailbox = "Archive";
  workflow.nodes[0]!.name = "Changed";

  assert.equal(template.nodes[0]!.config.mailbox, "Inbox");
  assert.equal(template.nodes[0]!.name, "New Gmail message");
  assert.equal(workflow.id, "flow-copy");
  assert.equal(workflow.templateId, template.id);
});

test("blank and duplicated workflows receive independent IDs", () => {
  const blank = createBlankWorkflow({ id: "blank-1", now });
  const duplicate = duplicateWorkflow(blank, { id: "blank-2", now });

  assert.equal(blank.id, "blank-1");
  assert.equal(duplicate.id, "blank-2");
  assert.equal(duplicate.name, "Untitled flow copy");
  assert.notEqual(duplicate.nodes[0]!.id, blank.nodes[0]!.id);
});

test("insert, move, and remove always rebuild one sequential edge chain", () => {
  const workflow = createWorkflowFromTemplate(workflowTemplates[0]!, { id: "flow-chain", now });
  const inserted = insertNode(
    workflow,
    {
      id: "notify-action",
      order: 99,
      type: "action",
      appId: "slack",
      name: "Notify Slack",
      event: "Send channel message",
      summary: "Post to #hiring",
      configured: true,
      config: { channel: "#hiring", message: "New applicant" },
    },
    2,
    now,
  );
  const moved = moveNode(inserted, "notify-action", 3, now);
  const removed = removeNode(moved, "subject-filter", now);

  assert.deepEqual(removed.nodes.map((node) => node.order), [0, 1, 2]);
  assert.deepEqual(
    removed.edges.map((edge) => [edge.source, edge.target]),
    [
      [removed.nodes[0]!.id, removed.nodes[1]!.id],
      [removed.nodes[1]!.id, removed.nodes[2]!.id],
    ],
  );
});

test("updating node configuration updates its summary without mutating the source", () => {
  const workflow = createWorkflowFromTemplate(workflowTemplates[0]!, { id: "flow-config", now });
  const updated = updateNodeConfig(
    workflow,
    "subject-filter",
    { field: "subject", operator: "contains", value: "Portfolio" },
    "Subject contains “Portfolio”",
    now,
  );

  assert.equal(updated.nodes[1]!.config.value, "Portfolio");
  assert.equal(updated.nodes[1]!.summary, "Subject contains “Portfolio”");
  assert.equal(workflow.nodes[1]!.config.value, "Job Application");
});
