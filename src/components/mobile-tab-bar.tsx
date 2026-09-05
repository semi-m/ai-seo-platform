"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, Menu, Search, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/overview", label: "Today", icon: Sun },
  { href: "/search", label: "Google", icon: Search },
  { href: "/ai-visibility", label: "AI", icon: Eye },
];

export function MobileTabBar({ onMore }: { onMore: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Daily"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg py-2 text-[11px]",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={onMore}
            className="flex w-full flex-col items-center gap-0.5 rounded-lg py-2 text-[11px] text-muted-foreground"
          >
            <Menu className="size-4" />
            More
          </button>
        </li>
      </ul>
    </nav>
  );
}
