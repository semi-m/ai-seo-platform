"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Compass,
  Eye,
  LayoutDashboard,
  ListChecks,
  Menu,
  Search,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-context";

const nav = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/search", label: "Search", icon: Search },
  { href: "/ai-visibility", label: "AI visibility", icon: Eye },
  { href: "/competitors", label: "Competitors", icon: Users },
  { href: "/recommendations", label: "Recommendations", icon: ListChecks },
  { href: "/health", label: "Site health", icon: ShieldAlert },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5">
      {nav.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
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
          {openCount} actions this week
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
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
