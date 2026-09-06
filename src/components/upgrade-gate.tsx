"use client";

import Link from "next/link";
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
    <section className="border-y border-border py-8">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {plan.name} · {plan.price}
      </p>
      <h2 className="mt-2 font-heading text-2xl tracking-tight">{title}</h2>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{children}</p>
      <Link href="/plans" className="mt-5 inline-block text-sm underline underline-offset-4">
        Get a note when {plan.name} opens
      </Link>
    </section>
  );
}
