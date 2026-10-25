"use client";

import { ArrowRight, Clock3, Library, Plus, Route } from "lucide-react";
import Link from "next/link";

import { AppIcon } from "@/components/ui/app-icon";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { workflowTemplates } from "@/lib/daloy/templates";

export function Dashboard() {
  const { workflows, executions, hydrated, recovered } = useWorkspace();
  const activeCount = workflows.filter((workflow) => workflow.status === "active").length;
  const recentFlows = [...workflows].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);
  const recommended = workflowTemplates.slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader title="Workspace overview" description="Build, test, and refine automations before connecting a live service." actions={<><Link href="/templates" className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-border bg-elevated px-4 text-sm font-medium text-ivory transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-sandstone"><Library className="size-4" aria-hidden="true" />Browse templates</Link><Link href="/flows/new" className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-sandstone bg-sandstone px-4 text-sm font-medium text-background transition hover:bg-ivory focus-visible:outline-2 focus-visible:outline-sandstone"><Plus className="size-4" aria-hidden="true" />Create flow</Link></>} />

      {recovered ? <div role="status" className="rounded-lg border border-[#5a5246] bg-[#302b24] px-4 py-3 text-sm text-sandstone">Daloy restored the demo workspace because saved browser data was unavailable.</div> : null}

      <section aria-labelledby="workspace-snapshot" className="rounded-xl border border-border bg-surface">
        <h2 id="workspace-snapshot" className="sr-only">Workspace snapshot</h2>
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[{ label: "Total flows", value: workflows.length }, { label: "Active flows", value: activeCount }, { label: "Simulated runs", value: executions.length }].map((item) => <div key={item.label} className="px-5 py-5"><p className="text-sm text-taupe">{item.label}</p><p className="mt-2 text-[28px] font-medium tabular-nums text-ivory">{hydrated ? item.value : "—"}</p></div>)}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <section aria-labelledby="recent-flows-heading" className="rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between px-5 py-4"><div><h2 id="recent-flows-heading" className="font-semibold text-ivory">Recently edited</h2><p className="mt-1 text-sm text-taupe">Your latest workflow drafts and active flows.</p></div><Link className="inline-flex items-center gap-1 text-sm text-sandstone hover:text-ivory" href="/flows">View all<ArrowRight className="size-4" aria-hidden="true" /></Link></div>
          <div className="border-t border-border">
            {recentFlows.map((workflow) => <Link key={workflow.id} href={`/flows/${workflow.id}`} className="flex min-h-16 items-center gap-4 border-b border-border px-5 py-3 transition last:border-b-0 hover:bg-elevated focus-visible:outline-2 focus-visible:outline-sandstone"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-elevated text-sandstone"><Route className="size-4" aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-ivory">{workflow.name}</span><span className="mt-1 block text-xs text-taupe">{workflow.nodes.length} steps · Edited {new Date(workflow.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></span><StatusBadge status={workflow.status} /></Link>)}
          </div>
        </section>

        <section aria-labelledby="recent-runs-heading" className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-start justify-between"><div><h2 id="recent-runs-heading" className="font-semibold text-ivory">Recent simulations</h2><p className="mt-1 text-sm text-taupe">No external calls occurred.</p></div><Clock3 className="size-4 text-taupe" aria-hidden="true" /></div>
          <div className="mt-5 space-y-3">
            {executions.slice(0, 4).map((execution) => <Link href={`/activity?run=${execution.id}`} key={execution.id} className="block rounded-lg bg-elevated px-4 py-3 transition hover:bg-[#302e2a] focus-visible:outline-2 focus-visible:outline-sandstone"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-medium text-ivory">{execution.workflowName}</p><StatusBadge status={execution.status === "running" ? "filtered" : execution.status} /></div><p className="mt-2 text-xs text-taupe">{execution.steps.length} steps · {execution.durationMs} ms</p></Link>)}
          </div>
        </section>
      </div>

      <section aria-labelledby="recommended-heading">
        <div className="mb-4"><h2 id="recommended-heading" className="text-lg font-semibold text-ivory">Recommended starting points</h2><p className="mt-1 text-sm text-taupe">Begin with a proven pattern, then make it yours.</p></div>
        <div className="grid gap-4 md:grid-cols-3">
          {recommended.map((template) => <Link key={template.id} href={`/templates?template=${template.id}`} className="group rounded-xl border border-border bg-surface p-5 transition hover:border-[#5a564f] hover:bg-elevated focus-visible:outline-2 focus-visible:outline-sandstone"><div className="flex items-center gap-2 text-taupe">{template.appIds.slice(0, 2).map((appId) => <span key={appId} className="grid size-8 place-items-center rounded-lg bg-elevated"><AppIcon appId={appId} /></span>)}</div><h3 className="mt-5 text-sm font-semibold text-ivory">{template.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-taupe">{template.description}</p><span className="mt-5 inline-flex items-center gap-1 text-sm text-sandstone">Preview <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" /></span></Link>)}
        </div>
      </section>
    </div>
  );
}
