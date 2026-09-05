"use client";

import Link from "next/link";
import { PageSkeleton } from "@/components/page-skeleton";
import { SampleNotice } from "@/components/sample-notice";
import { formatDelta, formatVisits, positionLabel } from "@/lib/scoring";
import { pct } from "@/lib/format";
import { useWorkspace } from "@/lib/workspace-context";

export default function OverviewPage() {
  const {
    workspace,
    loading,
    usingDemo,
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
  const namedPct = visiblePrompts.length
    ? Math.round((named / visiblePrompts.length) * 100)
    : 0;

  const stats = [
    {
      href: "/health",
      label: "Yesterday",
      value: formatVisits(workspace.daily.visits),
      hint: `${formatDelta(workspace.daily.visitsDelta)} visits`,
    },
    {
      href: "/search",
      label: "Google",
      value: String(visibleKeywords.length),
      hint: limits.rankedKeywordsOnly ? "terms you rank for" : "terms we track",
    },
    {
      href: "/ai-visibility",
      label: "AI",
      value: `${named}/${visiblePrompts.length}`,
      hint: "named in the answer",
    },
  ];

  return (
    <div>
      {usingDemo ? <SampleNotice /> : null}

      <div className="mb-4 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="glass block rounded-[1.5rem] px-4 py-5 no-underline transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue/70">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-blue sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-5">
        <section className="glass rounded-[1.5rem] px-5 py-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Went up</h2>
            <span className="rounded-full bg-indigo/15 px-2.5 py-1 text-[11px] font-medium text-blue">
              We email these
            </span>
          </div>
          {ups.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upward moves since yesterday.</p>
          ) : (
            <ul className="space-y-1">
              {ups.map((m) => (
                <li key={m.term} className="flex items-center justify-between gap-3 rounded-2xl py-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-pear/50 text-sm font-semibold text-ink">
                      ↑
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{m.term}</p>
                      <p className="text-xs text-muted-foreground">Google position</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-blue">
                    #{m.from} → #{m.to}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass flex flex-col items-center justify-center rounded-[1.5rem] px-5 py-6 lg:col-span-2">
          <h2 className="self-start text-base font-semibold">AI rank</h2>
          <div className="relative mt-4 flex size-40 items-center justify-center">
            <svg viewBox="0 0 120 70" className="absolute inset-x-0 top-2 w-full">
              <path
                d="M10 60 A50 50 0 0 1 110 60"
                fill="none"
                stroke="color-mix(in srgb, var(--indigo) 28%, white)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M10 60 A50 50 0 0 1 110 60"
                fill="none"
                stroke="var(--blue)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(namedPct / 100) * 157} 157`}
              />
            </svg>
            <div className="mt-4 text-center">
              <p className="text-3xl font-semibold text-blue">{namedPct}%</p>
              <p className="text-xs text-muted-foreground">named this run</p>
            </div>
          </div>
          <p className="mt-2 rounded-full bg-indigo/15 px-3 py-1 text-[12px] font-medium text-blue">
            {named} of {visiblePrompts.length} prompts
          </p>
        </section>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <section className="glass rounded-[1.5rem] px-5 py-5">
          <h2 className="text-base font-semibold">Rival</h2>
          {rival ? (
            <>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-indigo/25 text-sm font-semibold text-blue">
                  {rival.name.slice(0, 1)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{rival.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{rival.domain}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{rival.momentum}</p>
              {limits.diagnosis ? (
                <Link
                  href="/competitors"
                  className="mt-4 inline-flex rounded-full bg-blue px-3 py-1.5 text-xs font-medium text-ivory"
                >
                  See the gap
                </Link>
              ) : (
                <p className="mt-4 text-[13px] text-muted-foreground">
                  Look watches one. We do not explain how to beat them.
                </p>
              )}
            </>
          ) : null}
        </section>

        <section className="glass rounded-[1.5rem] px-5 py-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">AI questions</h2>
            <Link href="/ai-visibility" className="text-xs font-medium text-blue">
              Open
            </Link>
          </div>
          <ul className="space-y-3">
            {visiblePrompts.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-3">
                <p className="text-sm leading-snug">{p.text}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    p.mentionRate > 0 ? "bg-pear/45 text-ink" : "bg-indigo/20 text-blue"
                  }`}
                >
                  {p.mentionRate > 0 ? pct(p.mentionRate) : "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="glass rounded-[1.5rem] px-5 py-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">You rank for</h2>
          <Link
            href="/search"
            className="rounded-full bg-indigo/15 px-2.5 py-1 text-xs font-medium text-blue"
          >
            All Google
          </Link>
        </div>
        <ul className="grid gap-1 sm:grid-cols-2">
          {visibleKeywords.slice(0, 6).map((kw) => (
            <li
              key={kw.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-ivory/40 px-3 py-2.5"
            >
              <span className="truncate text-sm font-medium">{kw.term}</span>
              <span className="shrink-0 text-sm font-semibold text-blue">
                {positionLabel(kw.position)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
