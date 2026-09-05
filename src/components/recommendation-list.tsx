"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { effortLabel, impactClass } from "@/lib/format";
import type { Recommendation } from "@/lib/types";
import { RecommendationDrawer } from "./recommendation-drawer";

export function RecommendationList({
  items,
  empty,
}: {
  items: Recommendation[];
  empty: string;
}) {
  const [active, setActive] = useState<Recommendation | null>(null);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          {empty}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <ol className="space-y-3">
        {items.map((rec, index) => (
          <li key={rec.id}>
            <Card className="transition-shadow hover:shadow-sm">
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">#{index + 1}</p>
                  <h3 className="mt-0.5 text-base font-medium leading-snug">
                    {rec.action}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {rec.reason}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${impactClass(rec.impact)}`}
                    >
                      {rec.impactLabel}
                    </span>
                    <Badge variant="outline">{effortLabel(rec.effort)}</Badge>
                    {rec.channels.map((c) => (
                      <Badge key={c} variant="secondary">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => setActive(rec)}
                >
                  Why this
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
      <RecommendationDrawer
        rec={active}
        open={Boolean(active)}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      />
    </>
  );
}
