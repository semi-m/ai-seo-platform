"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { plans, type PlanId } from "@/lib/tiers";
import { useWorkspace } from "@/lib/workspace-context";

export default function PlansPage() {
  const { planId, setPlan } = useWorkspace();

  return (
    <div>
      <PageHeader
        eyebrow="Plans"
        title="Look every day. Pay to know what is broken. Call us to fix it."
        description="The product is the daily look. The Monday write-up is paid. Billing is not on yet — these buttons only change what you can see."
      />

      <div className="divide-y divide-border border-y border-border">
        {plans.map((plan) => {
          const current = plan.id === planId;
          return (
            <section key={plan.id} className="py-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h2 className="font-heading text-2xl tracking-tight">{plan.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.price} · {plan.cadence}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={current ? "outline" : "default"}
                  onClick={() => setPlan(plan.id as PlanId)}
                >
                  {current ? "You’re here" : `See ${plan.name}`}
                </Button>
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
    </div>
  );
}
