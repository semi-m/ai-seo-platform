"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageSkeleton } from "@/components/page-skeleton";
import { SampleNotice } from "@/components/sample-notice";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/lib/workspace-context";

const sourceLabel = {
  selected: "You picked",
  search: "Found on Google",
  ai: "Found in ChatGPT answers",
};

export default function CompetitorsPage() {
  const { loading, limits, visibleRivals, lockedRivalCount, usingDemo } = useWorkspace();
  if (loading) {
    return <PageSkeleton label="Loading rivals…" />;
  }

  return (
    <div>
      {usingDemo ? <SampleNotice /> : null}

      <PageHeader
        eyebrow="Rivals"
        title={limits.rivals === 1 ? "The one rival we watch" : "Who buyers see instead of you"}
        description={
          limits.rivals === 1
            ? "Look watches one rival. We do not explain the gap or tell you how to close it."
            : limits.howTo
              ? "Why they win, and what to do about it."
              : "Who is ahead, and on which searches and ChatGPT questions. Not how to beat them."
        }
      />

      {lockedRivalCount > 0 ? (
        <p className="mb-4 text-sm text-muted-foreground">
          {lockedRivalCount} more rivals unlock on Watch.{" "}
          <Link href="/plans" className="text-primary underline-offset-4 hover:underline">
            See plans
          </Link>
        </p>
      ) : null}

      <div className="space-y-4">
        {visibleRivals.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">{c.name}</CardTitle>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{c.domain}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline">{sourceLabel[c.source]}</Badge>
                  <Badge variant="secondary">{c.momentum}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {limits.diagnosis ? (
                <p className="text-[15px] leading-relaxed">{c.why}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  They show up next to you. Watch explains why. Fix is the call.
                </p>
              )}
              {limits.diagnosis ? (
                <dl className="grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg bg-muted/70 px-3 py-2">
                    <dt className="text-xs text-muted-foreground">Searches they win</dt>
                    <dd className="font-heading text-2xl">{c.keywordGap}</dd>
                  </div>
                  <div className="rounded-lg bg-muted/70 px-3 py-2">
                    <dt className="text-xs text-muted-foreground">ChatGPT they win</dt>
                    <dd className="font-heading text-2xl">{c.promptGap}</dd>
                  </div>
                  <div className="rounded-lg bg-muted/70 px-3 py-2">
                    <dt className="text-xs text-muted-foreground">Sites that name them</dt>
                    <dd className="font-heading text-2xl">{c.sourceGap}</dd>
                  </div>
                </dl>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
