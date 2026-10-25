"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useWorkspace } from "@/components/providers/workspace-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { createWorkflowFromTemplate } from "@/lib/daloy/workflows";
import { filterTemplates, templateCategories, workflowTemplates } from "@/lib/daloy/templates";
import type { Template } from "@/lib/daloy/types";
import { TemplateCard } from "./template-card";
import { TemplatePreview } from "./template-preview";

export function TemplateGallery() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveWorkflow } = useWorkspace();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof templateCategories)[number]>("All");
  const [selected, setSelected] = useState<Template | null>(null);

  useEffect(() => {
    const requested = searchParams.get("template");
    if (requested) setSelected(workflowTemplates.find((item) => item.id === requested) ?? null);
  }, [searchParams]);

  const visible = useMemo(() => filterTemplates(workflowTemplates, query, category), [query, category]);

  function useTemplate(template: Template) {
    const workflow = createWorkflowFromTemplate(template);
    saveWorkflow(workflow);
    router.push(`/flows/${workflow.id}`);
  }

  return (
    <div className="space-y-7">
      <PageHeader title="Templates" description="Start with a practical workflow, preview every step, then tailor it to your process." actions={<Link href="/flows/new" className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-sandstone bg-sandstone px-4 text-sm font-medium text-background transition hover:bg-ivory focus-visible:outline-2 focus-visible:outline-sandstone"><Plus className="size-4" aria-hidden="true" />Create from scratch</Link>} />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-sm"><span className="sr-only">Search templates</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-taupe" aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates" className="h-11 w-full rounded-[9px] border border-border bg-surface pl-10 pr-3 text-sm text-ivory placeholder:text-taupe focus:border-sandstone focus:outline-none" /></label>
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Template categories">
          {templateCategories.map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`h-9 shrink-0 cursor-pointer rounded-lg border px-3 text-sm transition focus-visible:outline-2 focus-visible:outline-sandstone ${category === item ? "border-sandstone bg-[#302b24] text-sandstone" : "border-border bg-surface text-taupe hover:text-ivory"}`}>{item}</button>)}
        </div>
      </div>

      {visible.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((template) => <TemplateCard key={template.id} template={template} onPreview={setSelected} />)}</div> : <EmptyState title="No templates found" description="Try a broader search or choose a different category." />}

      <TemplatePreview template={selected} open={Boolean(selected)} onClose={() => setSelected(null)} onUse={useTemplate} />
    </div>
  );
}
