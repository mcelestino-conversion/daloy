import assert from "node:assert/strict";
import test from "node:test";

import { simulateWorkflow } from "../lib/daloy/simulation";
import { workflowTemplates } from "../lib/daloy/templates";
import { createWorkflowFromTemplate, updateNodeConfig } from "../lib/daloy/workflows";

const now = "2026-10-25T14:30:00.000Z";

test("simulation uses configured trigger, condition, and action values", () => {
  const workflow = createWorkflowFromTemplate(workflowTemplates[0]!, { id: "flow-run", now });
  const execution = simulateWorkflow(workflow, now, "run-1");

  assert.equal(execution.status, "success");
  assert.equal(execution.simulated, true);
  assert.equal(execution.steps.length, 3);
  assert.deepEqual(execution.steps[0]!.output, {
    from: "applicant@example.com", // taste-skill-ignore: acceptance-criteria sample payload
    subject: "Job Application",
    date: "2026-10-25",
  });
  assert.deepEqual(execution.steps[2]!.output, {
    action: "append_row",
    spreadsheet: "Job Applications",
    sheet: "Sheet1",
    row: ["applicant@example.com", "Job Application", "2026-10-25"], // taste-skill-ignore: acceptance-criteria sample output
    status: "simulated_success",
    externalCallsMade: false,
  });
});

test("a false condition stops later steps and records a filtered execution", () => {
  const workflow = createWorkflowFromTemplate(workflowTemplates[0]!, { id: "flow-filtered", now });
  const updated = updateNodeConfig(
    workflow,
    "subject-filter",
    { field: "subject", operator: "contains", value: "Invoice" },
    "Subject contains “Invoice”",
    now,
  );
  const execution = simulateWorkflow(updated, now, "run-2");

  assert.equal(execution.status, "filtered");
  assert.equal(execution.steps[1]!.status, "filtered");
  assert.equal(execution.steps[2]!.status, "skipped");
  assert.match(execution.steps[1]!.message, /Invoice/);
});
