"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Cable,
  Compass,
  Eye,
  FileText,
  ListChecks,
  Search,
  ShieldAlert,
  Sun,
  Tags,
  Users,
} from "lucide-react";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { NotificationBell } from "@/components/notification-bell";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-context";

const daily = [
  { href: "/overview", label: "Today", icon: Sun },
  { href: "/search", label: "Google", icon: Search },
  { href: "/ai-visibility", label: "ChatGPT & AI", icon: Eye },
  { href: "/competitors", label: "Rivals", icon: Users },
  { href: "/health", label: "Website", icon: ShieldAlert },
];

const paid = [
  { href: "/weekly", label: "Weekly", icon: FileText },
  { href: "/recommendations", label: "To fix", icon: ListChecks },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { limits } = useWorkspace();
  const linkClass = (href: string) => {
    const active = pathname === href;
    return cn(
      "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
      active
        ? "bg-blue text-ivory shadow-sm"
        : "text-ink/70 hover:bg-indigo/15 hover:text-blue",
    );
  };

  return (
    <nav className="flex flex-col gap-5">
      <div>
        <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue/60">
          Monitor
        </p>
        <div className="flex flex-col gap-1">
          {daily.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass(item.href)}>
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue/60">
          Paid
        </p>
        <div className="flex flex-col gap-1">
          {paid.map((item) => {
            const Icon = item.icon;
            const locked = !limits.weeklyDocument;
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass(item.href)}>
                <Icon className="size-4" />
                {item.label}
                {locked ? (
                  <span className="ml-auto rounded-full bg-indigo/20 px-1.5 py-0.5 text-[10px] text-blue">
                    Watch
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Link href="/plans" onClick={onNavigate} className={linkClass("/plans")}>
          <Tags className="size-4" />
          Plans
        </Link>
        <Link href="/connections" onClick={onNavigate} className={linkClass("/connections")}>
          <Cable className="size-4" />
          Connect
        </Link>
      </div>
    </nav>
  );
}

function BrandBlock() {
  const { workspace, usingDemo, plan } = useWorkspace();
  return (
    <div className="px-3 pb-6">
      <Link href="/overview" className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-pear text-ink shadow-sm">
          <Compass className="size-4" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-blue">Lyra</span>
      </Link>
      <p className="mt-5 text-sm font-semibold">{workspace.brand}</p>
      <p className="font-mono text-[11px] text-muted-foreground">{workspace.domain}</p>
      <Link
        href="/plans"
        className="mt-3 inline-flex items-center rounded-full bg-indigo/20 px-2.5 py-1 text-[11px] font-medium text-blue hover:bg-indigo/30"
      >
        {plan.name}
        {usingDemo ? " · sample" : ""}
      </Link>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { workspace, plan, limits } = useWorkspace();

  return (
    <div className="min-h-dvh">
      <aside className="glass fixed top-3 bottom-3 left-3 z-20 hidden w-60 flex-col rounded-[1.75rem] px-2 py-5 md:flex">
        <BrandBlock />
        <NavLinks />
        <p className="mt-auto px-3 pt-6 text-[11px] leading-relaxed text-muted-foreground">
          {limits.howTo
            ? "We show you how to fix it."
            : limits.diagnosis
              ? "What is broken — not how."
              : "Monitoring only. No solutions."}
        </p>
      </aside>

      <div className="md:pl-[16.5rem]">
        <header className="sticky top-3 z-30 mx-3 flex items-center gap-3 rounded-full px-3 py-1.5 glass">
          <Link
            href="/overview"
            className="flex items-center gap-2 pl-1 text-sm font-semibold text-blue md:hidden"
          >
            <Compass className="size-4" />
            Lyra
          </Link>
          <div className="hidden min-w-0 flex-1 md:block">
            <p className="truncate text-sm font-semibold">{workspace.brand}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {workspace.daily.checkedAt} · {plan.name}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/plans"
              className="rounded-full bg-indigo/20 px-2.5 py-1 text-[11px] font-medium text-blue md:hidden"
            >
              {plan.name}
            </Link>
            <NotificationBell />
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 md:pb-12 md:pt-6">
          {children}
        </main>
        <MobileTabBar onMore={() => setOpen(true)} />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-72 border-0 bg-transparent p-3 pt-6 shadow-none">
            <div className="glass h-full rounded-[1.75rem] px-3 pt-6">
              <SheetTitle className="sr-only">More</SheetTitle>
              <BrandBlock />
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
