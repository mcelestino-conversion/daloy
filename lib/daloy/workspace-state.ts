import type { WorkspaceSnapshot } from "./storage";
import type { AppId, Execution, Workflow, WorkflowStatus } from "./types";

export type WorkspaceAction =
  | { type: "replace"; snapshot: WorkspaceSnapshot }
  | { type: "save-workflow"; workflow: Workflow }
  | { type: "delete-workflow"; workflowId: string }
  | { type: "set-workflow-status"; workflowId: string; status: WorkflowStatus; now: string }
  | { type: "toggle-connection"; appId: Exclude<AppId, "tasks" | "filter">; now: string }
  | { type: "add-execution"; execution: Execution };

export function reduceWorkspace(state: WorkspaceSnapshot, action: WorkspaceAction): WorkspaceSnapshot {
  if (action.type === "replace") return action.snapshot;
  if (action.type === "save-workflow") {
    const exists = state.workflows.some((workflow) => workflow.id === action.workflow.id);
    return {
      ...state,
      workflows: exists
        ? state.workflows.map((workflow) => (workflow.id === action.workflow.id ? action.workflow : workflow))
        : [action.workflow, ...state.workflows],
    };
  }
  if (action.type === "delete-workflow") {
    return { ...state, workflows: state.workflows.filter((workflow) => workflow.id !== action.workflowId) };
  }
  if (action.type === "set-workflow-status") {
    return {
      ...state,
      workflows: state.workflows.map((workflow) =>
        workflow.id === action.workflowId ? { ...workflow, status: action.status, updatedAt: action.now } : workflow,
      ),
    };
  }
  if (action.type === "toggle-connection") {
    return {
      ...state,
      connections: state.connections.map((connection) => {
        if (connection.appId !== action.appId) return connection;
        return connection.status === "connected"
          ? { appId: connection.appId, status: "disconnected", simulated: true }
          : { appId: connection.appId, status: "connected", accountLabel: "Demo workspace", connectedAt: action.now, simulated: true };
      }),
    };
  }
  return { ...state, executions: [action.execution, ...state.executions] };
}
