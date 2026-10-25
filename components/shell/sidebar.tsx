"use client";

import { Activity, Cable, LayoutDashboard, Library, RotateCcw, Route, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppMark } from "@/components/ui/app-mark";
import { useWorkspace } from "@/components/providers/workspace-provider";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/templates", label: "Templates", icon: Library },
  { href: "/flows", label: "My Flows", icon: Route },
  { href: "/connections", label: "Connections", icon: Cable },
  { href: "/activity", label: "Activity", icon: Activity },
];

export function Sidebar({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const { resetDemo } = useWorkspace();
  const canReset = process.env.NODE_ENV === "development";
  return (
    <aside data-ui className={`hidden h-dvh shrink-0 flex-col border-r border-border bg-sidebar lg:flex ${compact ? "w-[72px]" : "w-[224px]"}`}>
      <div className={`flex h-16 items-center ${compact ? "justify-center" : "px-5"}`}><AppMark compact={compact} /></div>
      <nav className="flex-1 px-3 pt-4" aria-label="Primary navigation">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} title={compact ? label : undefined} aria-current={active ? "page" : undefined} className={`mb-1 flex h-10 items-center rounded-lg text-sm transition focus-visible:outline-2 focus-visible:outline-sandstone ${compact ? "justify-center" : "gap-3 px-3"} ${active ? "bg-surface text-ivory" : "text-taupe hover:bg-surface/70 hover:text-ivory"}`}>
              <Icon className="size-4 shrink-0" strokeWidth={1.7} aria-hidden="true" />
              {compact ? <span className="sr-only">{label}</span> : <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <div className={`flex items-center rounded-lg border border-border bg-surface ${compact ? "justify-center p-2" : "gap-3 p-3"}`}>
          <Settings className="size-4 text-taupe" aria-hidden="true" />
          {compact ? null : <div><p className="text-xs font-medium text-ivory">Demo workspace</p><p className="mt-0.5 text-xs text-taupe">Local data only</p></div>}
        </div>
        {canReset ? <button onClick={resetDemo} title="Reset demo data" className={`mt-2 flex min-h-10 w-full cursor-pointer items-center rounded-lg text-xs text-taupe transition hover:bg-surface hover:text-ivory focus-visible:outline-2 focus-visible:outline-sandstone ${compact ? "justify-center" : "gap-2 px-3"}`}><RotateCcw className="size-3.5" aria-hidden="true" />{compact ? <span className="sr-only">Reset demo data</span> : "Reset demo data"}</button> : null}
      </div>
    </aside>
  );
}
