"use client";

import { ArrowDown, Sparkles } from "lucide-react";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { Template } from "@/lib/daloy/types";

export function TemplatePreview({ template, open, onClose, onUse }: { template: Template | null; open: boolean; onClose: () => void; onUse: (template: Template) => void }) {
  if (!template) return null;
  return (
    <Dialog open={open} onClose={onClose} title={template.name} description={template.description}>
      <div className="max-h-[58vh] overflow-y-auto px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-taupe"><Sparkles className="size-4 text-sandstone" aria-hidden="true" />A ready-to-edit demo workflow</div>
        <ol className="mt-5 space-y-2">
          {template.nodes.map((node, index) => (
            <li key={node.id}>
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-elevated text-sandstone"><AppIcon appId={node.appId} /></span>
                  <div className="min-w-0 flex-1"><p className="text-xs capitalize text-taupe">{node.type}</p><p className="mt-1 text-sm font-medium text-ivory">{node.name}</p><p className="mt-1 text-sm leading-5 text-taupe">{node.summary}</p></div>
                  <span className="text-xs tabular-nums text-taupe">{index + 1}</span>
                </div>
              </div>
              {index < template.nodes.length - 1 ? <ArrowDown className="mx-auto my-1 size-4 text-border" aria-hidden="true" /> : null}
            </li>
          ))}
        </ol>
      </div>
      <div data-ui className="flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
        <Button onClick={onClose}>Keep browsing</Button>
        <Button variant="primary" onClick={() => onUse(template)}>Use template</Button>
      </div>
    </Dialog>
  );
}
