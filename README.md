# Atlas — Discoverability intelligence

A founder-facing V1 of the product described in the SEO Supreme spec: one model of **search + AI visibility + competitors**, turned into a ranked **do this week** list.

This is not another Semrush. The homepage is a weekly narrative and five actions. Keyword tables, prompt samples, and site issues sit one click down.

## What you can click through

- **Onboarding** — brand, domain, products. Loads a complete Northline (AI agency, BE/NL/US) demo workspace.
- **Overview** — four pillars (Search, AI, Authority, Health) with a written formula, channel mix, markets, competitor movement, top actions.
- **Search** — Winning / Growing / Declining / Opportunities, each with a decision (protect / improve / create).
- **AI visibility** — ChatGPT, Perplexity, Gemini scorecards, citation sources, “why we are absent,” prompt clusters with 3-sample mention/citation rates.
- **Competitors** — selected vs search-discovered vs AI-discovered, with keyword / prompt / source gaps. No fake competitor session counts.
- **Recommendations** — ranked actions with Show why (factor breakdown). Done / snooze / dismiss persist in the browser.
- **Site health** — a handful of issues tied to money pages, keywords, and prompts.

## Data

V1 ships a **demo provider**. Live Google Search Console, DataForSEO (keywords/SERP/on-page), and official LLM APIs implement the same `DiscoverabilityProvider` interface in `src/lib/providers.ts`. Recommendation rank is a written weighted formula in `src/lib/scoring.ts` — a language model must not invent the number.

## Run locally

```bash
npm install
npm run dev
```

App: [http://127.0.0.1:4731](http://127.0.0.1:4731)

## Stack

Next.js (App Router), TypeScript, Tailwind, shadcn/ui.

## Repo

This project lives on Cursor Origin as `semjada-muhameti/ai-seo-platform` (private). It is not a GitHub.com repository unless you connect one later.
