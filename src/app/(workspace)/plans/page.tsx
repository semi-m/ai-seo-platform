"use client";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { plans, type PlanId } from "@/lib/tiers";
import { useWorkspace } from "@/lib/workspace-context";

export default function PlansPage() {
  const { planId, setPlan } = useWorkspace();

  return (
    <div>
      <PageHeader
        eyebrow="Plans"
        title="Look every day. Pay to know what is broken. Call us to fix it."
        description="This is a day-to-day SEO tool. The weekly document is a paid progress report — not the product. Switch tiers here to preview the gates. Billing is not wired yet."
      />

      <div className="space-y-4">
        {plans.map((plan) => {
          const current = plan.id === planId;
          return (
            <Card key={plan.id} className={current ? "border-primary" : undefined}>
              <CardContent className="space-y-4 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-2xl tracking-tight">{plan.name}</h2>
                      <Badge variant="outline">{plan.price}</Badge>
                      {current ? <Badge variant="secondary">This preview</Badge> : null}
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                      {plan.cadence}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={current ? "outline" : "default"}
                    onClick={() => setPlan(plan.id as PlanId)}
                  >
                    {current ? "Using this view" : `Preview ${plan.name}`}
                  </Button>
                </div>
                <p className="text-[15px] leading-relaxed">{plan.promise}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      You get
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                      {plan.includes.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  {plan.notIncluded.length > 0 ? (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Not this tier
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {plan.notIncluded.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        The call
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        We sit with you in the tool and walk the fixes: which page,
                        which source, which schema. You still own the work. We show
                        you how.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
