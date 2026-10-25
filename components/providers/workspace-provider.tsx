"use client";

import { createContext, use, useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";

import { createDemoSnapshot } from "@/lib/daloy/demo-data";
import { loadWorkspace, saveWorkspace, type WorkspaceSnapshot } from "@/lib/daloy/storage";
import type { AppId, Execution, Workflow, WorkflowStatus } from "@/lib/daloy/types";
import { reduceWorkspace } from "@/lib/daloy/workspace-state";

type WorkspaceContextValue = WorkspaceSnapshot & {
  hydrated: boolean;
  recovered: boolean;
  saveWorkflow: (workflow: Workflow) => void;
  deleteWorkflow: (workflowId: string) => void;
  setWorkflowStatus: (workflowId: string, status: WorkflowStatus) => void;
  toggleConnection: (appId: Exclude<AppId, "tasks" | "filter">) => void;
  addExecution: (execution: Execution) => void;
  resetDemo: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduceWorkspace, undefined, createDemoSnapshot);
  const [hydrated, setHydrated] = useState(false);
  const [recovered, setRecovered] = useState(false);

  useEffect(() => {
    const loaded = loadWorkspace(window.localStorage);
    dispatch({ type: "replace", snapshot: loaded.snapshot });
    setRecovered(loaded.recovered);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      saveWorkspace(window.localStorage, state);
    } catch {
      setRecovered(true);
    }
  }, [hydrated, state]);

  const saveWorkflow = useCallback((workflow: Workflow) => dispatch({ type: "save-workflow", workflow }), []);
  const deleteWorkflow = useCallback((workflowId: string) => dispatch({ type: "delete-workflow", workflowId }), []);
  const setWorkflowStatus = useCallback(
    (workflowId: string, status: WorkflowStatus) => dispatch({ type: "set-workflow-status", workflowId, status, now: new Date().toISOString() }),
    [],
  );
  const toggleConnection = useCallback(
    (appId: Exclude<AppId, "tasks" | "filter">) => dispatch({ type: "toggle-connection", appId, now: new Date().toISOString() }),
    [],
  );
  const addExecution = useCallback((execution: Execution) => dispatch({ type: "add-execution", execution }), []);
  const resetDemo = useCallback(() => {
    const snapshot = createDemoSnapshot();
    dispatch({ type: "replace", snapshot });
    setRecovered(false);
  }, []);

  const value = useMemo(
    () => ({ ...state, hydrated, recovered, saveWorkflow, deleteWorkflow, setWorkflowStatus, toggleConnection, addExecution, resetDemo }),
    [state, hydrated, recovered, saveWorkflow, deleteWorkflow, setWorkflowStatus, toggleConnection, addExecution, resetDemo],
  );

  return <WorkspaceContext value={value}>{children}</WorkspaceContext>;
}

export function useWorkspace() {
  const value = use(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return value;
}
