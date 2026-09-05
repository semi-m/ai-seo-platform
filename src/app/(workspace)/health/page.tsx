"use client";

import Link from "next/link";
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
  const { workspace, loading, limits } = useWorkspace();
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading site health…</p>;
  }

  const groups: HealthSeverity[] = ["critical", "important", "improvement"];

  return (
    <div>
      <PageHeader
        eyebrow="Website"
        title="Your pages"
        description={
          limits.diagnosis
            ? limits.howTo
              ? "What is wrong on money pages, and how to repair it."
              : "What is wrong on money pages. Not the repair steps."
            : "Look lets you see the site. We do not list solutions."
        }
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

      {!limits.diagnosis ? (
        <Card>
          <CardContent className="py-5">
            <p className="text-base font-medium">
              {workspace.issues.length} issues sit behind Watch
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Monthly tells you what is broken. Enterprise shows you how to fix it
              on a call.
            </p>
            <Link
              href="/plans"
              className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
            >
              See plans
            </Link>
          </CardContent>
        </Card>
      ) : (
        groups.map((severity) => {
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
                      {limits.howTo ? <p>{issue.fix}</p> : (
                        <p className="text-muted-foreground">
                          This is the problem. The repair steps are on Fix.
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        Pages: {issue.pages.join(", ")}
                      </p>
                      <p className="text-muted-foreground">
                        Keywords: {issue.keywords.join(", ") || "—"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
