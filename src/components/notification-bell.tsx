"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useWorkspace } from "@/lib/workspace-context";

export function NotificationBell() {
  const { workspace } = useWorkspace();
  const [open, setOpen] = useState(false);
  const ups = workspace.daily.movers.filter((m) => m.direction === "up");
  const downs = workspace.daily.movers.filter((m) => m.direction === "down");
  const count = ups.length;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-indigo/15"
      >
        <Bell className="size-5 fill-ink text-ink" />
        {count > 0 ? (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-[#e11d48] text-[10px] font-semibold text-white">
            {count}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="glass absolute top-12 right-0 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] p-4">
          <div className="mb-3 flex items-center gap-4 text-sm">
            <span className="border-b-2 border-ink pb-1 font-semibold">All</span>
            <span className="text-muted-foreground">Google</span>
            <span className="text-muted-foreground">System</span>
          </div>
          <ul className="space-y-1">
            {ups.map((m) => (
              <li key={m.term} className="flex items-start gap-3 rounded-2xl px-1 py-2">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-pear/50 text-xs font-semibold text-ink">
                  ↑
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Went up</p>
                  <p className="truncate text-xs text-muted-foreground">{m.term}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-blue">
                  #{m.from}→#{m.to}
                </span>
              </li>
            ))}
            {downs.map((m) => (
              <li key={m.term} className="flex items-start gap-3 rounded-2xl px-1 py-2">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo/25 text-xs font-semibold text-blue">
                  ↓
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Moved down</p>
                  <p className="truncate text-xs text-muted-foreground">{m.term}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-blue">
                  #{m.from}→#{m.to}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-full bg-indigo/15 px-3 py-1.5 text-center text-[11px] text-blue">
            {workspace.daily.lastEmail.sent} · emailed when you go up
          </p>
        </div>
      ) : null}
    </div>
  );
}
