import { ArrowUpRight } from "lucide-react";

import { AppIcon } from "@/components/ui/app-icon";
import type { Template } from "@/lib/daloy/types";

export function TemplateCard({ template, onPreview }: { template: Template; onPreview: (template: Template) => void }) {
  return (
    <article className="flex min-h-64 flex-col rounded-xl border border-border bg-surface p-5 transition duration-150 hover:border-[#5a564f] hover:bg-elevated">
      <div className="flex items-center justify-between gap-4">
        <div className="flex -space-x-1.5">
          {template.appIds.slice(0, 3).map((appId) => <span key={appId} className="grid size-9 place-items-center rounded-lg border border-border bg-elevated text-sandstone"><AppIcon appId={appId} /></span>)}
        </div>
        <span className="text-xs text-taupe">{template.nodes.length} steps</span>
      </div>
      <h2 className="mt-6 text-base font-semibold tracking-[-0.015em] text-ivory">{template.name}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-taupe">{template.description}</p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-xs text-taupe">{template.category}</span>
        <button onClick={() => onPreview(template)} className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-medium text-sandstone transition hover:bg-[#302b24] hover:text-ivory focus-visible:outline-2 focus-visible:outline-sandstone">
          Preview <ArrowUpRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
