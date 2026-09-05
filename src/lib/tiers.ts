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

/** Look watches. Watch names what is broken. Fix shows you how — on a call. */
export const plans: Plan[] = [
  {
    id: "free",
    name: "Look",
    price: "Free",
    cadence: "Every day",
    promise:
      "Look at your website. We find the searches you already show up for, watch one rival, check daily visits, and ask ChatGPT three questions. If you go up, we email you. We do not tell you what to fix.",
    includes: [
      "Your website pages",
      "Searches you already show up for",
      "One rival",
      "Yesterday’s visits",
      "Named on 3 ChatGPT questions",
      "Email when you go up",
    ],
    notIncluded: [
      "Searches you should go after",
      "Monday write-up",
      "What to fix",
      "How to fix it",
    ],
  },
  {
    id: "pro",
    name: "Watch",
    price: "Monthly",
    cadence: "Every day + Monday write-up",
    promise:
      "We watch every day, plus a Monday write-up. We tell you what is broken and where you are losing. We do not show you how to fix it.",
    includes: [
      "Everything in Look",
      "We watch Google, ChatGPT, and visits every day",
      "Monday write-up",
      "Named on 5 ChatGPT questions",
      "Searches that slipped, and searches you should go after",
      "More than one rival",
      "What you should fix — not how",
      "What is broken on your site — not how to repair it",
    ],
    notIncluded: ["How to fix it", "A working session with us"],
  },
  {
    id: "enterprise",
    name: "Fix",
    price: "Talk to us",
    cadence: "The tool + a call",
    promise:
      "You use the same product. We get on a call and show you how to fix it — pages, getting named, the lot.",
    includes: [
      "Everything in Watch",
      "Every ChatGPT question we ask, not a cap of five",
      "How to fix each issue",
      "Step-by-step for pages, getting named, and what is broken on the site",
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
