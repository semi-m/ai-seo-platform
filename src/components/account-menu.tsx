"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AccountMenu({ founder }: { founder: boolean }) {
  const { data } = useSession();
  const user = data?.user;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 12 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    return () => window.removeEventListener("resize", place);
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

  if (!user?.email) return null;

  const initial = (user.name || user.email).slice(0, 1).toUpperCase();

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Account"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-indigo/20 text-sm font-semibold text-blue"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="size-full object-cover" />
        ) : (
          initial
        )}
      </button>
      {open && mounted
        ? createPortal(
            <div
              ref={panelRef}
              role="menu"
              style={{ top: coords.top, right: coords.right }}
              className="fixed z-[80] w-64 overflow-hidden rounded-[1.5rem] border border-ink/15 bg-ivory p-4 text-ink shadow-lg"
            >
              <p className="truncate text-sm font-semibold">{user.name || "Your account"}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              <div className="mt-3 flex flex-col gap-1">
                {founder ? (
                  <Link
                    href="/subscribers"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-2 py-2 text-sm hover:bg-indigo/15"
                  >
                    Signups
                  </Link>
                ) : null}
                <Link
                  href="/plans"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-2 py-2 text-sm hover:bg-indigo/15"
                >
                  Plans
                </Link>
                <button
                  type="button"
                  className="rounded-2xl px-2 py-2 text-left text-sm hover:bg-indigo/15"
                  onClick={() => signOut({ callbackUrl: "/signin" })}
                >
                  Sign out
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
