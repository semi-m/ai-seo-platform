"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { PageSkeleton } from "@/components/page-skeleton";
import { SampleNotice } from "@/components/sample-notice";
import { RecommendationList } from "@/components/recommendation-list";
import { UpgradeGate } from "@/components/upgrade-gate";
import { Button } from "@/components/ui/button";
import type { RecStatus } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-context";

const filters: { id: RecStatus | "all"; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "done", label: "Done" },
  { id: "snoozed", label: "Later" },
  { id: "dismissed", label: "Skipped" },
  { id: "all", label: "All" },
];

export default function RecommendationsPage() {
  const { workspace, loading, resetDemo, limits, usingDemo } = useWorkspace();
  const [filter, setFilter] = useState<RecStatus | "all">("open");

  if (loading) {
    return <PageSkeleton label="Loading…" />;
  }

  if (!limits.diagnosis) {
    return (
      <div>
        {usingDemo ? <SampleNotice /> : null}
        <PageHeader
          eyebrow="To fix"
          title="Look does not tell you what to fix"
          description="Look watches a few things. Watch names what is broken. Fix shows you how."
        />
        <UpgradeGate need="pro" title="What to fix is on Watch">
          The list of problems — how big, why we think so, which page. Still no
          how-to. That is a call with us.
        </UpgradeGate>
      </div>
    );
  }

  const items =
    filter === "all"
      ? workspace.recommendations
      : workspace.recommendations.filter((r) => r.status === filter);

  return (
    <div>
      {usingDemo ? <SampleNotice /> : null}
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          eyebrow="To fix"
          title={
            limits.howTo
              ? "What is broken — and how to fix it"
              : "What you should fix. Not how."
          }
          description={
            limits.howTo
              ? "Each card says what is wrong and how to fix it. On a real account this is also the call."
              : "What is wrong, why it matters, and why we think so. We stop before “do this rewrite.” Fix is how — and a call."
          }
        />
        <Button variant="ghost" size="sm" onClick={resetDemo}>
          Reset demo
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-3 py-1 text-xs ${
              filter === f.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <RecommendationList
        items={items}
        empty={
          filter === "open"
            ? "Nothing open. Check Done, or reset the demo."
            : "Nothing in this filter."
        }
      />
    </div>
  );
}
