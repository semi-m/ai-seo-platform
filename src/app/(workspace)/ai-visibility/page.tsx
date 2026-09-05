"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageSkeleton } from "@/components/page-skeleton";
import { SampleNotice } from "@/components/sample-notice";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDelta } from "@/lib/scoring";
import { pct } from "@/lib/format";
import { useWorkspace } from "@/lib/workspace-context";

export default function AiVisibilityPage() {
  const { workspace, loading, limits, visiblePrompts, lockedPromptCount, usingDemo } =
    useWorkspace();

  if (loading) {
    return <PageSkeleton label="Loading AI visibility…" />;
  }

  const named = visiblePrompts.filter((p) => p.mentionRate > 0).length;

  return (
    <div>
      {usingDemo ? <SampleNotice /> : null}

      <PageHeader
        eyebrow="ChatGPT & AI"
        title={
          limits.diagnosis
            ? `Named on ${named} of ${visiblePrompts.length} tracked prompts`
            : `AI rank on ${visiblePrompts.length} prompts`
        }
        description={
          limits.rankedKeywordsOnly && !limits.diagnosis
            ? "Look scores three buyer questions. Mention = they said your name. We do not tell you how to show up for more."
            : limits.howTo
              ? "Full prompt set, blockers, and the sources to get into."
              : "Five prompts. We show who is named. We do not write the citation playbook."
        }
      />

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        {workspace.engines
          .filter((e) => e.id !== "perplexity")
          .map((engine) => (
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
                  Mentions {pct(engine.mentionRate)} · citations {pct(engine.citationRate)}
                </p>
              </CardContent>
            </Card>
          ))}
      </section>

      {lockedPromptCount > 0 ? (
        <p className="mb-4 text-sm text-muted-foreground">
          {lockedPromptCount} more prompts sit on a higher plan.{" "}
          <Link href="/plans" className="text-primary underline-offset-4 hover:underline">
            See plans
          </Link>
        </p>
      ) : null}

      {limits.diagnosis && !limits.howTo ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What is wrong — not how to repair it</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            You are absent from prompts where rivals are named. The sources AI
            already cites do not mention you. Watch stops there. Fix walks the
            list on a call.
          </CardContent>
        </Card>
      ) : null}

      {limits.howTo ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to show up more</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              Get represented in the sources these engines already use. These
              five omit you:
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
      ) : null}

      <div className="space-y-3">
        {visiblePrompts.map((prompt) => {
          const absent = prompt.mentionRate === 0;
          return (
            <Card key={prompt.id}>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {prompt.cluster} · {prompt.intent} · {prompt.market}
                    </p>
                    <h3 className="mt-1 text-base font-medium leading-snug">
                      “{prompt.text}”
                    </h3>
                  </div>
                  <Badge variant={absent ? "destructive" : "secondary"}>
                    {absent ? "Not named" : `${pct(prompt.mentionRate)} named`}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Citation {pct(prompt.citationRate)}
                  {limits.diagnosis
                    ? `. Also named: ${prompt.competitorsPresent.join(", ") || "nobody else"}.`
                    : "."}
                </p>
                {limits.howTo && prompt.blockers.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {prompt.blockers.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
