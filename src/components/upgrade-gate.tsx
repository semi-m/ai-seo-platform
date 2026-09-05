"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { planById, type PlanId } from "@/lib/tiers";

export function UpgradeGate({
  need,
  title,
  children,
}: {
  need: Exclude<PlanId, "free">;
  title: string;
  children: string;
}) {
  const plan = planById[need];
  return (
    <Card>
      <CardContent className="py-8">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {plan.name} · {plan.price}
        </p>
        <h2 className="mt-2 font-heading text-2xl tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
        <Link
          href="/plans"
          className="mt-5 inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          See plans
        </Link>
      </CardContent>
    </Card>
  );
}
