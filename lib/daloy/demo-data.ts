import { appCatalog } from "./catalog";
import { simulateWorkflow } from "./simulation";
import { workflowTemplates } from "./templates";
import type { Connection, Execution, Workflow } from "./types";
import { createWorkflowFromTemplate } from "./workflows";
import type { WorkspaceSnapshot } from "./storage";

const seededAt = "2026-10-25T14:30:00.000Z";

function seededWorkflows(): Workflow[] {
  const applications = createWorkflowFromTemplate(workflowTemplates[0]!, { id: "demo-applications-flow", now: seededAt });
  applications.name = "Track job applications";
  applications.status = "active";
  applications.lastRunAt = seededAt;

  const leads = createWorkflowFromTemplate(workflowTemplates[1]!, { id: "demo-leads-flow", now: "2026-10-24T09:20:00.000Z" });
  leads.name = "Share new leads with sales";
  leads.status = "paused";

  return [applications, leads];
}

function seededConnections(): Connection[] {
  return appCatalog.map((app, index) =>
    index < 2
      ? {
          appId: app.id,
          status: "connected",
          accountLabel: "Demo workspace",
          connectedAt: seededAt,
          simulated: true,
        }
      : { appId: app.id, status: "disconnected", simulated: true },
  );
}

function seededExecutions(workflows: Workflow[]): Execution[] {
  const successful = simulateWorkflow(workflows[0]!, seededAt, "demo-run-success");
  return [successful];
}

export function createDemoSnapshot(): WorkspaceSnapshot {
  const workflows = seededWorkflows();
  return {
    version: 1,
    workflows,
    connections: seededConnections(),
    executions: seededExecutions(workflows),
  };
}
