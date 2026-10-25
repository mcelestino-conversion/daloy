import { Circle } from "lucide-react";

const styles = {
  draft: "border-border bg-elevated text-taupe",
  active: "border-[#5a5246] bg-[#302b24] text-sandstone",
  paused: "border-border bg-surface text-taupe",
  success: "border-[#5a5246] bg-[#302b24] text-sandstone",
  filtered: "border-border bg-elevated text-taupe",
  failed: "border-[#6b4b48] bg-[#2b211f] text-[#f0c9c4]",
  skipped: "border-border bg-elevated text-taupe",
  connected: "border-[#5a5246] bg-[#302b24] text-sandstone",
  disconnected: "border-border bg-elevated text-taupe",
  configured: "border-[#5a5246] bg-[#302b24] text-sandstone",
  "not configured": "border-border bg-elevated text-taupe",
};

export function StatusBadge({ status }: { status: keyof typeof styles }) {
  return (
    <span className={`inline-flex h-6 items-center gap-1.5 rounded-full border px-2 text-xs font-medium capitalize ${styles[status]}`}>
      <Circle aria-hidden="true" className="size-1.5 fill-current" />
      {status}
    </span>
  );
}
