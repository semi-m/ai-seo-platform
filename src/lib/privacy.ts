/** Internal data-protection rules for founders. Not a customer product screen. */
export const dataRules = [
  {
    title: "Your keys never go in GitHub",
    body: "The repo is public. Secrets live in Vercel env or a local .env. We will not commit them. If a key leaks in chat, rotate it.",
  },
  {
    title: "Each company is its own folder",
    body: "Northline cannot see another brand. Jobs and the database are scoped to one workspace. No shared caches of queries across customers.",
  },
  {
    title: "We send vendors as little as possible",
    body: "Google gets OAuth to read Search Console. OpenAI and Gemini get the buyer questions we already chose — not your full analytics dump.",
  },
  {
    title: "Language models do not get raw customer lists",
    body: "OpenRouter / OpenAI only see a small evidence packet (scores, page URLs, prompt text) to write the weekly progress document. No emails, no CRM, no passwords.",
  },
  {
    title: "We do not train on your workspace",
    body: "We will turn off provider training where the API allows it. We do not sell data. We do not use your GSC queries to build a public keyword index.",
  },
  {
    title: "Last good week stays on our side",
    body: "If a vendor is down, we show your saved folder. We do not re-send your history to a random backup scraper.",
  },
  {
    title: "You can leave",
    body: "Export the folder. Delete the workspace. We drop tokens and snapshots. Google access is revoked when you disconnect.",
  },
];
