"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bell } from "lucide-react";
import { useWorkspace } from "@/lib/workspace-context";

export function NotificationBell() {
  const { workspace } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  const ups = workspace.daily.movers.filter((m) => m.direction === "up");
  const downs = workspace.daily.movers.filter((m) => m.direction === "down");
  const count = ups.length;

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const place = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        right: Math.max(12, window.innerWidth - rect.right),
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
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
      {open && mounted
        ? createPortal(
            <div
              ref={panelRef}
              role="dialog"
              aria-label="Notifications"
              style={{ top: coords.top, right: coords.right }}
              className="fixed z-[80] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-ink/15 bg-ivory p-4 text-ink shadow-lg"
            >
              <p className="mb-2 text-sm font-semibold">All</p>
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
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
