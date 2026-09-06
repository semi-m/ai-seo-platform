import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAccountByEmail, recordAccount, saveCompany } from "@/lib/accounts-store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in with Google first." }, { status: 401 });
  }

  const account =
    (await getAccountByEmail(session.user.email)) ??
    (await recordAccount({
      email: session.user.email,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
      googleId: session.user.googleId ?? null,
      emailVerified: session.user.googleEmailVerified,
    }));

  return NextResponse.json(account);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in with Google first." }, { status: 401 });
  }

  let body: { brand?: string; domain?: string; products?: string[] } = {};
  try {
    body = (await request.json()) as { brand?: string; domain?: string; products?: string[] };
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (!body.brand?.trim() || !body.domain?.trim()) {
    return NextResponse.json({ error: "We need the company name and website." }, { status: 400 });
  }

  await recordAccount({
    email: session.user.email,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
    googleId: session.user.googleId ?? null,
      emailVerified: session.user.googleEmailVerified,
  });

  const account = await saveCompany({
    email: session.user.email,
    brand: body.brand.trim(),
    domain: body.domain.trim(),
    products: (body.products ?? []).filter(Boolean),
  });

  return NextResponse.json(account);
}
