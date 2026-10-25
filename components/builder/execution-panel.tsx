"use client";

import { ChevronDown, ChevronUp, FlaskConical } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import type { Execution } from "@/lib/daloy/types";

export function ExecutionPanel({ execution, open, onToggle, activeStep }: { execution: Execution | null; open: boolean; onToggle: () => void; activeStep: number }) {
  return (
    <section className={`${open ? "h-[270px]" : "h-11"} shrink-0 border-t border-border bg-sidebar transition-[height] duration-200`} aria-label="Simulation results">
      <button onClick={onToggle} className="flex h-11 w-full cursor-pointer items-center justify-between px-4 text-left hover:bg-surface focus-visible:outline-2 focus-visible:outline-sandstone">
        <span className="flex items-center gap-2 text-sm font-medium text-ivory"><FlaskConical className="size-4 text-sandstone" aria-hidden="true" />Simulation results {execution ? <span className="text-xs font-normal text-taupe">· {execution.steps.length} steps · no external calls</span> : null}</span>
        {open ? <ChevronDown className="size-4 text-taupe" aria-hidden="true" /> : <ChevronUp className="size-4 text-taupe" aria-hidden="true" />}
      </button>
      {open ? <div className="h-[226px] overflow-auto border-t border-border p-4">{execution ? <div className="grid gap-3 lg:grid-cols-3">{execution.steps.map((step, index) => <details key={step.id} className={`rounded-lg border bg-surface p-3 ${activeStep === index ? "border-sandstone" : "border-border"}`}><summary className="cursor-pointer list-none"><div className="flex items-center justify-between gap-3"><span className="text-sm font-medium text-ivory">{index + 1}. {step.nodeName}</span><StatusBadge status={step.status} /></div><p className="mt-2 text-xs leading-5 text-taupe">{step.message}</p></summary><div className="mt-3 grid gap-2"><div><p className="text-xs text-taupe">Input</p><pre className="mt-1 overflow-x-auto rounded-md bg-canvas p-2 text-[11px] leading-5 text-ivory">{JSON.stringify(step.input, null, 2)}</pre></div><div><p className="text-xs text-taupe">Output</p><pre className="mt-1 overflow-x-auto rounded-md bg-canvas p-2 text-[11px] leading-5 text-ivory">{JSON.stringify(step.output, null, 2)}</pre></div></div></details>)}</div> : <div className="grid h-full place-items-center text-center"><div><p className="text-sm font-medium text-ivory">No simulation yet</p><p className="mt-1 text-sm text-taupe">Select Simulate to run this workflow with deterministic sample data.</p></div></div>}</div> : null}
    </section>
  );
}
