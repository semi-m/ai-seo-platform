"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { RecommendationList } from "@/components/recommendation-list";
import { Button } from "@/components/ui/button";
import type { RecStatus } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-context";

const filters: { id: RecStatus | "all"; label: string }[] = [
  { id: "open", label: "This week" },
  { id: "done", label: "Done" },
  { id: "snoozed", label: "Snoozed" },
  { id: "dismissed", label: "Dismissed" },
  { id: "all", label: "All" },
];

export default function RecommendationsPage() {
  const { workspace, loading, resetDemo } = useWorkspace();
  const [filter, setFilter] = useState<RecStatus | "all">("open");

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading actions…</p>;
  }

  const items =
    filter === "all"
      ? workspace.recommendations
      : workspace.recommendations.filter((r) => r.status === filter);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          eyebrow="Recommendations"
          title="The operating list — not another report"
          description="Every action has a reason, estimated impact, effort, and a Show why breakdown. Done / snooze / dismiss are saved in this browser."
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
            ? "Nothing open. Check Done, or reset the demo to restore the starter list."
            : "Nothing in this filter."
        }
      />
    </div>
  );
}
