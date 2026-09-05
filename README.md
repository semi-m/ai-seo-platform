# Atlas — Discoverability for founders

A weekly action list, not an SEO dashboard. Home asks: **what should we do this week?**

**Repo:** [github.com/semi-m/ai-seo-platform](https://github.com/semi-m/ai-seo-platform)

## Run

Needs [Node.js LTS](https://nodejs.org) (v20+).

```bash
git clone https://github.com/semi-m/ai-seo-platform.git
cd ai-seo-platform
npm install
npm run dev
```

Open [http://127.0.0.1:4731](http://127.0.0.1:4731)

Or **Code → Download ZIP**, unzip, then the same `npm` commands.

## Which APIs (and which not)

Connect only what feeds the model. Copy `.env.example` when you go live.

| Founder name | API | Why |
| --- | --- | --- |
| Your Google Search | Google Search Console | Real queries and clicks. Free. Connect first. |
| ChatGPT answers | OpenAI (official API) | Are you named in ChatGPT answers? |
| AI citations | Perplexity | Which sites AI cites — the list you can actually get on. |
| Google rankings | DataForSEO | Demand + position. Pay per check, no $500/mo seat. |
| Your website | Built-in crawl | Broken pages and missing proof. No third-party API. |
| Who visits | GA4 (optional) | Did ChatGPT send anyone? |
| Gemini | Gemini API (optional) | Google’s AI answers. |

**Do not add for V1:** Meta Pixel, Semrush, Ahrefs (unless you later want a link index), scraping the ChatGPT website, Similarweb rival traffic, CRM.

Live keys plug in through `src/lib/providers.ts`. Until then the UI uses a full sample workspace (Northline).

## Product rule

A language model may write the weekly paragraph. It may not invent scores. Ranking of actions is the formula in `src/lib/scoring.ts`.
