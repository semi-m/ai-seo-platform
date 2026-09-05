# Lyra — Daily SEO for one brand

A day-to-day look at how you show up on Google and in ChatGPT. The weekly write-up is a **progress document**, not the product.

**Repo:** [github.com/semi-m/ai-seo-platform](https://github.com/semi-m/ai-seo-platform)

## Three tiers

| Plan | Price | What it is |
| --- | --- | --- |
| **Look** | Free | Your website. Keywords you already rank for. One rival. Daily analytics. AI rank on **3 prompts**. Email if you go up. **No solutions.** |
| **Watch** | Monthly | Daily monitoring + a **weekly progress document**. **5 prompts.** What you should fix (diagnosis, evidence, impact). **Not how to fix it.** |
| **Fix** | Talk to us | You use the same tool. We get on a call and show you **how** — pages, citations, schema. |

Switch tiers in the app under **Plans** to preview the gates (sample company: Northline).

## Run

Needs [Node.js LTS](https://nodejs.org) (v20+).

```bash
git clone https://github.com/semi-m/ai-seo-platform.git
cd ai-seo-platform
npm install
npm run dev
```

Open [http://127.0.0.1:4731](http://127.0.0.1:4731)

## Which APIs (and which not)

Connect only what feeds the model. Copy `.env.example` when you go live.

| Founder name | API | Why |
| --- | --- | --- |
| Your Google Search | Google Search Console | Keywords you already rank for. Free. |
| ChatGPT answers | OpenAI (official API) | Are you named? |
| Spare AI writer | OpenRouter | If OpenAI is down, still write/parse. Not a ChatGPT.com backup. |
| Google page-one | Serper | 2,500 free SERPs for new terms and rivals. |
| Gemini | Gemini API | Google’s AI answers. |
| Your website | Built-in crawl | Pages you can see every day. |
| Who visits | GA4 (optional) | Daily analytics. |

**Do not add for V1:** Perplexity, DataForSEO, Ahrefs API, Semrush, Meta Pixel, scraping ChatGPT’s website.

Live keys plug in through `src/lib/providers.ts`. Until then the UI uses a sample workspace. The full stack list lives in `src/lib/integrations.ts` — it is not a product room.

## Data protection

- Secrets never in this public repo — Vercel env / local `.env` only.
- One workspace per company.
- Vendors get the minimum. No CRM or email lists.
- Last good snapshot stays if a vendor is down.

Internal notes (not a product screen): `src/lib/privacy.ts`.

## Product rule

Scores come from the formula in `src/lib/scoring.ts`. A language model may write the weekly document. It may not invent the numbers or the ranked “to fix” list.
