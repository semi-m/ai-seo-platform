"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Cable,
  Compass,
  Eye,
  ListChecks,
  Menu,
  Search,
  ShieldAlert,
  Sun,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-context";

const primary = [
  { href: "/overview", label: "Home", icon: Sun },
  { href: "/recommendations", label: "This week", icon: ListChecks },
];

const details = [
  { href: "/search", label: "Google", icon: Search },
  { href: "/ai-visibility", label: "ChatGPT & AI", icon: Eye },
  { href: "/competitors", label: "Rivals", icon: Users },
  { href: "/health", label: "Website", icon: ShieldAlert },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const linkClass = (href: string) => {
    const active = pathname === href;
    return cn(
      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-foreground",
    );
  };

  return (
    <nav className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        {primary.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass(item.href)}>
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div>
        <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
          Look closer
        </p>
        <div className="flex flex-col gap-0.5">
          {details.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={linkClass(item.href)}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <Link href="/connections" onClick={onNavigate} className={linkClass("/connections")}>
        <Cable className="size-4" />
        Connect
      </Link>
    </nav>
  );
}

function BrandBlock() {
  const { workspace, providerLabel } = useWorkspace();
  return (
    <div className="px-3 pb-4">
      <Link href="/overview" className="flex items-center gap-2 font-medium">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Compass className="size-4" />
        </span>
        <span className="text-[15px] tracking-tight">Atlas</span>
      </Link>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {workspace.brand}
        <span className="block">{workspace.domain}</span>
      </p>
      <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground/80">
        {providerLabel}
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { workspace } = useWorkspace();
  const openCount = workspace.recommendations.filter((r) => r.status === "open").length;

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border/80 bg-sidebar px-3 py-5 lg:flex lg:flex-col">
        <BrandBlock />
        <NavLinks />
        <div className="mt-auto px-3 pt-6 text-xs text-muted-foreground">
          {openCount} left this week
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/80 bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Compass className="size-4" />
            Atlas
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="w-64 px-3 pt-6">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <BrandBlock />
              <NavLinks onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>
        <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
