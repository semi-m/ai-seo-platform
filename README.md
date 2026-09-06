# Lyra — Daily SEO for one brand

A day-to-day look at how you show up on Google and in ChatGPT. The weekly write-up is a **progress document**, not the product.

**Repo:** [github.com/semi-m/ai-seo-platform](https://github.com/semi-m/ai-seo-platform)

## Your next steps (not done yet)

The app code is in this repo. These are the founder steps still open. Tick them as you go.

### See Lyra on your machine

```bash
git clone https://github.com/semi-m/ai-seo-platform.git
cd ai-seo-platform
cp .env.example .env
# paste your keys into .env (never commit .env)
npm install
npm run db:push
npm run dev
```

Open **http://127.0.0.1:4731** — that is Lyra. GitHub is only the code.

### 1. Finish Google login

Open [Google Cloud credentials](https://console.cloud.google.com/apis/credentials) → **Web client 1** (pencil).

Authorized JavaScript origins:

- `http://127.0.0.1:4731`

Authorized redirect URIs:

- `http://127.0.0.1:4731/api/auth/callback/google`

Save. Then in Lyra click **Continue with Google**, add a real company, and on **Plans** hit **Notify me** on Watch.

Direct edit (this project’s client):  
https://console.cloud.google.com/apis/credentials/oauthclient/114284476681-bltcf98tggiapdnkk8m7cr96k13eegnm.apps.googleusercontent.com

### 2. Create the free database (Neon)

SQLite on your laptop works. Vercel will forget it. For a link that stays up:

1. [neon.tech](https://neon.tech) → sign in with GitHub
2. **New Project** → name it `lyra` → **Create**
3. **Connect** → copy the `postgresql://…` string
4. Keep it off GitHub. Paste it into Vercel as `DATABASE_URL` (and send it so we can switch the app from SQLite to Postgres)

### 3. Put Lyra on a public URL (Vercel)

1. [vercel.com/new](https://vercel.com/new) → import **semi-m/ai-seo-platform**
2. Add env vars from `.env.example`. Minimum: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET`, `AUTH_URL` (your `https://….vercel.app`), `DATABASE_URL` (Neon), `FOUNDER_EMAIL`
3. Deploy
4. Back in Google Cloud, add this redirect too: `https://YOUR-APP.vercel.app/api/auth/callback/google`
5. Open the `*.vercel.app` link — that is the always-on Lyra

### Not yet (do not block on these)

- Wiring Search Console, Serper, OpenAI, Gemini (UI still uses the sample company)
- Stripe / paying for Watch and Fix (those buttons collect emails)
- Custom domain, firewall, WAF
- Rotating keys that were pasted in chat (do this after the live link works)

## Three tiers

| Plan | Price | What it is |
| --- | --- | --- |
| **Look** | Free | Your website. Keywords you already rank for. One rival. Daily analytics. AI rank on **3 prompts**. Email if you go up. **No solutions.** |
| **Watch** | Monthly | Daily monitoring + a **weekly progress document**. **5 prompts.** What you should fix (diagnosis, evidence, impact). **Not how to fix it.** |
| **Fix** | Talk to us | You use the same tool. We get on a call and show you **how** — pages, citations, schema. |

Look is the live plan. Watch and Fix collect emails (“Notify me”) until those products open.

## Deploy (the always-on link)

1. Import [semi-m/ai-seo-platform](https://github.com/semi-m/ai-seo-platform) on [Vercel](https://vercel.com/new) (Hobby is free).
2. Add env vars from `.env.example`. Minimum for login: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET`, `AUTH_URL` (your `https://….vercel.app`), `FOUNDER_EMAIL`, `DATABASE_URL`.
3. In Google Cloud → APIs & Services → Credentials → your OAuth client, add Authorized redirect URIs:
   - `http://127.0.0.1:4731/api/auth/callback/google`
   - `https://YOUR-APP.vercel.app/api/auth/callback/google`
4. Deploy. The `*.vercel.app` URL is the app. GitHub is only the code.

## Run

Needs [Node.js LTS](https://nodejs.org) (v20+).

```bash
git clone https://github.com/semi-m/ai-seo-platform.git
cd ai-seo-platform
npm install
npm run dev
```

Open [http://127.0.0.1:4731](http://127.0.0.1:4731)

Then sign in with Google. Each login is written to the SQLite database (`data/lyra.db`): email, name, photo, Google id, last seen, company, and Watch/Fix notify emails. Open **Signups** when you are signed in as `semi@revido.io`.

`npm run db:push` creates the tables. The database file is gitignored.

On Vercel the SQLite file does not last. For the live URL, create a free [Neon](https://neon.tech) Postgres and put that `DATABASE_URL` in Vercel — then tell me and we switch the schema from SQLite to Postgres.

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
