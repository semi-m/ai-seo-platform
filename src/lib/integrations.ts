export type IntegrationStatus = "demo" | "connected" | "later";
export type IntegrationTier = "required" | "helpful" | "later";

export type Integration = {
  id: string;
  name: string;
  founderName: string;
  why: string;
  withoutIt: string;
  envVars: string[];
  auth: "oauth" | "api-key" | "built-in";
  tier: IntegrationTier;
  cost: string;
};

/** Only APIs that feed the discoverability model. Nothing for ads or CRM. */
export const integrations: Integration[] = [
  {
    id: "gsc",
    name: "Google Search Console",
    founderName: "Your Google Search",
    why: "Free. Real queries, clicks, and average position for your site. This replaces a paid rank tracker for everything you already appear on.",
    withoutIt: "We cannot see what Google already sends you.",
    envVars: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
    auth: "oauth",
    tier: "required",
    cost: "Free",
  },
  {
    id: "openai",
    name: "OpenAI",
    founderName: "ChatGPT answers",
    why: "Asks ChatGPT the buyer questions in your market and checks if you are named or cited.",
    withoutIt: "No ChatGPT visibility — the channel founders care about first.",
    envVars: ["OPENAI_API_KEY"],
    auth: "api-key",
    tier: "required",
    cost: "Pay per prompt run",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    founderName: "Perplexity (skip)",
    why: "Best citation links, but it is a paid API. Lyra will not require it.",
    withoutIt: "Citations come from ChatGPT links and Gemini grounding.",
    envVars: ["PERPLEXITY_API_KEY"],
    auth: "api-key",
    tier: "later",
    cost: "Paid — not in V1",
  },
  {
    id: "dataforseo",
    name: "DataForSEO",
    founderName: "Paid rank index (skip)",
    why: "Huge keyword database. Not free. Lyra uses Search Console instead.",
    withoutIt: "We use your real GSC positions and impressions. No fake '6.2K volume' from a paid index.",
    envVars: ["DATAFORSEO_LOGIN", "DATAFORSEO_PASSWORD"],
    auth: "api-key",
    tier: "later",
    cost: "Paid — not in V1",
  },
  {
    id: "cse",
    name: "Google Programmable Search",
    founderName: "Quick Google check (optional)",
    why: "100 free searches/day. We can check “are we on page one for this question?” without buying a rank API.",
    withoutIt: "Search Console still covers queries you already get. New keywords wait until they appear in GSC or we infer them from your pages.",
    envVars: ["GOOGLE_CSE_ID", "GOOGLE_CSE_API_KEY"],
    auth: "api-key",
    tier: "helpful",
    cost: "Free (100/day)",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    founderName: "Spare AI writer",
    why: "One key, many models. If OpenAI is down, we still write the Monday note and parse answers via Claude or Gemini. Not a replacement for measuring ChatGPT.",
    withoutIt: "If OpenAI’s chat API dies, the pretty paragraph dies. The action list still works from saved numbers.",
    envVars: ["OPENROUTER_API_KEY"],
    auth: "api-key",
    tier: "required",
    cost: "Pay per call, pick cheap fallbacks",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    founderName: "Gemini & AI Overviews",
    why: "Tracks Gemini answers and grounded sources. That is our free stand-in for AI Overviews.",
    withoutIt: "ChatGPT still covers the main buyer questions.",
    envVars: ["GEMINI_API_KEY"],
    auth: "api-key",
    tier: "helpful",
    cost: "Pay per prompt run",
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    founderName: "Who actually visits",
    why: "Ties discovery to visits — including people coming from ChatGPT and other AI tabs.",
    withoutIt: "We know if AI names you, not if anyone clicked through.",
    envVars: ["GA4_PROPERTY_ID"],
    auth: "oauth",
    tier: "helpful",
    cost: "Free",
  },
  {
    id: "crawl",
    name: "Site crawl",
    founderName: "Your website check",
    why: "We fetch your pages ourselves. Finds broken titles, missing proof, and pages Google or AI cannot read.",
    withoutIt: "Site issues stay hidden.",
    envVars: [],
    auth: "built-in",
    tier: "required",
    cost: "Included",
  },
];

export const skipIntegrations = [
  "DataForSEO / Semrush / Ahrefs — paid indexes. Search Console is free and more accurate for your site",
  "Perplexity API — paid; citations come from ChatGPT and Gemini instead",
  "Meta Pixel — ads, not discoverability",
  "Semrush or Ahrefs API — $450+/mo seats; add Ahrefs later only for links",
  "Scraping ChatGPT in a browser — breaks their terms; use official APIs",
  "Similarweb-style rival traffic — mostly guesswork",
  "HubSpot / Salesforce — after the weekly action loop works",
];
