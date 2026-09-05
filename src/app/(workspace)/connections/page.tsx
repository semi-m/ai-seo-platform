"use client";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { integrations, skipIntegrations } from "@/lib/integrations";
import { useWorkspace } from "@/lib/workspace-context";

export default function ConnectionsPage() {
  const { connections, toggleConnection, usingDemo } = useWorkspace();

  return (
    <div>
      <PageHeader
        eyebrow="Connect"
        title="The stack — plus a spare brain"
        description="Search Console for keywords you rank for. Serper for page-one checks. ChatGPT and Gemini for AI rank. Daily analytics when GA4 is on."
      />

      <p className="mb-8 text-[13px] leading-relaxed text-muted-foreground">
        {usingDemo
          ? "Toggles here are remembered in this browser. They do not pull live Google or ChatGPT yet — the rooms still show the sample company."
          : "Required sources are marked on. Live fetches still need the keys in the environment."}
      </p>

      <section className="mb-10">
        <h2 className="mb-3 font-heading text-xl">Do these first</h2>
        <div className="space-y-3">
          {integrations
            .filter((i) => i.tier === "required")
            .map((item) => {
              const on = item.auth === "built-in" || Boolean(connections[item.id]);
              return (
                <Card key={item.id}>
                  <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-medium">{item.founderName}</h3>
                        <Badge variant="outline">{item.cost}</Badge>
                        {on ? (
                          <Badge variant="secondary">On</Badge>
                        ) : (
                          <Badge variant="outline">Not connected</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed">{item.why}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Without it: {item.withoutIt}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                        {item.name}
                        {item.envVars.length ? ` · ${item.envVars.join(", ")}` : ""}
                      </p>
                    </div>
                    {item.auth === "built-in" ? (
                      <Button variant="outline" size="sm" disabled>
                        Always on
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant={on ? "outline" : "default"}
                        onClick={() => toggleConnection(item.id)}
                      >
                        {on ? "Disconnect" : "Connect"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-heading text-xl">Add when you care about visits</h2>
        <div className="space-y-3">
          {integrations
            .filter((i) => i.tier === "helpful")
            .map((item) => {
              const on = Boolean(connections[item.id]);
              return (
                <Card key={item.id}>
                  <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-medium">{item.founderName}</h3>
                        <Badge variant="outline">{item.cost}</Badge>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed">{item.why}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={on ? "outline" : "default"}
                      onClick={() => toggleConnection(item.id)}
                    >
                      {on ? "Disconnect" : "Connect"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-xl">Skip these on purpose</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          {skipIntegrations.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
