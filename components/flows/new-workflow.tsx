"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useWorkspace } from "@/components/providers/workspace-provider";
import { createBlankWorkflow } from "@/lib/daloy/workflows";

export function NewWorkflow() {
  const router = useRouter();
  const { saveWorkflow, hydrated } = useWorkspace();
  const created = useRef(false);

  useEffect(() => {
    if (!hydrated || created.current) return;
    created.current = true;
    const workflow = createBlankWorkflow();
    void saveWorkflow(workflow).then(saved => {
      if (saved) router.replace(`/flows/${workflow.id}`);
      else router.replace("/flows");
    });
  }, [hydrated, router, saveWorkflow]);

  return <div className="grid h-full place-items-center"><div className="text-center"><LoaderCircle className="mx-auto size-5 animate-spin text-sandstone" aria-hidden="true" /><p className="mt-3 text-sm text-taupe">Preparing your flow…</p></div></div>;
}
