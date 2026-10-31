"use client";

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { STORAGE_KEY, type WorkspaceSnapshot } from "@/lib/daloy/storage";
import { createDemoSnapshot } from "@/lib/daloy/demo-data";
import type { AppId, Execution, Workflow, WorkflowStatus } from "@/lib/daloy/types";
import type { WorkspaceAction } from "@/lib/daloy/workspace-state";
import { loadDatabaseWorkspace, mutateDatabaseWorkspace } from "@/lib/server/workspace-actions";

type WorkspaceContextValue = WorkspaceSnapshot & {
  hydrated: boolean;
  recovered: boolean;
  saveWorkflow: (workflow: Workflow) => Promise<boolean>;
  deleteWorkflow: (workflowId: string) => Promise<boolean>;
  setWorkflowStatus: (workflowId: string, status: WorkflowStatus) => Promise<boolean>;
  toggleConnection: (appId: Exclude<AppId, "tasks" | "filter">) => Promise<boolean>;
  addExecution: (execution: Execution) => Promise<boolean>;
  resetDemo: () => Promise<boolean>;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceSnapshot>({ version: 1, workflows: [], connections: [], executions: [] });
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(0);
  const initialization = useRef<ReturnType<typeof loadDatabaseWorkspace> | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    if (!initialization.current) {
      let raw: string | null = null;
      try { raw = window.localStorage.getItem(STORAGE_KEY); } catch { /* Browser storage may be disabled. */ }
      initialization.current = loadDatabaseWorkspace(raw);
    }
    initialization.current.then(result => {
      if (!active) return;
      if (!result.ok) { setError(result.error); return; }
      setState(result.snapshot);
      setHydrated(true);
    }).catch(() => {
      if (active) setError("Could not connect to your workspace. Please retry.");
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!pending) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [pending]);

  const mutate = useCallback((action: WorkspaceAction): Promise<boolean> => {
    setPending(count => count + 1);
    const operation = queue.current.then(async () => {
      try {
        const result = await mutateDatabaseWorkspace(action);
        if (!result.ok) { setError(result.error); return false; }
        setState(result.snapshot);
        return true;
      } catch {
        setError("Your change could not be saved. Please try it again.");
        return false;
      } finally {
        setPending(count => count - 1);
      }
    });
    queue.current = operation;
    return operation;
  }, []);

  const saveWorkflow = useCallback((workflow: Workflow) => mutate({ type: "save-workflow", workflow }), [mutate]);
  const deleteWorkflow = useCallback((workflowId: string) => mutate({ type: "delete-workflow", workflowId }), [mutate]);
  const setWorkflowStatus = useCallback((workflowId: string, status: WorkflowStatus) => mutate({ type: "set-workflow-status", workflowId, status, now: new Date().toISOString() }), [mutate]);
  const toggleConnection = useCallback((appId: Exclude<AppId, "tasks" | "filter">) => mutate({ type: "toggle-connection", appId, now: new Date().toISOString() }), [mutate]);
  const addExecution = useCallback((execution: Execution) => mutate({ type: "add-execution", execution }), [mutate]);
  const resetDemo = useCallback(() => mutate({ type: "replace", snapshot: createDemoSnapshot() }), [mutate]);

  const value = useMemo(
    () => ({ ...state, hydrated, recovered: false, saveWorkflow, deleteWorkflow, setWorkflowStatus, toggleConnection, addExecution, resetDemo }),
    [state, hydrated, saveWorkflow, deleteWorkflow, setWorkflowStatus, toggleConnection, addExecution, resetDemo],
  );

  if (!hydrated) return <div className="grid min-h-dvh place-items-center bg-background p-6 text-ivory"><div role={error ? "alert" : "status"} className="text-center"><p>{error ?? "Loading your workspace…"}</p>{error ? <button className="mt-4 rounded-lg border border-border px-4 py-2" onClick={() => window.location.reload()}>Retry</button> : null}</div></div>;

  return <WorkspaceContext value={value}>
    {error ? <div role="alert" className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-sidebar p-4 text-center text-sm text-ivory">{error}<button className="ml-4 underline" onClick={() => setError(null)}>Dismiss</button></div> : pending ? <div role="status" className="fixed bottom-4 right-4 z-[100] rounded-lg border border-border bg-sidebar px-4 py-2 text-sm text-ivory">Saving…</div> : null}
    {children}
  </WorkspaceContext>;
}

export function useWorkspace() {
  const value = use(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return value;
}
