"use client";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HealthSeverity } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-context";

const severityLabel: Record<HealthSeverity, string> = {
  critical: "Critical",
  important: "Important",
  improvement: "Improvement",
};

export default function HealthPage() {
  const { workspace, loading } = useWorkspace();
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading site health…</p>;
  }

  const groups: HealthSeverity[] = ["critical", "important", "improvement"];

  return (
    <div>
      <PageHeader
        eyebrow="Site health"
        title="Only issues that can block discovery"
        description="Not a 200-check audit. Each issue names the pages, the keywords, and the AI prompts it can affect."
      />

      <div className="mb-8 space-y-3">
        {workspace.pages.map((page) => (
          <div
            key={page.path}
            className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3"
          >
            <div>
              <p className="font-mono text-sm">{page.path}</p>
              <p className="text-sm text-muted-foreground">{page.note}</p>
            </div>
            <Badge variant="outline" className="capitalize">
              {page.bucket}
            </Badge>
          </div>
        ))}
      </div>

      {groups.map((severity) => {
        const items = workspace.issues.filter((i) => i.severity === severity);
        if (items.length === 0) return null;
        return (
          <section key={severity} className="mb-6">
            <h2 className="mb-3 font-heading text-xl">{severityLabel[severity]}</h2>
            <div className="space-y-3">
              {items.map((issue) => (
                <Card key={issue.id}>
                  <CardHeader>
                    <CardTitle>{issue.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>{issue.fix}</p>
                    <p className="text-muted-foreground">
                      Pages: {issue.pages.join(", ")}
                    </p>
                    <p className="text-muted-foreground">
                      Keywords: {issue.keywords.join(", ") || "—"}
                    </p>
                    <p className="text-muted-foreground">
                      AI prompts that may be affected: {issue.prompts.join(" · ")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
