"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageSkeleton } from "@/components/page-skeleton";
import { SampleNotice } from "@/components/sample-notice";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { KeywordBucket } from "@/lib/types";
import { formatVisits, positionLabel } from "@/lib/scoring";
import { useWorkspace } from "@/lib/workspace-context";

const allBuckets: { id: KeywordBucket; label: string; blurb: string }[] = [
  { id: "winning", label: "You rank", blurb: "Terms you already appear for. Leave the winners alone." },
  { id: "growing", label: "Going up", blurb: "These pages are working." },
  { id: "declining", label: "Slipping", blurb: "You used to sit higher." },
  { id: "opportunity", label: "Should go after", blurb: "People search this. You barely show up." },
];

export default function SearchPage() {
  const { loading, limits, visibleKeywords, lockedKeywordCount, usingDemo } =
    useWorkspace();
  const buckets = limits.rankedKeywordsOnly
    ? allBuckets.filter((b) => b.id !== "opportunity")
    : allBuckets;
  const [tab, setTab] = useState<KeywordBucket>("winning");

  const counts = useMemo(() => {
    const map = Object.fromEntries(buckets.map((b) => [b.id, 0])) as Record<
      KeywordBucket,
      number
    >;
    for (const kw of visibleKeywords) {
      if (map[kw.bucket] !== undefined) map[kw.bucket] += 1;
    }
    return map;
  }, [visibleKeywords, buckets]);

  if (loading) {
    return <PageSkeleton label="Loading keywords…" />;
  }

  const activeTab = buckets.some((b) => b.id === tab) ? tab : "winning";

  return (
    <div>
      {usingDemo ? <SampleNotice /> : null}

      <PageHeader
        eyebrow="Google"
        title={
          limits.rankedKeywordsOnly
            ? "Keywords you already rank for"
            : "What people type — and whether you show up"
        }
        description={
          limits.rankedKeywordsOnly
            ? "Look finds the terms you already appear on. Gaps and “how to show up for more” are not on this plan."
            : limits.howTo
              ? "Four piles, including what to improve and how."
              : "Four piles. We tell you what is weak. We do not write the page brief."
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {buckets.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setTab(b.id)}
            className={`rounded-full border px-3 py-1 text-xs ${
              activeTab === b.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {b.label} ({counts[b.id] ?? 0})
          </button>
        ))}
      </div>

      {lockedKeywordCount > 0 ? (
        <p className="mb-4 text-sm text-muted-foreground">
          {lockedKeywordCount} gap terms are on Watch.{" "}
          <Link href="/plans" className="text-primary underline-offset-4 hover:underline">
            See plans
          </Link>
        </p>
      ) : null}

      {buckets
        .filter((b) => b.id === activeTab)
        .map((b) => {
          const rows = visibleKeywords.filter((k) => k.bucket === b.id);
          return (
            <div key={b.id} className="space-y-3">
              <p className="text-sm text-muted-foreground">{b.blurb}</p>
              {rows.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    Nothing in this pile.
                  </CardContent>
                </Card>
              ) : (
                rows.map((kw) => (
                  <Card key={kw.id}>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-medium">{kw.term}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {limits.diagnosis
                              ? `${formatVisits(kw.volume)} impressions proxy · `
                              : null}
                            {kw.market} · {positionLabel(kw.position)}
                            {kw.previousPosition !== null && kw.position !== null
                              ? ` (was #${kw.previousPosition})`
                              : ""}
                          </p>
                        </div>
                        {limits.diagnosis ? (
                          <Badge variant="outline">Gap {kw.opportunityScore}</Badge>
                        ) : (
                          <Badge variant="secondary">{kw.bucket}</Badge>
                        )}
                      </div>
                      {limits.diagnosis && !limits.howTo ? (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {kw.action === "create"
                            ? "Problem: no URL covers this. We are not writing the new page."
                            : kw.action === "improve"
                              ? `Problem: ${kw.page ?? "this page"} is not winning. Competitors: ${kw.competitors.join(", ") || "none listed"}.`
                              : `You already own ${kw.page ?? "this term"}.`}
                        </p>
                      ) : null}
                      {limits.howTo ? (
                        <p className="text-sm leading-relaxed">
                          {kw.action === "create" && (
                            <>
                              How: <strong>create a new page</strong>. Potential ~
                              {formatVisits(kw.potentialTraffic)} visits if you reach
                              a realistic first page.
                            </>
                          )}
                          {kw.action === "improve" && (
                            <>
                              How: <strong>improve {kw.page}</strong>. Do not create a
                              duplicate. Competitors winning:{" "}
                              {kw.competitors.join(", ") || "none listed"}.
                            </>
                          )}
                          {kw.action === "protect" && (
                            <>
                              How: <strong>leave {kw.page} alone</strong>. Strong
                              position — do not rewrite it for fun.
                            </>
                          )}
                        </p>
                      ) : null}
                      {limits.howTo ? (
                        <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                          <span>Difficulty {kw.difficulty}</span>
                          <span>·</span>
                          <span>Relevance {kw.relevance}</span>
                          {kw.page ? (
                            <>
                              <span>·</span>
                              <span className="font-mono">{kw.page}</span>
                            </>
                          ) : null}
                        </div>
                      ) : kw.page && limits.diagnosis ? (
                        <p className="font-mono text-xs text-muted-foreground">{kw.page}</p>
                      ) : null}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          );
        })}
    </div>
  );
}
