"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/lib/workspace-context";

const sourceLabel = {
  selected: "You selected",
  search: "Discovered in search",
  ai: "Discovered in AI answers",
};

export default function CompetitorsPage() {
  const { loading, limits, visibleRivals, lockedRivalCount } = useWorkspace();
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading competitors…</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Rivals"
        title={limits.rivals === 1 ? "The one rival we watch" : "Who buyers see instead of you"}
        description={
          limits.rivals === 1
            ? "Look watches a single competitor. We do not map the gap or tell you how to close it."
            : limits.howTo
              ? "Why they win, and what to do about the gaps."
              : "Who is ahead, and on which keywords and prompts. Not how to beat them."
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
                  They show up next to you. Watch explains the gap. Fix is the call.
                </p>
              )}
              {limits.diagnosis ? (
                <dl className="grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg bg-muted/70 px-3 py-2">
                    <dt className="text-xs text-muted-foreground">Keyword gap</dt>
                    <dd className="font-heading text-2xl">{c.keywordGap}</dd>
                  </div>
                  <div className="rounded-lg bg-muted/70 px-3 py-2">
                    <dt className="text-xs text-muted-foreground">Prompt gap</dt>
                    <dd className="font-heading text-2xl">{c.promptGap}</dd>
                  </div>
                  <div className="rounded-lg bg-muted/70 px-3 py-2">
                    <dt className="text-xs text-muted-foreground">Source gap</dt>
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
