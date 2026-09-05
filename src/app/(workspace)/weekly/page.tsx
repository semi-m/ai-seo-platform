"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageSkeleton } from "@/components/page-skeleton";
import { SampleNotice } from "@/components/sample-notice";
import { UpgradeGate } from "@/components/upgrade-gate";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspace } from "@/lib/workspace-context";

export default function WeeklyPage() {
  const { workspace, loading, limits, usingDemo } = useWorkspace();

  if (loading) {
    return <PageSkeleton label="Opening the week…" />;
  }

  if (!limits.weeklyDocument) {
    return (
      <div>
        {usingDemo ? <SampleNotice /> : null}
        <PageHeader
          eyebrow="Weekly"
          title="A Monday write-up — not the homepage"
          description="Look is the daily look. The Monday write-up is on Watch."
        />
        <UpgradeGate need="pro" title="The Monday write-up is on Watch">
          Wins, losses, what the rival did, and what is broken. Still no how-to.
          That is Fix.
        </UpgradeGate>
      </div>
    );
  }

  const brief = workspace.weeklyBrief;

  return (
    <div>
      {usingDemo ? <SampleNotice /> : null}
      <PageHeader
        eyebrow={brief.weekOf}
        title="What moved this week"
        description="One write-up. What moved. What to look at next. How to fix it is on Fix."
      />

      <article className="border-y border-border py-8">
        <p className="font-heading text-xl leading-relaxed sm:text-[1.35rem]">
          {brief.headline}
        </p>

        <section className="mt-8">
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Wins
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed">
            {brief.wins.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Losses
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed">
            {brief.losses.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Rival movement
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed">{brief.rivalMove}</p>
        </section>
      </article>

      <h2 className="mt-10 mb-3 font-heading text-2xl tracking-tight">
        What you should fix
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        This names the problems. It does not teach the repair.
      </p>
      <div className="space-y-2">
        {brief.toFix.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="flex items-start justify-between gap-3 py-4">
              <div>
                <p className="text-xs text-muted-foreground">#{index + 1}</p>
                <p className="mt-0.5 text-sm font-medium">{item.problem}</p>
              </div>
              <Badge variant="outline">{item.impact}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <Link
        href="/recommendations"
        className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline"
      >
        Full “to fix” list
      </Link>
    </div>
  );
}
