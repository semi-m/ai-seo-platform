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

/** Engine / env stack for later live fetches. Not a customer product screen. */
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
    id: "serper",
    name: "Serper",
    founderName: "Google page-one check",
    why: "2,500 free searches to start, no card. We look up a query and see if you (or a rival) are on the results. Replaces DataForSEO for rankings.",
    withoutIt: "Search Console still shows queries you already get. We cannot check brand-new terms or rivals on Google.",
    envVars: ["SERPER_API_KEY"],
    auth: "api-key",
    tier: "required",
    cost: "Free 2,500 then cheap credits",
  },
  {
    id: "dataforseo",
    name: "DataForSEO",
    founderName: "Paid SEO index (skip)",
    why: "Keyword volumes and backlinks. Not free. Serper + Search Console cover V1.",
    withoutIt: "We do not need it.",
    envVars: ["DATAFORSEO_LOGIN", "DATAFORSEO_PASSWORD"],
    auth: "api-key",
    tier: "later",
    cost: "Paid — skipped",
  },
  {
    id: "cse",
    name: "Google Programmable Search",
    founderName: "Backup Google check",
    why: "Google’s own 100/day free search API. Spare if Serper is out.",
    withoutIt: "Serper + Search Console are enough.",
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
    id: "bing",
    name: "Bing Webmaster",
    founderName: "Your backlinks (free)",
    why: "Free API for sites you verify. Shows who links to you. Not rivals — ChatGPT invented that Common Crawl can do competitor links. It cannot, not as a simple API.",
    withoutIt: "We still crawl your site. We just will not have a free inbound-link list.",
    envVars: ["BING_WEBMASTER_API_KEY"],
    auth: "api-key",
    tier: "helpful",
    cost: "Free",
  },
  {
    id: "tavily",
    name: "Tavily",
    founderName: "Research search (optional)",
    why: "1,000 free credits/month. Good for finding pages and sources. Not a Google rank tracker — Serper does that.",
    withoutIt: "Serper + ChatGPT/Gemini cover search and AI.",
    envVars: ["TAVILY_API_KEY"],
    auth: "api-key",
    tier: "helpful",
    cost: "Free 1,000/mo",
  },
  {
    id: "brave",
    name: "Brave Search",
    founderName: "Spare web search",
    why: "Small free credit each month. Independent index if Google/Serper blip. Not your Google rankings.",
    withoutIt: "Serper is enough for V1.",
    envVars: ["BRAVE_SEARCH_API_KEY"],
    auth: "api-key",
    tier: "helpful",
    cost: "Free credits / month",
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
  "DataForSEO / Semrush / Ahrefs paid API — Serper replaces SERPs",
  "Google Ads API for volumes — free in theory, weeks of approval; GSC impressions are enough in V1",
  "Common Crawl for competitor backlinks — raw web dumps, not an API. Not usable for Lyra",
  "Ahrefs Webmaster Free — no real API. Paid Ahrefs API is expensive",
  "Perplexity API — paid; citations come from ChatGPT and Gemini instead",
  "Meta Pixel — ads, not discoverability",
  "Scraping ChatGPT in a browser — breaks their terms; use official APIs",
  "Similarweb-style rival traffic — mostly guesswork",
  "HubSpot / Salesforce — after the weekly action loop works",
];
