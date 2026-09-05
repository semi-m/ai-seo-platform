export type PlanId = "free" | "pro" | "enterprise";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  cadence: string;
  promise: string;
  includes: string[];
  notIncluded: string[];
};

/** Free watches. Paid diagnoses. Enterprise shows you how — on a call. */
export const plans: Plan[] = [
  {
    id: "free",
    name: "Look",
    price: "Free",
    cadence: "Every day",
    promise:
      "Look at your website. We find the keywords you already rank for, watch one rival, check daily visits, and score you on three AI prompts. If you go up, we email you. We do not tell you what to fix.",
    includes: [
      "Your website pages",
      "Keywords you already rank for",
      "One rival",
      "Daily analytics snapshot",
      "AI rank on 3 prompts",
      "Email when a ranking goes up",
    ],
    notIncluded: [
      "Keywords you should go after",
      "Weekly progress document",
      "What to fix",
      "How to fix it",
    ],
  },
  {
    id: "pro",
    name: "Watch",
    price: "Monthly",
    cadence: "Every day + Monday document",
    promise:
      "Daily monitoring plus a weekly progress document. We tell you what is broken and where you are losing. We do not show you how to fix it.",
    includes: [
      "Everything in Look",
      "Daily monitoring of rankings, AI, and traffic",
      "Weekly progress document",
      "AI rank on 5 prompts",
      "Slipping terms and keyword gaps",
      "More than one rival",
      "What you should fix — diagnosis only",
      "Site issues that hide you: what is wrong, not how to repair it",
    ],
    notIncluded: ["How to fix it", "A working session with us"],
  },
  {
    id: "enterprise",
    name: "Fix",
    price: "Talk to us",
    cadence: "The tool + a call",
    promise:
      "You use the same product. We get on a call and show you how to fix it — pages, citations, schema, the lot.",
    includes: [
      "Everything in Watch",
      "Full prompt set, not a cap of five",
      "How to fix each issue",
      "Playbooks for pages, citations, and site health",
      "A working session with us",
    ],
    notIncluded: [],
  },
];

export const planById = Object.fromEntries(plans.map((p) => [p.id, p])) as Record<
  PlanId,
  Plan
>;

export type PlanLimits = {
  rivals: number;
  prompts: number;
  rankedKeywordsOnly: boolean;
  weeklyDocument: boolean;
  diagnosis: boolean;
  howTo: boolean;
  emailOnUp: boolean;
  dailyAnalytics: boolean;
  workingCall: boolean;
};

export const planLimits: Record<PlanId, PlanLimits> = {
  free: {
    rivals: 1,
    prompts: 3,
    rankedKeywordsOnly: true,
    weeklyDocument: false,
    diagnosis: false,
    howTo: false,
    emailOnUp: true,
    dailyAnalytics: true,
    workingCall: false,
  },
  pro: {
    rivals: Number.POSITIVE_INFINITY,
    prompts: 5,
    rankedKeywordsOnly: false,
    weeklyDocument: true,
    diagnosis: true,
    howTo: false,
    emailOnUp: true,
    dailyAnalytics: true,
    workingCall: false,
  },
  enterprise: {
    rivals: Number.POSITIVE_INFINITY,
    prompts: Number.POSITIVE_INFINITY,
    rankedKeywordsOnly: false,
    weeklyDocument: true,
    diagnosis: true,
    howTo: true,
    emailOnUp: true,
    dailyAnalytics: true,
    workingCall: true,
  },
};

export function isPlanId(value: string): value is PlanId {
  return value === "free" || value === "pro" || value === "enterprise";
}

export function minPlanFor(need: "pro" | "enterprise"): PlanId {
  return need;
}
