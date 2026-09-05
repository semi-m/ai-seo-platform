"use client";

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
  const { workspace, loading } = useWorkspace();
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading competitors…</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Rivals"
        title="Who buyers see instead of you"
        description="Some rivals you already know. Some only show up in ChatGPT. We keep those lists separate."
      />

      <div className="space-y-4">
        {workspace.competitors.map((c) => (
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
              <p className="text-[15px] leading-relaxed">{c.why}</p>
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
              <p className="text-xs text-muted-foreground">
                Gaps are keywords, prompts, and cited sources — not estimated
                competitor sessions. Third-party traffic numbers are guesswork.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
