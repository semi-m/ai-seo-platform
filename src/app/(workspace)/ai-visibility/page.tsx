"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageSkeleton } from "@/components/page-skeleton";
import { SampleNotice } from "@/components/sample-notice";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDelta } from "@/lib/scoring";
import { pct } from "@/lib/format";
import type { Prompt, PromptAnswer } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-context";

const engineName: Record<string, string> = {
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  gemini: "Gemini",
};

function answerFor(prompt: Prompt, engine: string): PromptAnswer | undefined {
  return prompt.answers.find((a) => a.engine.toLowerCase() === engine.toLowerCase());
}

function namedByChatgpt(prompt: Prompt): boolean {
  return answerFor(prompt, "ChatGPT")?.named ?? prompt.mentionRate > 0;
}

function excerpt(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : max)}…`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightBrand({ text, brand }: { text: string; brand: string }) {
  if (!brand) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(brand)})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === brand.toLowerCase() ? (
          <mark key={`${part}-${i}`} className="rounded-md bg-pear/55 px-0.5 text-ink">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${i}`}>{part}</span>
        ),
      )}
    </>
  );
}

function QuestionCard({
  prompt,
  brand,
  onSeeAnswer,
}: {
  prompt: Prompt;
  brand: string;
  onSeeAnswer: () => void;
}) {
  const chatgpt = answerFor(prompt, "ChatGPT");
  const gemini = answerFor(prompt, "Gemini");
  const named = namedByChatgpt(prompt);

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {prompt.cluster} · {prompt.market}
            </p>
            <h3 className="mt-1 text-base font-medium leading-snug">“{prompt.text}”</h3>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              named ? "bg-pear/45 text-ink" : "bg-indigo/20 text-blue"
            }`}
          >
            {named ? "Named" : "Not named"}
          </span>
        </div>

        {chatgpt ? (
          <blockquote className="rounded-2xl bg-ivory/55 px-3.5 py-3 text-sm leading-relaxed text-ink/85">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue/70">
              ChatGPT said
            </p>
            <p>
              “
              <HighlightBrand text={excerpt(chatgpt.text)} brand={brand} />”
            </p>
            {!chatgpt.named ? (
              <p className="mt-2 text-xs font-medium text-blue">
                {brand} is not in this answer.
              </p>
            ) : null}
          </blockquote>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2">
          {!named && gemini?.named ? (
            <p className="text-xs font-medium text-blue">Gemini named you here.</p>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onSeeAnswer}
            className="rounded-full bg-indigo/20 px-3 py-1.5 text-xs font-medium text-blue hover:bg-indigo/30"
          >
            See answer
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function AnswerPanel({
  answer,
  brand,
}: {
  answer: PromptAnswer;
  brand: string;
}) {
  return (
    <section className="rounded-2xl bg-ivory/60 px-4 py-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{answer.engine}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            answer.named ? "bg-pear/45 text-ink" : "bg-indigo/20 text-blue"
          }`}
        >
          {answer.named ? `Named ${brand}` : `Did not name ${brand}`}
        </span>
      </div>
      <p className="text-sm leading-relaxed">
        <HighlightBrand text={answer.text} brand={brand} />
      </p>
    </section>
  );
}

