"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDelta } from "@/lib/scoring";
import { pct } from "@/lib/format";
import { useWorkspace } from "@/lib/workspace-context";

export default function AiVisibilityPage() {
  const { workspace, loading } = useWorkspace();
  const [cluster, setCluster] = useState<string>("all");

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading AI visibility…</p>;
  }

  const clusters = ["all", ...new Set(workspace.prompts.map((p) => p.cluster))];
  const prompts =
    cluster === "all"
      ? workspace.prompts
      : workspace.prompts.filter((p) => p.cluster === cluster);
  const missing = workspace.prompts.filter((p) => p.mentionRate === 0);
  const aiPillar = workspace.discoverability.pillars.find((p) => p.id === "ai");

  return (
    <div>
      <PageHeader
        eyebrow="AI visibility"
        title={`You are absent from ${missing.length} high-intent prompts`}
        description="Not “AI visibility = 42%.” Each prompt was sampled 3 times across ChatGPT, Perplexity, and Gemini. Mention rate and citation rate are stored separately — ChatGPT often mentions without linking."
      />

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        {workspace.engines.map((engine) => (
          <Card key={engine.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>{engine.label}</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {formatDelta(engine.delta)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl tracking-tight">{engine.visibility}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Share of voice {engine.sov}% · mentions {pct(engine.mentionRate)} ·
                citations {pct(engine.citationRate)}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {aiPillar ? (
        <p className="mb-6 text-sm text-muted-foreground">
          Overall AI pillar {aiPillar.score}/100. {aiPillar.summary}
        </p>
      ) : null}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Why you are not visible</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            The biggest reason is weak third-party authority in the sources these
            engines actually use — not a missing H1. These five sources are the
            best opportunities:
          </p>
          <ul className="space-y-2">
            {workspace.sources
              .filter((s) => !s.mentionsUs)
              .map((s) => (
                <li key={s.domain} className="rounded-lg border border-border px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{s.domain}</span>
                    <Badge variant="outline">Opportunity {s.opportunity}</Badge>
                  </div>
                  <p className="mt-1 text-muted-foreground">{s.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Cited by {s.citedBy.join(", ")} · mentions{" "}
                    {s.mentionsCompetitors.join(", ")}
                  </p>
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mb-3 flex flex-wrap gap-2">
        {clusters.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCluster(c)}
            className={`rounded-full border px-3 py-1 text-xs ${
              cluster === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {c === "all" ? "All clusters" : c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {prompts.map((prompt) => {
          const absent = prompt.mentionRate === 0;
          return (
            <Card key={prompt.id}>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {prompt.cluster} · {prompt.intent} · {prompt.market} ·{" "}
                      {prompt.samples} samples
                    </p>
                    <h3 className="mt-1 text-base font-medium leading-snug">
                      “{prompt.text}”
                    </h3>
                  </div>
                  <Badge variant={absent ? "destructive" : "secondary"}>
                    {absent ? "Absent" : `${pct(prompt.mentionRate)} mentioned`}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Citation rate {pct(prompt.citationRate)}. Competitors present:{" "}
                  {prompt.competitorsPresent.join(", ") || "none"}.
                </p>
                <div className="grid gap-2 text-xs sm:grid-cols-3">
                  {Object.entries(prompt.engines).map(([engine, sample]) => (
                    <div key={engine} className="rounded-md bg-muted/70 px-2 py-1.5">
                      <span className="capitalize">{engine}</span>
                      <span className="block text-muted-foreground">
                        mention {pct(sample.mentionRate)} · cite {pct(sample.citationRate)}
                      </span>
                    </div>
                  ))}
                </div>
                {prompt.blockers.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {prompt.blockers.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-emerald-800">
                    No major blockers on this prompt — protect the coverage.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
