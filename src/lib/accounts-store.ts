import { prisma } from "@/lib/db";

export type AccountRecord = {
  email: string;
  name: string | null;
  image: string | null;
  googleId: string | null;
  emailVerified: boolean;
  brand: string | null;
  domain: string | null;
  products: string[];
  onboarded: boolean;
  createdAt: string;
  lastSeenAt: string;
  notifiedPlans: Array<"pro" | "enterprise">;
};

export type WaitlistPlan = "pro" | "enterprise";

export type WaitlistRecord = {
  email: string;
  name: string | null;
  plan: WaitlistPlan;
  createdAt: string;
};

function parseProducts(value: string | null | undefined) {
  try {
    const parsed = JSON.parse(value || "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export async function recordAccount(input: {
  email: string;
  name: string | null;
  image: string | null;
  googleId?: string | null;
  emailVerified?: boolean;
}) {
  const email = input.email.trim().toLowerCase();
  if (!email) return null;

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: input.name,
      image: input.image,
      googleId: input.googleId ?? undefined,
      emailVerified: Boolean(input.emailVerified),
    },
    update: {
      name: input.name ?? undefined,
      image: input.image ?? undefined,
      googleId: input.googleId ?? undefined,
      emailVerified: input.emailVerified ?? undefined,
      lastSeenAt: new Date(),
    },
    include: { waitlist: true },
  });

  return toAccount(user);
}

export async function getAccountByEmail(email: string | null | undefined) {
  if (!email) return null;
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { waitlist: true },
  });
  return user ? toAccount(user) : null;
}

export async function saveCompany(input: {
  email: string;
  brand: string;
  domain: string;
  products: string[];
}) {
  const email = input.email.trim().toLowerCase();
  const domain = input.domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const user = await prisma.user.update({
    where: { email },
    data: {
      brand: input.brand,
      domain,
      products: JSON.stringify(input.products),
      onboarded: true,
      lastSeenAt: new Date(),
    },
    include: { waitlist: true },
  });
  return toAccount(user);
}

export async function addWaitlist(input: {
  email: string;
  name: string | null;
  plan: WaitlistPlan;
  userEmail?: string | null;
}) {
  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error("We need a real email.");
  }

  const owner = input.userEmail
    ? await prisma.user.findUnique({ where: { email: input.userEmail.trim().toLowerCase() } })
    : await prisma.user.findUnique({ where: { email } });

  await prisma.waitlistEntry.upsert({
    where: { email_plan: { email, plan: input.plan } },
    create: {
      email,
      name: input.name,
      plan: input.plan,
      userId: owner?.id,
    },
    update: {
      name: input.name ?? undefined,
      userId: owner?.id ?? undefined,
    },
  });

  return prisma.waitlistEntry.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
  });
}

export async function listSignups() {
  const [accounts, waitlist] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { waitlist: true } }),
    prisma.waitlistEntry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return {
    accounts: accounts.map(toAccount),
    waitlist: waitlist.map(
      (item): WaitlistRecord => ({
        email: item.email,
        name: item.name,
        plan: item.plan as WaitlistPlan,
        createdAt: item.createdAt.toISOString(),
      }),
    ),
  };
}

function toAccount(user: {
  email: string;
  name: string | null;
  image: string | null;
  googleId: string | null;
  emailVerified: boolean;
  brand: string | null;
  domain: string | null;
  products: string;
  onboarded: boolean;
  createdAt: Date;
  lastSeenAt: Date;
  waitlist: Array<{ plan: string }>;
}): AccountRecord {
  return {
    email: user.email,
    name: user.name,
    image: user.image,
    googleId: user.googleId,
    emailVerified: user.emailVerified,
    brand: user.brand,
    domain: user.domain,
    products: parseProducts(user.products),
    onboarded: user.onboarded,
    createdAt: user.createdAt.toISOString(),
    lastSeenAt: user.lastSeenAt.toISOString(),
    notifiedPlans: user.waitlist
      .map((item) => item.plan)
      .filter((plan): plan is WaitlistPlan => plan === "pro" || plan === "enterprise"),
  };
}

export function isFounderEmail(email: string | null | undefined) {
  if (!email) return false;
  const allowed = (process.env.FOUNDER_EMAIL ?? "semi@revido.io")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}
