"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { RecommendationList } from "@/components/recommendation-list";
import { Card, CardContent } from "@/components/ui/card";
import { toneClass } from "@/lib/format";
import { formatDelta } from "@/lib/scoring";
import { useWorkspace } from "@/lib/workspace-context";

export default function OverviewPage() {
  const { workspace, loading, usingDemo } = useWorkspace();
  if (loading) {
    return <p className="text-sm text-muted-foreground">Opening your week…</p>;
  }

  const topRecs = workspace.recommendations.filter((r) => r.status === "open").slice(0, 3);
  const mover = workspace.competitors[0];
  const worst = [...workspace.discoverability.pillars].sort((a, b) => a.score - b.score)[0];

  return (
    <div>
      {usingDemo ? (
        <Link
          href="/connections"
          className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <span>
            This is a sample report so you can learn the product. Connect Google
            Search and AI answers when you want {workspace.brand}’s real numbers.
          </span>
          <span className="shrink-0 font-medium underline-offset-4 hover:underline">
            Connect
          </span>
        </Link>
      ) : null}

      <PageHeader
        eyebrow={workspace.periodLabel}
        title={`This week, ${workspace.brand} should do three things`}
        description="You do not need to become an SEO. Open Lyra, pick an action, do it, come back next Monday."
      />

      <section className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          In plain language
        </p>
        <p className="mt-2 font-heading text-xl leading-relaxed sm:text-[1.4rem]">
          {workspace.weeklyNarrative}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Weakest area: {worst.label.toLowerCase()} ({worst.score}/100). {worst.summary}
        </p>
      </section>

      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-heading text-2xl tracking-tight">Do these</h2>
        <Link
          href="/recommendations"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Full list
        </Link>
      </div>
      <RecommendationList
        items={topRecs}
        empty="Nothing left this week. Nice — check back Monday, or reset the sample."
      />

      <h2 className="mt-10 mb-3 font-heading text-2xl tracking-tight">
        Only if you want the detail
      </h2>
      <div className="mb-6 grid gap-2 sm:grid-cols-2">
        {workspace.discoverability.pillars.map((pillar) => (
          <Link key={pillar.id} href={pillar.href}>
            <Card className="h-full hover:shadow-sm">
              <CardContent className="flex items-start justify-between gap-3 py-4">
                <div>
                  <p className="text-sm font-medium">{pillar.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{pillar.summary}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-2xl">{pillar.score}</p>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] ${toneClass(pillar.tone)}`}
                  >
                    {formatDelta(pillar.delta)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="py-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Rival to watch
          </p>
          <p className="mt-2 text-[15px] leading-relaxed">
            <span className="font-medium">{mover.name}</span> is {mover.momentum.toLowerCase()}.{" "}
            {mover.why}
          </p>
          <Link
            href="/competitors"
            className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
          >
            Why they are beating you
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
