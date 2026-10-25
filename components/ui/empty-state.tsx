import { Route } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 px-6 text-center">
      <Route aria-hidden="true" className="size-6 text-sandstone" strokeWidth={1.5} />
      <h2 className="mt-4 text-base font-semibold text-ivory">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-taupe">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
