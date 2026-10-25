"use client";

import { Activity, Cable, LayoutDashboard, Library, Menu, Route, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { AppMark } from "@/components/ui/app-mark";
import { Sidebar } from "./sidebar";

const mobileNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/templates", label: "Templates", icon: Library },
  { href: "/flows", label: "My Flows", icon: Route },
  { href: "/connections", label: "Connections", icon: Cable },
  { href: "/activity", label: "Activity", icon: Activity },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const builder = /^\/flows\/[^/]+$/.test(pathname) || pathname === "/flows/new";

  return (
    <div className="flex min-h-dvh bg-background">
      <a href="#main-content" className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg bg-sandstone px-4 py-2 text-sm font-medium text-background transition focus:translate-y-0">Skip to main content</a>
      <Sidebar compact={builder} />
      <div className="min-w-0 flex-1">
        <header data-ui className="flex h-14 items-center justify-between border-b border-border bg-sidebar px-4 lg:hidden">
          <AppMark />
          <button className="grid size-11 cursor-pointer place-items-center rounded-lg text-taupe hover:bg-surface hover:text-ivory focus-visible:outline-2 focus-visible:outline-sandstone" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </header>
        {menuOpen ? (
          <nav data-ui id="mobile-navigation" className="fixed inset-x-0 top-14 z-50 border-b border-border bg-sidebar p-3 shadow-2xl lg:hidden" aria-label="Mobile navigation">
            {mobileNav.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm ${pathname === href || (href !== "/" && pathname.startsWith(href)) ? "bg-surface text-ivory" : "text-taupe"}`}>
                <Icon className="size-4" aria-hidden="true" />{label}
              </Link>
            ))}
          </nav>
        ) : null}
        <main id="main-content" tabIndex={-1} className={builder ? "h-[calc(100dvh-56px)] lg:h-dvh" : "mx-auto min-h-[calc(100dvh-56px)] max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:min-h-dvh lg:px-9 lg:py-9"}>{children}</main>
      </div>
    </div>
  );
}
