# Atlas — Discoverability intelligence

Founder dashboard for search + AI visibility + competitors, with a ranked “do this week” list.

**GitHub:** [github.com/semi-m/ai-seo-platform](https://github.com/semi-m/ai-seo-platform)

## Run on your Mac

Needs [Node.js LTS](https://nodejs.org) (v20 or newer). Then:

```bash
git clone https://github.com/semi-m/ai-seo-platform.git
cd ai-seo-platform
npm install
npm run dev
```

Open [http://127.0.0.1:4731](http://127.0.0.1:4731)

No Git? On the repo page click **Code → Download ZIP**, unzip, then `cd` into the folder and run `npm install` and `npm run dev`.

## What’s in the app

Demo workspace (Northline, AI agency). No API keys required.

- Onboarding → Overview (weekly narrative + four scores + top actions)
- Search, AI visibility, Competitors, Recommendations (Show why / Done), Site health

Live GSC / DataForSEO / LLM adapters can replace the demo provider later (`src/lib/providers.ts`).
