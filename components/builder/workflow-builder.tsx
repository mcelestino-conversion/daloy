"use client";

import { ArrowLeft, Check, FlaskConical, LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useWorkspace } from "@/components/providers/workspace-provider";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { createStepFromChoice, type StepChoice } from "@/lib/daloy/node-config";
import { simulateWorkflow } from "@/lib/daloy/simulation";
import type { Execution, Workflow, WorkflowNodeData } from "@/lib/daloy/types";
import { insertNode, makeId, moveNode, removeNode } from "@/lib/daloy/workflows";
import { ConfigPanel } from "./config-panel";
import { ExecutionPanel } from "./execution-panel";
import { StepPicker } from "./step-picker";
import { WorkflowCanvas } from "./workflow-canvas";

export function WorkflowBuilder({ workflowId }: { workflowId: string }) {
  const { workflows, hydrated, saveWorkflow, addExecution } = useWorkspace();
  const stored = workflows.find((item) => item.id === workflowId);
  const [workflow, setWorkflow] = useState<Workflow | null>(stored ?? null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [insertAt, setInsertAt] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [simulation, setSimulation] = useState<Execution | null>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [logsOpen, setLogsOpen] = useState(false);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (!workflow && stored) {
      setWorkflow(stored);
      setSelectedNodeId(stored.nodes[0]?.id ?? null);
    }
  }, [stored, workflow]);

  const selectedNode = useMemo(() => workflow?.nodes.find((node) => node.id === selectedNodeId) ?? null, [workflow, selectedNodeId]);
  const selectedIndex = workflow?.nodes.findIndex((node) => node.id === selectedNodeId) ?? -1;
  const openPicker = useCallback((index: number) => setInsertAt(index), []);

  if (!hydrated && !workflow) return <div className="grid h-full place-items-center"><LoaderCircle className="size-5 animate-spin text-sandstone" aria-label="Loading workflow" /></div>;
  if (!workflow) return <div className="grid h-full place-items-center p-6"><EmptyState title="Flow not found" description="This workflow may have been removed from your workspace." action={<Link href="/flows" className="text-sm text-sandstone">Return to My Flows</Link>} /></div>;
  const currentWorkflow = workflow;

  function updateNode(nextNode: WorkflowNodeData) {
    setWorkflow((current) => current ? { ...current, nodes: current.nodes.map((node) => node.id === nextNode.id ? nextNode : node), updatedAt: new Date().toISOString() } : current);
  }

  function addStep(choice: StepChoice) {
    if (insertAt === null) return;
    const next = insertNode(currentWorkflow, createStepFromChoice(choice, makeId(choice.type)), insertAt);
    setWorkflow(next);
    setSelectedNodeId(next.nodes[insertAt]?.id ?? null);
    setInsertAt(null);
    setNotice("Step added. Save when you are ready.");
  }

  function deleteSelected() {
    if (!selectedNode) return;
    const next = removeNode(currentWorkflow, selectedNode.id);
    setWorkflow(next);
    setSelectedNodeId(next.nodes[Math.min(selectedIndex, next.nodes.length - 1)]?.id ?? null);
  }

  function reorder(direction: -1 | 1) {
    if (!selectedNode) return;
    setWorkflow(moveNode(currentWorkflow, selectedNode.id, selectedIndex + direction));
  }

  async function save() {
    setNotice("Saving…");
    if (await saveWorkflow(currentWorkflow)) setNotice("Draft saved.");
    else setNotice("Save failed. Please try again.");
  }

  async function toggleActive() {
    const next: Workflow = { ...currentWorkflow, status: currentWorkflow.status === "active" ? "paused" : "active", updatedAt: new Date().toISOString() };
    if (!await saveWorkflow(next)) return;
    setWorkflow(current => current ? { ...current, status: next.status, updatedAt: current === currentWorkflow ? next.updatedAt : current.updatedAt } : current);
    setNotice(next.status === "active" ? "Flow activated in demo mode." : "Flow paused.");
  }

  async function runSimulation() {
    const execution = simulateWorkflow(currentWorkflow);
    const updated: Workflow = { ...currentWorkflow, lastRunAt: execution.finishedAt, updatedAt: execution.finishedAt };
    if (!await saveWorkflow(updated)) return;
    if (!await addExecution(execution)) return;
    setWorkflow(current => current ? { ...current, lastRunAt: updated.lastRunAt, updatedAt: current === currentWorkflow ? updated.updatedAt : current.updatedAt } : current);
    setSimulation(execution);
    setLogsOpen(true);
    setSimulating(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setActiveStep(execution.steps.length);
      setSimulating(false);
      return;
    }
    setActiveStep(0);
    execution.steps.forEach((_, index) => window.setTimeout(() => {
      setActiveStep(index + 1);
      if (index === execution.steps.length - 1) setSimulating(false);
    }, 420 * (index + 1)));
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-sidebar px-3 sm:px-4">{/* taste-skill-ignore: builder toolbar boundary */}
        <Link href="/flows" className="grid size-10 shrink-0 place-items-center rounded-lg text-taupe transition hover:bg-surface hover:text-ivory focus-visible:outline-2 focus-visible:outline-sandstone" aria-label="Back to My Flows"><ArrowLeft className="size-4" aria-hidden="true" /></Link>
        <div className="min-w-0 flex-1"><h1><input aria-label="Flow name" className="w-full max-w-md truncate bg-transparent text-sm font-semibold text-ivory focus:outline-none" value={workflow.name} onChange={(event) => setWorkflow({ ...workflow, name: event.target.value, updatedAt: new Date().toISOString() })} /></h1><p className="mt-0.5 text-xs capitalize text-taupe">{workflow.status} · {workflow.nodes.length} steps</p></div>
        {notice ? <span role="status" className="hidden items-center gap-1.5 text-xs text-taupe xl:flex"><Check className="size-3.5 text-sandstone" aria-hidden="true" />{notice}</span> : null}
        <Button size="sm" className="hidden sm:inline-flex" onClick={toggleActive}>{workflow.status === "active" ? "Pause" : "Activate"}</Button>
        <Button size="sm" className="hidden sm:inline-flex" onClick={save}><Save className="size-4" aria-hidden="true" />Save</Button>
        <Button size="sm" variant="primary" onClick={runSimulation} loading={simulating}><FlaskConical className="size-4" aria-hidden="true" /><span className="hidden sm:inline">Simulate</span></Button>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-h-0 overflow-y-auto bg-canvas">
          <WorkflowCanvas workflow={workflow} selectedNodeId={selectedNodeId} onSelect={setSelectedNodeId} onInsert={openPicker} execution={simulation} activeStep={activeStep} />
          <div className="space-y-3 p-4 lg:hidden">
            <p className="mb-4 text-sm text-taupe">Tap a step to configure it. Steps run from top to bottom.</p>
            {workflow.nodes.map((node, index) => <div key={node.id}><button onClick={() => setSelectedNodeId(node.id)} className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left focus-visible:outline-2 focus-visible:outline-sandstone"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-elevated text-sandstone"><AppIcon appId={node.appId} /></span><span className="min-w-0 flex-1"><span className="block text-xs capitalize text-taupe">{index + 1}. {node.type}</span><span className="mt-1 block text-sm font-medium text-ivory">{node.name}</span><span className="mt-1 block text-xs leading-5 text-taupe">{node.summary}</span></span></button><button onClick={() => setInsertAt(index + 1)} className="mx-auto my-2 block h-9 cursor-pointer px-4 text-xs text-sandstone">+ Add step</button></div>)}
          </div>
        </div>
        {selectedNode ? <ConfigPanel node={selectedNode} onChange={updateNode} onClose={() => setSelectedNodeId(null)} onRemove={deleteSelected} onMove={reorder} canMoveUp={selectedIndex > 1} canMoveDown={selectedIndex >= 0 && selectedIndex < workflow.nodes.length - 1} /> : <ConfigPanel node={null} onChange={() => undefined} onClose={() => undefined} onRemove={() => undefined} onMove={() => undefined} canMoveUp={false} canMoveDown={false} />}
      </div>

      <ExecutionPanel execution={simulation} open={logsOpen} onToggle={() => setLogsOpen((value) => !value)} activeStep={activeStep} />
      <StepPicker open={insertAt !== null} onClose={() => setInsertAt(null)} onPick={addStep} />
    </div>
  );
}
