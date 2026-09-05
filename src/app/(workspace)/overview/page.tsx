"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageSkeleton } from "@/components/page-skeleton";
import { SampleNotice } from "@/components/sample-notice";
import { formatDelta, formatVisits, positionLabel } from "@/lib/scoring";
import { pct } from "@/lib/format";
import { todaySentence } from "@/lib/today-copy";
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
    return <PageSkeleton label="Opening today…" />;
  }

  const rival = visibleRivals[0];
  const ups = workspace.daily.movers.filter((m) => m.direction === "up");
  const named = visiblePrompts.filter((p) => p.mentionRate > 0).length;

  return (
    <div>
      {usingDemo ? <SampleNotice /> : null}

      <PageHeader
        eyebrow={`${workspace.daily.checkedAt} · ${plan.name}`}
        title={workspace.brand}
        description={todaySentence({
          ups: ups.length,
          named,
          prompts: visiblePrompts.length,
          rival: rival?.name,
        })}
      />

      <dl className="mb-8 grid grid-cols-3 gap-3 border-y border-border py-5">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Yesterday</dt>
          <dd className="mt-1 font-heading text-3xl tracking-tight">
            {formatVisits(workspace.daily.visits)}
          </dd>
          <dd className="mt-1 text-xs text-muted-foreground">
            {formatDelta(workspace.daily.visitsDelta)} visits
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Google</dt>
          <dd className="mt-1 font-heading text-3xl tracking-tight">{visibleKeywords.length}</dd>
          <dd className="mt-1 text-xs text-muted-foreground">
            {limits.rankedKeywordsOnly ? "terms you rank for" : "terms we track"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">AI</dt>
          <dd className="mt-1 font-heading text-3xl tracking-tight">
            {named}/{visiblePrompts.length}
          </dd>
          <dd className="mt-1 text-xs text-muted-foreground">named in the answer</dd>
        </div>
      </dl>

      <section className="mb-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="font-heading text-2xl tracking-tight">Went up</h2>
          <p className="text-xs text-muted-foreground">We email you these</p>
        </div>
        {ups.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upward moves since yesterday.</p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {ups.map((m) => (
              <li key={m.term} className="flex items-baseline justify-between gap-3 py-3">
                <span className="text-sm">{m.term}</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  #{m.from} → #{m.to}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[13px] text-muted-foreground">
          Last mail · {workspace.daily.lastEmail.sent}
          <span className="mt-0.5 block text-foreground/80">{workspace.daily.lastEmail.subject}</span>
        </p>
      </section>

      <div className="mb-10 grid gap-10 sm:grid-cols-2">
        <section>
          <h2 className="mb-3 font-heading text-2xl tracking-tight">Rival</h2>
          {rival ? (
            <>
              <p className="text-base font-medium">{rival.name}</p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">{rival.domain}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rival.momentum}</p>
              {limits.diagnosis ? (
                <Link
                  href="/competitors"
                  className="mt-3 inline-block text-sm underline underline-offset-4"
                >
                  See the gap
                </Link>
              ) : (
                <p className="mt-3 text-[13px] text-muted-foreground">
                  Look watches one. We do not explain how to beat them.
                </p>
              )}
            </>
          ) : null}
        </section>
        <section>
          <h2 className="mb-3 font-heading text-2xl tracking-tight">
            {visiblePrompts.length} AI questions
          </h2>
          <ul className="space-y-3">
            {visiblePrompts.map((p) => (
              <li key={p.id}>
                <p className="text-[13px] text-muted-foreground">
                  {p.mentionRate > 0 ? `${pct(p.mentionRate)} named` : "Not named"}
                </p>
                <p className="text-sm leading-snug">“{p.text}”</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mb-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="font-heading text-2xl tracking-tight">You rank for</h2>
          <Link href="/search" className="text-sm underline underline-offset-4">
            All Google
          </Link>
        </div>
        <ul className="divide-y divide-border border-y border-border">
          {visibleKeywords.slice(0, 6).map((kw) => (
            <li key={kw.id} className="flex items-baseline justify-between gap-3 py-3">
              <span className="text-sm">{kw.term}</span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {positionLabel(kw.position)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
        {!limits.diagnosis ? (
          <>
            Look does not give solutions.{" "}
            <Link href="/plans" className="text-foreground underline underline-offset-4">
              Watch names what is broken. Fix shows you how.
            </Link>
          </>
        ) : limits.howTo ? (
          <>
            How to fix is open.{" "}
            <Link href="/weekly" className="text-foreground underline underline-offset-4">
              Weekly document
            </Link>
            {" · "}
            <Link href="/recommendations" className="text-foreground underline underline-offset-4">
              To fix
            </Link>
          </>
        ) : (
          <>
            We can name what is broken. Not how.{" "}
            <Link href="/weekly" className="text-foreground underline underline-offset-4">
              Weekly
            </Link>
            {" · "}
            <Link href="/recommendations" className="text-foreground underline underline-offset-4">
              To fix
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
