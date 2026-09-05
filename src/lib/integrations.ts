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
    why: "Shows the real queries people type before they land on you — free, and it is your data.",
    withoutIt: "We can only estimate Google from third-party rank data.",
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
    withoutIt: "Citations come from ChatGPT links, Gemini grounding, and Google AI Overviews via DataForSEO.",
    envVars: ["PERPLEXITY_API_KEY"],
    auth: "api-key",
    tier: "later",
    cost: "Paid — not in V1",
  },
  {
    id: "dataforseo",
    name: "DataForSEO",
    founderName: "Google rankings",
    why: "Keyword demand and where you sit versus rivals. Cheapest serious rank API — you pay per check, no $500/mo seat.",
    withoutIt: "Opportunities have no search volume or position.",
    envVars: ["DATAFORSEO_LOGIN", "DATAFORSEO_PASSWORD"],
    auth: "api-key",
    tier: "required",
    cost: "Pay as you go (~$50 to start)",
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
    why: "Tracks Gemini answers. Google AI Overviews can follow later on the same connection.",
    withoutIt: "ChatGPT and Google AI Overviews still cover most buyer questions.",
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
  "Perplexity API — paid; citations come from ChatGPT, Gemini, and Google AI Overviews instead",
  "Meta Pixel — ads, not discoverability",
  "Semrush or Ahrefs API — $450+/mo seats; add Ahrefs later only for links",
  "Scraping ChatGPT in a browser — breaks their terms; use official APIs",
  "Similarweb-style rival traffic — mostly guesswork",
  "HubSpot / Salesforce — after the weekly action loop works",
];
