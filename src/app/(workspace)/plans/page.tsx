"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { NotifyDialog } from "@/components/notify-dialog";
import { Button } from "@/components/ui/button";
import { plans, type PlanId } from "@/lib/tiers";
import { useWorkspace } from "@/lib/workspace-context";

export default function PlansPage() {
  const { planId, notifiedPlans } = useWorkspace();
  const [notify, setNotify] = useState<Exclude<PlanId, "free"> | null>(null);

  return (
    <div>
      <PageHeader
        eyebrow="Plans"
        title="Look is open. Watch and Fix — leave your email."
        description="Look is free and ready. Watch and Fix are not for sale yet. Subscribe and we email you when they open. That list is the start of the newsletter."
      />

      <div className="divide-y divide-border border-y border-border">
        {plans.map((plan) => {
          const current = plan.id === planId;
          const waiting =
            plan.id !== "free" && notifiedPlans.includes(plan.id);
          return (
            <section key={plan.id} className="py-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h2 className="font-heading text-2xl tracking-tight">{plan.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.price} · {plan.cadence}
                  </p>
                </div>
                {plan.id === "free" ? (
                  <Button size="sm" variant="outline" disabled>
                    {current ? "You’re on Look" : "Look"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant={waiting ? "outline" : "default"}
                    onClick={() => setNotify(plan.id as Exclude<PlanId, "free">)}
                  >
                    {waiting ? "You’re on the list" : "Notify me"}
                  </Button>
                )}
              </div>
              <p className="mt-4 text-[15px] leading-relaxed">{plan.promise}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {plan.includes.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-muted-foreground">+</span>
                    <span>{line}</span>
                  </li>
                ))}
                {plan.notIncluded.map((line) => (
                  <li key={line} className="flex gap-2 text-muted-foreground">
                    <span>−</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {notify ? (
        <NotifyDialog
          plan={notify}
          open
          onOpenChange={(open) => {
            if (!open) setNotify(null);
          }}
        />
      ) : null}
    </div>
  );
}
