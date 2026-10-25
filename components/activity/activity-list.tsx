"use client";

import { ChevronRight, Clock3, FlaskConical } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useWorkspace } from "@/components/providers/workspace-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Execution } from "@/lib/daloy/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function ActivityList() {
  const { executions } = useWorkspace();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("run") ?? executions[0]?.id ?? null);
  const selected = executions.find((execution) => execution.id === selectedId) ?? executions[0] ?? null;
  return <div>
    <PageHeader title="Activity" description="Inspect deterministic simulation runs and the data passed through each configured step." />
    {executions.length ? <div className="mt-7 grid min-h-[620px] overflow-hidden rounded-xl border border-border bg-surface lg:grid-cols-[360px_minmax(0,1fr)]">
      <div data-ui className="border-b border-border lg:border-b-0 lg:border-r"><div data-ui className="border-b border-border px-5 py-4 text-xs font-medium uppercase tracking-[0.08em] text-taupe">Recent simulations</div>{executions.map((execution) => <button data-ui key={execution.id} onClick={() => setSelectedId(execution.id)} className={`flex w-full cursor-pointer items-start gap-3 border-b border-border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-sandstone ${selected?.id === execution.id ? "bg-elevated" : "hover:bg-elevated/60"}`}><span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-canvas text-sandstone"><FlaskConical className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-ivory">{execution.workflowName}</span><span className="mt-1 block text-xs text-taupe">{formatDate(execution.startedAt)}</span><span className="mt-2 flex items-center gap-2"><StatusBadge status={execution.status} /><span className="text-xs text-taupe">{execution.durationMs}ms</span></span></span><ChevronRight className="mt-2 size-4 text-taupe" /></button>)}</div>
      {selected ? <section className="min-w-0 p-5 sm:p-6"><div data-ui className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs uppercase tracking-[0.08em] text-taupe">Simulation details</p><h2 className="mt-2 text-lg font-semibold text-ivory">{selected.workflowName}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-taupe"><Clock3 className="size-3.5" />{formatDate(selected.startedAt)} · {selected.durationMs}ms</p></div><StatusBadge status={selected.status} /></div>
        <div className="mt-5 rounded-lg border border-[#5a5246] bg-[#302b24] px-4 py-3 text-sm text-sandstone">Simulated locally — no external API calls occurred.</div>
        <div className="mt-5 space-y-3">{selected.steps.map((step, index) => <details key={step.id} open={index === 0} className="rounded-xl border border-border bg-elevated"><summary className="cursor-pointer list-none p-4"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium text-ivory">{index + 1}. {step.nodeName}</p><p className="mt-1 text-xs text-taupe">{step.message} · {step.durationMs}ms</p></div><StatusBadge status={step.status} /></div></summary><div data-ui className="grid gap-3 border-t border-border p-4 xl:grid-cols-2"><div><p className="text-xs font-medium text-taupe">Input</p><pre className="mt-2 overflow-x-auto rounded-lg bg-canvas p-3 text-xs leading-5 text-ivory">{JSON.stringify(step.input, null, 2)}</pre></div><div><p className="text-xs font-medium text-taupe">Output</p><pre className="mt-2 overflow-x-auto rounded-lg bg-canvas p-3 text-xs leading-5 text-ivory">{JSON.stringify(step.output, null, 2)}</pre></div></div></details>)}</div>
      </section> : null}
    </div> : <div className="mt-8"><EmptyState title="No activity yet" description="Simulate a flow to create a detailed local execution record." /></div>}
  </div>;
}
