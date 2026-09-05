"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageSkeleton } from "@/components/page-skeleton";
import { SampleNotice } from "@/components/sample-notice";
import type { ContentPage, HealthSeverity } from "@/lib/types";
import { formatDelta, formatVisits } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-context";

const severityLabel: Record<HealthSeverity, string> = {
  critical: "Critical",
  important: "Important",
  improvement: "Nice to fix",
};

const bucketLabel: Record<ContentPage["bucket"], string> = {
  top: "Top",
  growing: "Going up",
  decaying: "Sliding",
  underperforming: "Soft",
  missing: "No page yet",
};

const channelBar: Record<string, string> = {
  Google: "bg-blue",
  ChatGPT: "bg-indigo",
  "AI referrals": "bg-indigo",
  "Typed your site": "bg-pear",
  Direct: "bg-pear",
  "Other websites": "bg-blue/70",
  Referral: "bg-blue/70",
  LinkedIn: "bg-indigo/80",
  Email: "bg-pear/70",
};

function deltaClass(n: number) {
  return n > 0 ? "text-blue" : n < 0 ? "text-muted-foreground" : "text-muted-foreground";
}

export default function HealthPage() {
  const { workspace, loading, limits, usingDemo } = useWorkspace();
  if (loading) {
    return <PageSkeleton label="Loading traffic…" />;
  }

  const groups: HealthSeverity[] = ["critical", "important", "improvement"];
  const pages = [...workspace.pages].sort((a, b) => b.traffic - a.traffic);
  const markets = [...workspace.markets].sort((a, b) => b.traffic - a.traffic);
  const channels = [...workspace.channels].sort((a, b) => b.visits - a.visits);
  const periodVisits = channels.reduce((sum, channel) => sum + channel.visits, 0);

  return (
    <div>
      {usingDemo ? <SampleNotice /> : null}

      <PageHeader
        eyebrow="Website"
        title="Who sent people"
        description="Yesterday’s visits. Who sent them. Which pages they opened."
      />

      <section className="glass mb-4 rounded-[1.5rem] px-5 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-blue/70">
          Yesterday
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-blue sm:text-5xl">
          {formatVisits(workspace.daily.visits)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className={deltaClass(workspace.daily.visitsDelta)}>
            {formatDelta(workspace.daily.visitsDelta)} visits
          </span>
          {" · "}
          {workspace.daily.checkedAt}
          {periodVisits > 0 ? ` · ${formatVisits(periodVisits)} in this mix` : null}
        </p>
      </section>

      <div className="mb-4 grid gap-4 lg:grid-cols-5">
        <section className="glass rounded-[1.5rem] px-5 py-5 lg:col-span-3">
          <h2 className="text-base font-semibold">Who sent people</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Google, ChatGPT, and the rest.
          </p>
          {channels.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              We do not have this mix yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {channels.map((channel) => (
                <li key={channel.name}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold">{channel.name}</p>
                    <p className="shrink-0 text-sm font-semibold text-blue">
                      {formatVisits(channel.visits)}
                      <span className="ml-2 text-xs font-medium text-muted-foreground">
                        {channel.share}%
                      </span>
                    </p>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-indigo/15">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        channelBar[channel.name] ?? "bg-blue",
                      )}
                      style={{ width: `${Math.max(channel.share, 2)}%` }}
                    />
                  </div>
                  <p className={cn("mt-1 text-[11px]", deltaClass(channel.delta))}>
                    {formatDelta(channel.delta)} vs last check
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass rounded-[1.5rem] px-5 py-5 lg:col-span-2">
          <h2 className="text-base font-semibold">Where they live</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Which countries those people came from.
          </p>
          {markets.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              We do not have this mix yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {markets.map((market) => (
                <li
                  key={market.code}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-ivory/40 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo/20 text-[11px] font-semibold text-blue">
                        {market.code}
                      </span>
                      <p className="truncate text-sm font-semibold">{market.country}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-blue">
                      {formatVisits(market.traffic)}
                    </p>
                    <p className={cn("text-[11px]", deltaClass(market.trafficDelta))}>
                      {formatDelta(market.trafficDelta)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="glass mb-6 rounded-[1.5rem] px-5 py-5">
          <h2 className="text-base font-semibold">Which pages they opened</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Where those people landed.
          </p>
          {pages.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              We do not have page visits yet.
            </p>
        ) : (
          <ul className="mt-4 space-y-1">
            {pages.map((page) => (
              <li
                key={page.path}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="font-mono text-sm font-medium">{page.path}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{page.note}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-full bg-indigo/15 px-2.5 py-1 text-[11px] font-medium text-blue">
                    {bucketLabel[page.bucket]}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue">
                      {page.traffic === 0 ? "—" : formatVisits(page.traffic)}
                    </p>
                    <p className={cn("text-[11px]", deltaClass(page.trafficDelta))}>
                      {page.traffic === 0 && page.trafficDelta === 0
                        ? "No visits yet"
                        : formatDelta(page.trafficDelta)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {!limits.diagnosis ? (
        <section className="glass rounded-[1.5rem] px-5 py-5">
          <p className="text-base font-medium">
            {workspace.issues.length} things on your site sit behind Watch
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Look shows the visits. Watch names what is broken.
          </p>
          <Link
            href="/plans"
            className="mt-3 inline-flex rounded-full bg-indigo/15 px-3 py-1.5 text-xs font-medium text-blue"
          >
            See plans
          </Link>
        </section>
      ) : (
        groups.map((severity) => {
          const items = workspace.issues.filter((i) => i.severity === severity);
          if (items.length === 0) return null;
          return (
            <section key={severity} className="mb-6">
              <h2 className="mb-3 text-base font-semibold">{severityLabel[severity]}</h2>
              <div className="space-y-3">
                {items.map((issue) => (
                  <div key={issue.id} className="glass rounded-[1.5rem] px-5 py-5">
                    <p className="text-sm font-semibold">{issue.title}</p>
                    <div className="mt-2 space-y-2 text-sm">
                      {limits.howTo ? (
                        <p>{issue.fix}</p>
                      ) : (
                        <p className="text-muted-foreground">
                          This is the problem. How to fix it is on Fix.
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        Pages: {issue.pages.join(", ")}
                      </p>
                      <p className="text-muted-foreground">
                        Searches: {issue.keywords.join(", ") || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
