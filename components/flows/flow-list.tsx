"use client";

import { Copy, MoreHorizontal, Pause, Pencil, Play, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useWorkspace } from "@/components/providers/workspace-provider";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Workflow } from "@/lib/daloy/types";
import { duplicateWorkflow, nextDuplicateName } from "@/lib/daloy/workflows";

function formatDate(value?: string) {
  if (!value) return "Not simulated";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function FlowList() {
  const { workflows, saveWorkflow, deleteWorkflow, setWorkflowStatus } = useWorkspace();
  const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);
  const [notice, setNotice] = useState("");

  function duplicate(source: Workflow) {
    const copy = duplicateWorkflow(source);
    copy.name = nextDuplicateName(source.name, workflows.map((workflow) => workflow.name));
    saveWorkflow(copy);
    setNotice(`${copy.name} was created as a draft.`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteWorkflow(deleteTarget.id);
    setNotice(`${deleteTarget.name} was deleted from this browser.`);
    setDeleteTarget(null);
  }

  return (
    <div>
      <PageHeader title="My Flows" description="Create, activate, and manage the automations stored in this browser." actions={<><Link href="/templates" className="inline-flex h-10 items-center justify-center rounded-[9px] border border-border bg-elevated px-4 text-sm font-medium text-ivory transition hover:bg-surface">Browse templates</Link><Link href="/flows/new" className="inline-flex h-10 items-center justify-center gap-2 rounded-[9px] border border-sandstone bg-sandstone px-4 text-sm font-medium text-background transition hover:bg-ivory"><Plus className="size-4" />Create Flow</Link></>} />
      {notice ? <p role="status" className="mt-5 rounded-lg border border-[#5a5246] bg-[#302b24] px-4 py-3 text-sm text-sandstone">{notice}</p> : null}
      {workflows.length ? <div className="mt-7 overflow-hidden rounded-xl border border-border bg-surface">
        <div data-ui className="hidden grid-cols-[minmax(260px,1fr)_110px_120px_150px_180px] gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-[0.08em] text-taupe md:grid"><span>Flow</span><span>Status</span><span>Steps</span><span>Last run</span><span className="text-right">Actions</span></div>
        {workflows.map((workflow) => <article data-ui key={workflow.id} className="grid gap-4 border-b border-border p-5 last:border-0 md:grid-cols-[minmax(260px,1fr)_110px_120px_150px_180px] md:items-center">
          <div className="min-w-0"><Link href={`/flows/${workflow.id}`} className="font-medium text-ivory hover:text-sandstone">{workflow.name}</Link><p className="mt-1 truncate text-sm text-taupe">{workflow.description}</p></div>
          <div><StatusBadge status={workflow.status} /></div>
          <p className="text-sm text-taupe"><span className="md:hidden">Steps: </span>{workflow.nodes.length}</p>
          <p className="text-sm text-taupe">{formatDate(workflow.lastRunAt)}</p>
          <div className="flex items-center justify-start gap-1 md:justify-end">
            <Link href={`/flows/${workflow.id}`} className="grid size-10 place-items-center rounded-lg text-taupe hover:bg-elevated hover:text-ivory" aria-label={`Edit ${workflow.name}`}><Pencil className="size-4" /></Link>
            <Button size="icon" variant="ghost" onClick={() => setWorkflowStatus(workflow.id, workflow.status === "active" ? "paused" : "active")} aria-label={workflow.status === "active" ? `Pause ${workflow.name}` : `Activate ${workflow.name}`}>{workflow.status === "active" ? <Pause className="size-4" /> : <Play className="size-4" />}</Button>
            <Button size="icon" variant="ghost" onClick={() => duplicate(workflow)} aria-label={`Duplicate ${workflow.name}`}><Copy className="size-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(workflow)} aria-label={`Delete ${workflow.name}`}><Trash2 className="size-4" /></Button>
          </div>
        </article>)}
      </div> : <div className="mt-8"><EmptyState title="No flows yet" description="Start with a template or create a simple flow from scratch." action={<Link href="/templates" className="text-sm font-medium text-sandstone">Explore templates</Link>} /></div>}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete this flow?" description="This removes the local demo flow and cannot be undone.">
        <div className="p-6"><p className="text-sm text-taupe">You are deleting <span className="font-medium text-ivory">{deleteTarget?.name}</span>.</p><div className="mt-6 flex justify-end gap-2"><Button onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" onClick={confirmDelete}>Delete flow</Button></div></div>
      </Dialog>
    </div>
  );
}
