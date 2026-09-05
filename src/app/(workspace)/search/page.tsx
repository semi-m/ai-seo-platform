"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { KeywordBucket } from "@/lib/types";
import { formatVisits, positionLabel } from "@/lib/scoring";
import { useWorkspace } from "@/lib/workspace-context";

const buckets: { id: KeywordBucket; label: string; blurb: string }[] = [
  { id: "opportunity", label: "Should go after", blurb: "People search this. You barely show up." },
  { id: "declining", label: "Slipping", blurb: "You used to show up higher. You are losing ground." },
  { id: "growing", label: "Getting better", blurb: "Keep going. These pages are working." },
  { id: "winning", label: "Already yours", blurb: "Leave these alone. Do not rewrite them for fun." },
];

export default function SearchPage() {
  const { workspace, loading } = useWorkspace();
  const [tab, setTab] = useState<KeywordBucket>("opportunity");

  const counts = useMemo(() => {
    const map = Object.fromEntries(buckets.map((b) => [b.id, 0])) as Record<
      KeywordBucket,
      number
    >;
    for (const kw of workspace.keywords) map[kw.bucket] += 1;
    return map;
  }, [workspace.keywords]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading keywords…</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Google"
        title="What people type — and whether you show up"
        description="Four piles. Pick a pile, do the recommended page action. No spreadsheet."
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as KeywordBucket)}>
        <TabsList variant="line" className="mb-4 h-auto w-full flex-wrap justify-start">
          {buckets.map((b) => (
            <TabsTrigger key={b.id} value={b.id}>
              {b.label} ({counts[b.id]})
            </TabsTrigger>
          ))}
        </TabsList>
        {buckets.map((b) => {
          const rows = workspace.keywords.filter((k) => k.bucket === b.id);
          return (
            <TabsContent key={b.id} value={b.id} className="space-y-3">
              <p className="text-sm text-muted-foreground">{b.blurb}</p>
              {rows.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    Nothing in this bucket for the demo workspace.
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
                            {formatVisits(kw.volume)} monthly demand · {kw.market} ·{" "}
                            {positionLabel(kw.position)}
                            {kw.previousPosition !== null && kw.position !== null
                              ? ` (was #${kw.previousPosition})`
                              : ""}
                          </p>
                        </div>
                        <Badge variant="outline">Opportunity {kw.opportunityScore}</Badge>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {kw.action === "create" && (
                          <>
                            Recommendation: <strong>create a new page</strong>. No existing URL
                            covers this intent. Potential ~{formatVisits(kw.potentialTraffic)}{" "}
                            visits if you reach a realistic first-page position.
                          </>
                        )}
                        {kw.action === "improve" && (
                          <>
                            Recommendation: <strong>improve {kw.page}</strong> instead of
                            creating a duplicate. Competitors winning:{" "}
                            {kw.competitors.join(", ") || "none listed"}.
                          </>
                        )}
                        {kw.action === "protect" && (
                          <>
                            Recommendation: <strong>protect {kw.page}</strong>. Already a
                            strong position — do not cannibalize it.
                          </>
                        )}
                      </p>
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
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
