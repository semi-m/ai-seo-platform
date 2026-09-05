"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { effortLabel, impactClass } from "@/lib/format";
import { opportunityScore } from "@/lib/scoring";
import type { Recommendation } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-context";

const factorLabels: Record<string, string> = {
  demand: "Demand",
  relevance: "Relevance",
  gap: "Gap",
  reachability: "Reachable",
  competitorPressure: "Competitor pressure",
  confidence: "Confidence",
};

export function RecommendationDrawer({
  rec,
  open,
  onOpenChange,
}: {
  rec: Recommendation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { setRecStatus } = useWorkspace();
  if (!rec) return null;
  const score = opportunityScore(rec.factors);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="pr-8 text-left text-xl leading-snug">
            {rec.action}
          </SheetTitle>
          <SheetDescription className="text-left text-[15px] leading-relaxed">
            {rec.reason}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-wrap gap-2 px-4">
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${impactClass(rec.impact)}`}
          >
            {rec.impactLabel}
          </span>
          <Badge variant="outline">{effortLabel(rec.effort)}</Badge>
          <Badge variant="outline">Confidence {rec.confidence}</Badge>
          {rec.channels.map((c) => (
            <Badge key={c} variant="secondary">
              {c}
            </Badge>
          ))}
        </div>

        <div className="space-y-5 px-4 pb-8">
          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Why this ranks #{score}
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Score = 0.24 demand + 0.20 relevance + 0.18 gap + 0.16 reachability +
              0.12 competitor pressure + 0.10 confidence. The model writes the
              sentences. It does not invent this number.
            </p>
            <dl className="space-y-2">
              {Object.entries(rec.factors).map(([key, value]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-xs">
                    <dt>{factorLabels[key] ?? key}</dt>
                    <dd>{Math.round(value * 100)}</dd>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Evidence
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {rec.why.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            {rec.page ? (
              <div>
                <dt className="text-xs text-muted-foreground">Page</dt>
                <dd className="font-mono text-xs">{rec.page}</dd>
              </div>
            ) : null}
            {rec.market ? (
              <div>
                <dt className="text-xs text-muted-foreground">Market</dt>
                <dd>{rec.market}</dd>
              </div>
            ) : null}
            {rec.competitor ? (
              <div>
                <dt className="text-xs text-muted-foreground">Competitor evidence</dt>
                <dd>{rec.competitor}</dd>
              </div>
            ) : null}
          </dl>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                setRecStatus(rec.id, "done");
                onOpenChange(false);
              }}
            >
              Mark done
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setRecStatus(rec.id, "snoozed");
                onOpenChange(false);
              }}
            >
              Snooze
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setRecStatus(rec.id, "dismissed");
                onOpenChange(false);
              }}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
