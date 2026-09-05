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
      className="glass fixed inset-x-3 bottom-3 z-30 rounded-full px-1 pb-[max(0.2rem,env(safe-area-inset-bottom))] pt-1 md:hidden"
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
                  "flex flex-col items-center gap-0.5 rounded-full py-2 text-[11px]",
                  active ? "bg-blue text-ivory" : "text-muted-foreground",
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
            className="flex w-full flex-col items-center gap-0.5 rounded-full py-2 text-[11px] text-muted-foreground"
          >
            <Menu className="size-4" />
            More
          </button>
        </li>
      </ul>
    </nav>
  );
}