export default function AiVisibilityPage() {
  const { workspace, loading, limits, visiblePrompts, lockedPromptCount, usingDemo } =
    useWorkspace();
  const [openId, setOpenId] = useState<string | null>(null);

  if (loading) {
    return <PageSkeleton label="Checking ChatGPT…" />;
  }

  const named = visiblePrompts.filter((p) => namedByChatgpt(p)).length;
  const namedPrompts = visiblePrompts.filter((p) => namedByChatgpt(p));
  const missedPrompts = visiblePrompts.filter((p) => !namedByChatgpt(p));
  const selected = visiblePrompts.find((p) => p.id === openId) ?? null;
  const brand = workspace.brand;

  return (
    <div>
      {usingDemo ? <SampleNotice /> : null}

      <PageHeader
        eyebrow="ChatGPT & AI"
        title={`Named on ${named} of ${visiblePrompts.length} questions people ask ChatGPT`}
        description={
          limits.rankedKeywordsOnly && !limits.diagnosis
            ? "Look asks ChatGPT three questions. Named means they said your name. We do not tell you how to show up for more."
            : limits.howTo
              ? "Every question we ask, plus the answers. What is in the way. Which sites ChatGPT already uses."
              : "Five questions. We show who is named — and the answers. We do not tell you how to get named more."
        }
      />

      <section className="mb-6 grid gap-3 sm:grid-cols-2">
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
                  Said your name {pct(engine.mentionRate)} · linked to you{" "}
                  {pct(engine.citationRate)}
                </p>
              </CardContent>
            </Card>
          ))}
      </section>

      {lockedPromptCount > 0 ? (
        <p className="mb-4 text-sm text-muted-foreground">
          {lockedPromptCount} more questions sit on a higher plan.{" "}
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
            ChatGPT names rivals on questions where you are missing. The sites
            it already uses do not mention you. Watch stops there. Fix walks the
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
              Get named on the sites ChatGPT already uses. These five leave you
              out:
            </p>
            <ul className="space-y-2">
              {workspace.sources
                .filter((s) => !s.mentionsUs)
                .map((s) => (
                  <li key={s.domain} className="rounded-lg border border-border px-3 py-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{s.domain}</span>
                      <Badge variant="outline">Chance {s.opportunity}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">{s.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Used by{" "}
                      {s.citedBy.map((id) => engineName[id] ?? id).join(", ")} ·
                      names {s.mentionsCompetitors.join(", ")}
                    </p>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <section className="mb-8 space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-base font-semibold">ChatGPT named you</h2>
          <span className="rounded-full bg-pear/40 px-2.5 py-1 text-[11px] font-medium text-ink">
            {namedPrompts.length}{" "}
            {namedPrompts.length === 1 ? "question" : "questions"}
          </span>
        </div>
        {namedPrompts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              ChatGPT did not say {brand} on these questions.
            </CardContent>
          </Card>
        ) : (
          namedPrompts.map((prompt) => (
            <QuestionCard
              key={prompt.id}
              prompt={prompt}
              brand={brand}
              onSeeAnswer={() => setOpenId(prompt.id)}
            />
          ))
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-base font-semibold">ChatGPT did not name you</h2>
          <span className="rounded-full bg-indigo/20 px-2.5 py-1 text-[11px] font-medium text-blue">
            {missedPrompts.length}{" "}
            {missedPrompts.length === 1 ? "question" : "questions"}
          </span>
        </div>
        {missedPrompts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              ChatGPT named {brand} on every question we asked.
            </CardContent>
          </Card>
        ) : (
          missedPrompts.map((prompt) => (
            <QuestionCard
              key={prompt.id}
              prompt={prompt}
              brand={brand}
              onSeeAnswer={() => setOpenId(prompt.id)}
            />
          ))
        )}
      </section>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setOpenId(null)}>
        {selected ? (
          <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
            <SheetHeader>
              <SheetTitle className="pr-8 text-left text-xl leading-snug">
                “{selected.text}”
              </SheetTitle>
              <SheetDescription className="text-left text-[15px] leading-relaxed">
                {namedByChatgpt(selected)
                  ? `ChatGPT named ${brand} in the answer.`
                  : `ChatGPT did not name ${brand} in the answer.`}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-3 px-4 pb-8">
              {selected.answers
                .filter((a) => a.engine !== "Perplexity")
                .map((answer) => (
                  <AnswerPanel key={answer.engine} answer={answer} brand={brand} />
                ))}

              {limits.diagnosis ? (
                <p className="text-sm text-muted-foreground">
                  Also named: {selected.competitorsPresent.join(", ") || "nobody else"}.
                </p>
              ) : null}

              {limits.howTo && selected.blockers.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    What is in the way
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {selected.blockers.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </SheetContent>
        ) : null}
      </Sheet>
    </div>
  );
}
