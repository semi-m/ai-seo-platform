"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDelta, formatVisits, positionLabel } from "@/lib/scoring";
import { pct } from "@/lib/format";
import { useWorkspace } from "@/lib/workspace-context";

export default function OverviewPage() {
  const {
    workspace,
    loading,
    usingDemo,
    plan,
    limits,
    visibleKeywords,
    visiblePrompts,
    visibleRivals,
  } = useWorkspace();

  if (loading) {
    return <p className="text-sm text-muted-foreground">Opening today…</p>;
  }

  const rival = visibleRivals[0];
  const ups = workspace.daily.movers.filter((m) => m.direction === "up");
  const named = visiblePrompts.filter((p) => p.mentionRate > 0).length;

  return (
    <div>
      {usingDemo ? (
        <Link
          href="/connections"
          className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <span>
            Sample company so you can click around. Connect Google when you want
            live numbers. Switch plans anytime to see what each tier unlocks.
          </span>
          <span className="shrink-0 font-medium underline-offset-4 hover:underline">
            Connect
          </span>
        </Link>
      ) : null}

      <PageHeader
        eyebrow={`${workspace.daily.checkedAt} · ${plan.name}`}
        title={`${workspace.brand}, today`}
        description={
          limits.diagnosis
            ? "Daily picture first. The Monday document and the “what to fix” list sit next to it — they are not the homepage."
            : "A day-to-day look at your SEO. We monitor a few things. We do not tell you what to fix."
        }
      />

      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">Visits yesterday</p>
            <p className="font-heading text-3xl">{formatVisits(workspace.daily.visits)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDelta(workspace.daily.visitsDelta)} vs the day before
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">Keywords you rank for</p>
            <p className="font-heading text-3xl">{visibleKeywords.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {limits.rankedKeywordsOnly
                ? "Terms you already appear on"
                : "Including gaps and slipping terms"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">
              AI rank · {visiblePrompts.length} prompts
            </p>
            <p className="font-heading text-3xl">
              {named}/{visiblePrompts.length}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Named in the answer</p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Email when you go up
        </p>
        <p className="mt-2 text-[15px] leading-relaxed">{workspace.daily.emailPromise}</p>
        <div className="mt-4 rounded-xl bg-muted/70 px-4 py-3">
          <p className="text-xs text-muted-foreground">{workspace.daily.lastEmail.sent}</p>
          <p className="mt-1 text-sm font-medium">{workspace.daily.lastEmail.subject}</p>
        </div>
        {ups.length > 0 ? (
          <ul className="mt-4 space-y-1.5 text-sm">
            {ups.map((m) => (
              <li key={m.term}>
                <Badge variant="secondary" className="mr-2">
                  Up
                </Badge>
                {m.term} · #{m.from} → #{m.to}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <h2 className="mb-3 font-heading text-2xl tracking-tight">What we watch</h2>
      <div className="mb-8 space-y-2">
        {workspace.channels.slice(0, 4).map((ch) => (
          <div
            key={ch.name}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm"
          >
            <span>{ch.name}</span>
            <span className="text-muted-foreground">
              {formatVisits(ch.visits)} · {formatDelta(ch.delta)}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <Card>
          <CardContent className="py-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              One rival
            </p>
            {rival ? (
              <>
                <p className="mt-2 text-base font-medium">{rival.name}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{rival.domain}</p>
                <p className="mt-2 text-sm text-muted-foreground">{rival.momentum}</p>
                {limits.diagnosis ? (
                  <Link
                    href="/competitors"
                    className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
                  >
                    See the gap
                  </Link>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Free watches one rival. We do not explain how to beat them.
                  </p>
                )}
              </>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              AI prompts
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {visiblePrompts.map((p) => (
                <li key={p.id}>
                  <span className="text-muted-foreground">
                    {p.mentionRate > 0 ? pct(p.mentionRate) : "Not named"}
                  </span>
                  <span className="mt-0.5 block leading-snug">“{p.text}”</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-3 font-heading text-2xl tracking-tight">Keywords you rank for</h2>
      <div className="mb-8 space-y-2">
        {visibleKeywords.slice(0, 6).map((kw) => (
          <div
            key={kw.id}
            className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3"
          >
            <p className="text-sm font-medium">{kw.term}</p>
            <p className="text-sm text-muted-foreground">{positionLabel(kw.position)}</p>
          </div>
        ))}
        <Link
          href="/search"
          className="inline-block text-sm text-primary underline-offset-4 hover:underline"
        >
          Full Google list
        </Link>
      </div>

      {!limits.diagnosis ? (
        <Card>
          <CardContent className="py-5">
            <p className="text-base font-medium">No solutions on Look</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Watch (monthly) adds the weekly progress document and tells you what
              is broken. Fix (enterprise) is a call — we show you how.
            </p>
            <Link
              href="/plans"
              className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
            >
              Compare plans
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-5">
            <p className="text-base font-medium">
              {limits.howTo ? "How to fix it is unlocked" : "What to fix is unlocked"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {limits.howTo
                ? "Open To fix for the playbook, or Weekly for the Monday document."
                : "We name the problem. We do not write the playbook. That is the next tier."}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <Link href="/weekly" className="text-primary underline-offset-4 hover:underline">
                Weekly document
              </Link>
              <Link
                href="/recommendations"
                className="text-primary underline-offset-4 hover:underline"
              >
                What to fix
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
