"use client";

import { AppIcon } from "@/components/ui/app-icon";
import { Dialog } from "@/components/ui/dialog";
import { stepChoices, type StepChoice } from "@/lib/daloy/node-config";

export function StepPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (choice: StepChoice) => void }) {
  return (
    <Dialog open={open} onClose={onClose} title="Add another step" description="Choose a condition or mock action for this single-path workflow.">
      <div className="grid max-h-[60vh] gap-2 overflow-y-auto p-5 sm:grid-cols-2">
        {stepChoices.map((choice) => <button key={choice.id} onClick={() => onPick(choice)} className="flex min-h-28 cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left transition hover:border-sandstone hover:bg-elevated focus-visible:outline-2 focus-visible:outline-sandstone"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-elevated text-sandstone"><AppIcon appId={choice.appId} /></span><span><span className="block text-xs capitalize text-taupe">{choice.type}</span><span className="mt-1 block text-sm font-medium text-ivory">{choice.name}</span><span className="mt-1 block text-xs leading-5 text-taupe">{choice.description}</span></span></button>)}
      </div>
    </Dialog>
  );
}
