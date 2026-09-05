"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
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
  const { workspace, loading, resetDemo, limits } = useWorkspace();
  const [filter, setFilter] = useState<RecStatus | "all">("open");

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (!limits.diagnosis) {
    return (
      <div>
        <PageHeader
          eyebrow="To fix"
          title="Look does not give you solutions"
          description="Free monitors a few things. Watch names what is broken. Fix shows you how."
        />
        <UpgradeGate need="pro" title="What to fix is a monthly feature">
          From the document: the ranked list of problems — impact, evidence, which
          page or prompt. Still no playbook. That is the enterprise call.
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
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          eyebrow="To fix"
          title={
            limits.howTo
              ? "What is broken — and how to repair it"
              : "What you should fix. Not how."
          }
          description={
            limits.howTo
              ? "This is the enterprise layer. Each card has the diagnosis and the playbook. On a real account this is also the call agenda."
              : "From the spec: action, reason, impact, evidence. We stop before “do this rewrite.” Upgrade to Fix for the how — and a working session."
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
