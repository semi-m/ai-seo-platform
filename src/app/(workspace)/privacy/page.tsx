"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { dataRules } from "@/lib/privacy";

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Your data"
        title="We protect the company, not just the login"
        description="Discoverability data is still business data — what you rank for, what ChatGPT says, who you lose to. Here is what we will and will not do."
      />

      <div className="space-y-3">
        {dataRules.map((rule) => (
          <Card key={rule.title}>
            <CardContent className="py-5">
              <h2 className="text-base font-medium">{rule.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {rule.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        OpenRouter is only the spare writer. Measuring ChatGPT uses OpenAI’s
        official API. Citations come from ChatGPT, Gemini, and Google AI
        Overviews — not a paid Perplexity plan. We do not scrape consumer apps
        and we do not put secrets in the public repo.
      </p>
    </div>
  );
}
