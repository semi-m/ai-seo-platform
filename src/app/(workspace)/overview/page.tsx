"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { RecommendationList } from "@/components/recommendation-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toneClass } from "@/lib/format";
import { formatDelta, formatVisits } from "@/lib/scoring";
import { useWorkspace } from "@/lib/workspace-context";

export default function OverviewPage() {
  const { workspace, loading } = useWorkspace();
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading workspace…</p>;
  }

  const { discoverability, channels, markets, competitors } = workspace;
  const topRecs = workspace.recommendations.filter((r) => r.status === "open").slice(0, 5);
  const mover = competitors[0];

  return (
    <div>
      <PageHeader
        eyebrow={workspace.periodLabel}
        title={`${workspace.brand} is ${discoverability.score}/100 discoverable`}
        description="Good, bad, or important is on the card. You should not need to click to know whether something matters."
      />

      <section className="mb-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          This week
        </p>
        <p className="mt-2 font-heading text-xl leading-relaxed italic sm:text-[1.35rem]">
          {workspace.weeklyNarrative}
        </p>
      </section>

      <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {discoverability.pillars.map((pillar) => (
          <Link key={pillar.id} href={pillar.href} className="block">
            <Card className="h-full hover:shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{pillar.label}</CardTitle>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${toneClass(pillar.tone)}`}
                  >
                    {formatDelta(pillar.delta)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-4xl tracking-tight">{pillar.score}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.summary}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <p className="mb-8 text-xs leading-relaxed text-muted-foreground">
        Headline score {discoverability.score} = {discoverability.formula}
      </p>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Where people arrive</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {channels.map((ch) => (
              <div key={ch.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{ch.name}</span>
                  <span className="text-muted-foreground">
                    {formatVisits(ch.visits)} · {formatDelta(ch.delta)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/80"
                    style={{ width: `${ch.share}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Markets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {markets.map((m) => (
              <div key={m.code} className="border-b border-border/70 pb-3 last:border-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-medium">
                    {m.country}{" "}
                    <span className="text-xs font-normal text-muted-foreground">{m.code}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatVisits(m.traffic)} · {formatDelta(m.trafficDelta)}
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Search {m.search}/100 · AI {m.ai}/100
                </p>
                <p className="mt-1 text-sm leading-relaxed">{m.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Competitor that moved</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            <span className="font-medium">{mover.name}</span>{" "}
            <span className="text-muted-foreground">({mover.domain})</span> — {mover.momentum}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mover.why}</p>
          <Link
            href="/competitors"
            className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
          >
            Full competitor explanation
          </Link>
        </CardContent>
      </Card>

      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-heading text-2xl tracking-tight">Do this week</h2>
        <Link
          href="/recommendations"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          All recommendations
        </Link>
      </div>
      <RecommendationList
        items={topRecs}
        empty="No open recommendations. Mark something undone or reset the demo."
      />
    </div>
  );
}
