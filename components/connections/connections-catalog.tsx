"use client";

import { Cable, Unplug } from "lucide-react";

import { useWorkspace } from "@/components/providers/workspace-provider";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { appCatalog } from "@/lib/daloy/catalog";

export function ConnectionsCatalog() {
  const { connections, toggleConnection } = useWorkspace();
  return <div>
    <PageHeader title="Connections" description="Preview connected apps with safe demo accounts. No sign-in or external service is used." />
    <div className="mt-5 rounded-xl border border-[#5a5246] bg-[#302b24] px-4 py-3 text-sm text-sandstone">Demo connections only — these controls update local browser data and never contact an external API.</div>
    <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {appCatalog.map((app) => {
        const connection = connections.find((item) => item.appId === app.id);
        const connected = connection?.status === "connected";
        return <article key={app.id} className="rounded-xl border border-border bg-surface p-5 transition hover:border-[#565149]">
          <div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-xl border border-border bg-elevated text-sandstone"><AppIcon appId={app.id} className="size-5" /></span><StatusBadge status={connected ? "connected" : "disconnected"} /></div>
          <h2 className="mt-5 font-semibold text-ivory">{app.name}</h2><p className="mt-1 min-h-10 text-sm leading-5 text-taupe">{app.description}</p>
          {connected ? <p className="mt-4 text-xs text-taupe">{connection?.accountLabel} · simulated account</p> : <p className="mt-4 text-xs text-taupe">Available for mock workflow setup</p>}
          <Button className="mt-5 w-full" variant={connected ? "secondary" : "primary"} onClick={() => toggleConnection(app.id)}>{connected ? <><Unplug className="size-4" />Disconnect demo</> : <><Cable className="size-4" />Connect demo</>}</Button>
        </article>;
      })}
    </div>
  </div>;
}
