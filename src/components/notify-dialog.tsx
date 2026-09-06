"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type PlanId } from "@/lib/tiers";
import { useWorkspace } from "@/lib/workspace-context";

const copy: Record<
  Exclude<PlanId, "free">,
  { title: string; body: string; done: string }
> = {
  pro: {
    title: "Get a note when Watch opens",
    body: "Watch is not for sale yet. Leave the email we should write to. We will tell you when the Monday write-up is ready — and that starts the newsletter.",
    done: "You are on the Watch list. We will email you there.",
  },
  enterprise: {
    title: "Get a note when Fix opens",
    body: "Fix is a call with us. It is not open yet. Leave an email and we will tell you when we take the next businesses.",
    done: "You are on the Fix list. We will email you there.",
  },
};

export function NotifyDialog({
  plan,
  open,
  onOpenChange,
}: {
  plan: Exclude<PlanId, "free">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data } = useSession();
  const { notifiedPlans, markNotified } = useWorkspace();
  const [email, setEmail] = useState(data?.user?.email ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const already = notifiedPlans.includes(plan);
  const text = copy[plan];

  async function submit() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(payload.error ?? "Could not save that email.");
        return;
      }
      markNotified(plan);
    } catch {
      setError("Could not save that email.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[1.5rem] bg-ivory sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{already ? "You are on the list" : text.title}</DialogTitle>
          <DialogDescription>{already ? text.done : text.body}</DialogDescription>
        </DialogHeader>
        {already ? null : (
          <div className="space-y-1.5">
            <Label htmlFor="notify-email">Email</Label>
            <Input
              id="notify-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        )}
        <DialogFooter>
          {already ? (
            <Button type="button" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          ) : (
            <Button type="button" disabled={saving || !email.trim()} onClick={submit}>
              {saving ? "Saving…" : "Notify me"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
