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
  Lock,
  Search,
  ShieldAlert,
  Sun,
  Tags,
  Users,
} from "lucide-react";
import { MobileTabBar } from "@/components/mobile-tab-bar";
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
      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
      active
        ? "bg-foreground text-background"
        : "text-muted-foreground hover:bg-accent hover:text-foreground",
    );
  };

  return (
    <nav className="flex flex-col gap-5">
      <div>
        <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/80">
          Every day
        </p>
        <div className="flex flex-col gap-0.5">
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
        <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/80">
          Paid
        </p>
        <div className="flex flex-col gap-0.5">
          {paid.map((item) => {
            const Icon = item.icon;
            const locked = !limits.weeklyDocument;
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass(item.href)}>
                <Icon className="size-4" />
                {item.label}
                {locked ? (
                  <span className="ml-auto text-[10px] tracking-wide text-muted-foreground">Watch</span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <Link href="/plans" onClick={onNavigate} className={linkClass("/plans")}>
          <Tags className="size-4" />
          Plans
        </Link>
        <Link href="/connections" onClick={onNavigate} className={linkClass("/connections")}>
          <Cable className="size-4" />
          Connect
        </Link>
        <Link href="/privacy" onClick={onNavigate} className={linkClass("/privacy")}>
          <Lock className="size-4" />
          Your data
        </Link>
      </div>
    </nav>
  );
}

function BrandBlock() {
  const { workspace, usingDemo, plan } = useWorkspace();
  return (
    <div className="px-3 pb-5">
      <Link href="/overview" className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background">
          <Compass className="size-3.5" />
        </span>
        <span className="font-heading text-xl tracking-tight">Lyra</span>
      </Link>
      <p className="mt-4 text-sm font-medium">{workspace.brand}</p>
      <p className="font-mono text-[11px] text-muted-foreground">{workspace.domain}</p>
      <Link
        href="/plans"
        className="mt-3 inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      >
        {plan.name}
        {usingDemo ? " · sample" : ""}
      </Link>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { plan, limits } = useWorkspace();

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-border/70 bg-background px-2 py-6 lg:flex lg:flex-col">
        <BrandBlock />
        <NavLinks />
        <p className="mt-auto px-3 pt-8 text-[11px] leading-relaxed text-muted-foreground">
          {limits.howTo
            ? "We show you how to fix it."
            : limits.diagnosis
              ? "What is broken — not how."
              : "Monitoring only. No solutions."}
        </p>
      </aside>

      <div className="lg:pl-56">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/overview" className="flex items-center gap-2 font-heading text-lg tracking-tight">
            <Compass className="size-4" />
            Lyra
          </Link>
          <Link
            href="/plans"
            className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground"
          >
            {plan.name}
          </Link>
        </header>
        <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-6 sm:px-6 lg:pb-12 lg:pt-10">
          {children}
        </main>
        <MobileTabBar onMore={() => setOpen(true)} />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-72 bg-background px-3 pt-6">
            <SheetTitle className="sr-only">More</SheetTitle>
            <BrandBlock />
            <NavLinks onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
