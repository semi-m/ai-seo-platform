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
  demand: "How many people ask",
  relevance: "Fits what you sell",
  gap: "How far behind you are",
  reachability: "Can you actually win this",
  competitorPressure: "Rivals already there",
  confidence: "How sure we are",
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
  const { setRecStatus, limits } = useWorkspace();
  if (!rec) return null;
  const score = opportunityScore(rec.factors);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="pr-8 text-left text-xl leading-snug">
            {rec.problem}
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
          {limits.howTo ? (
            <Badge variant="outline">{effortLabel(rec.effort)}</Badge>
          ) : null}
          <Badge variant="outline">How sure we are {rec.confidence}</Badge>
          {rec.channels.map((c) => (
            <Badge key={c} variant="secondary">
              {c}
            </Badge>
          ))}
        </div>

        <div className="space-y-5 px-4 pb-8">
          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Why this is #{score} on the list
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              We stack six things: how many people ask, whether it fits what you
              sell, how far behind you are, whether you can win, whether rivals
              already own it, and how sure we are. The number comes from those —
              not made up.
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

          {limits.howTo ? (
            <section>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                How to fix it
              </h3>
              <p className="text-sm leading-relaxed">{rec.howTo}</p>
            </section>
          ) : (
            <section>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                How to fix it
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Watch names the problem. Fix is a call — we walk this with you.
              </p>
            </section>
          )}

          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Why we think this
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
                <dt className="text-xs text-muted-foreground">Country</dt>
                <dd>{rec.market}</dd>
              </div>
            ) : null}
            {rec.competitor ? (
              <div>
                <dt className="text-xs text-muted-foreground">Rival who is winning</dt>
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
              Later
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setRecStatus(rec.id, "dismissed");
                onOpenChange(false);
              }}
            >
              Skip
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
