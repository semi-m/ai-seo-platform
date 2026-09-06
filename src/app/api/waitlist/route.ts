import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addWaitlist, isFounderEmail, listSignups, type WaitlistPlan } from "@/lib/accounts-store";

function asPlan(value: unknown): WaitlistPlan | null {
  return value === "pro" || value === "enterprise" ? value : null;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in with Google first." }, { status: 401 });
  }

  let body: { email?: string; plan?: string } = {};
  try {
    body = (await request.json()) as { email?: string; plan?: string };
  } catch {
    body = {};
  }

  const plan = asPlan(body.plan);
  if (!plan) {
    return NextResponse.json({ error: "Pick Watch or Fix." }, { status: 400 });
  }

  const email = (body.email?.trim() || session.user.email).toLowerCase();
  try {
    await addWaitlist({
      email,
      name: session.user.name ?? null,
      plan,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save that email.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, email, plan });
}

export async function GET() {
  const session = await auth();
  if (!isFounderEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json(await listSignups());
}
