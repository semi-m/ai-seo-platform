"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  Compass,
  Eye,
  FileText,
  ListChecks,
  Menu,
  Search,
  Sun,
  Tags,
  Users,
} from "lucide-react";
import { AccountMenu } from "@/components/account-menu";
import { NotificationBell } from "@/components/notification-bell";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { isFounderEmail } from "@/lib/accounts-store";
import { useWorkspace } from "@/lib/workspace-context";
import { useSession } from "next-auth/react";

const daily = [
  { href: "/overview", label: "Today", icon: Sun },
  { href: "/search", label: "Google", icon: Search },
  { href: "/ai-visibility", label: "ChatGPT & AI", icon: Eye },
  { href: "/competitors", label: "Rivals", icon: Users },
  { href: "/health", label: "Website", icon: Activity },
];

const paid = [
  { href: "/weekly", label: "Weekly", icon: FileText },
  { href: "/recommendations", label: "To fix", icon: ListChecks },
];

function NavLinks({
  onNavigate,
  founder,
}: {
  onNavigate?: () => void;
  founder?: boolean;
}) {
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
          Every day
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
        {founder ? (
          <Link
            href="/subscribers"
            onClick={onNavigate}
            className={linkClass("/subscribers")}
          >
            <Tags className="size-4" />
            Signups
          </Link>
        ) : null}
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
  const { data } = useSession();
  const founder = isFounderEmail(data?.user?.email);

  return (
    <div className="min-h-dvh">
      <aside className="glass fixed top-3 bottom-3 left-3 z-20 hidden w-60 flex-col rounded-[1.75rem] px-2 py-5 sm:flex">
        <BrandBlock />
        <NavLinks founder={founder} />
        <p className="mt-auto px-3 pt-6 text-[11px] leading-relaxed text-muted-foreground">
          {limits.howTo
            ? "We show you how to fix it."
            : limits.diagnosis
              ? "What is broken — not how."
              : "We watch. We do not tell you what to fix."}
        </p>
      </aside>

      <div className="sm:pl-[16.5rem]">
        <header className="sticky top-3 z-30 mx-3 flex items-center gap-3 overflow-visible rounded-full px-3 py-1.5 glass">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-blue hover:bg-indigo/15 sm:hidden"
          >
            <Menu className="size-4" />
            Menu
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{workspace.brand}</p>
            <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
              {workspace.daily.checkedAt} · {plan.name}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/plans"
              className="rounded-full bg-indigo/20 px-2.5 py-1 text-[11px] font-medium text-blue sm:hidden"
            >
              {plan.name}
            </Link>
            <NotificationBell />
            <AccountMenu founder={founder} />
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-12 pt-5 sm:px-6 sm:pt-6">
          {children}
        </main>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-72 border-0 bg-transparent p-3 pt-6 shadow-none">
            <div className="glass h-full rounded-[1.75rem] px-3 pt-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <BrandBlock />
              <NavLinks founder={founder} onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
