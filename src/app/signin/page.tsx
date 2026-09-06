import { Compass } from "lucide-react";
import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  const params = await searchParams;
  const googleReady = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-[1.75rem] border border-ink/15 bg-ivory px-6 py-8 shadow-lg sm:px-8">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-pear text-ink shadow-sm">
            <Compass className="size-4" />
          </span>
          <p className="text-lg font-semibold tracking-tight text-blue">Lyra</p>
        </div>

        <h1 className="font-heading text-[2rem] leading-tight tracking-tight">
          Create an account with Google
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Use the Google login for your business. You land on Look — we watch
          your site. Watch and Fix are not for sale yet. Leave your email there
          and we will tell you when they open.
        </p>

        {params.error ? (
          <p className="mt-4 rounded-2xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Google came back but the login cookie did not stick. Try Continue
            with Google once more in this preview — not in a separate Chrome tab.
          </p>
        ) : null}

        {googleReady ? (
          <form
            className="mt-8"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: params.callbackUrl || "/" });
            }}
          >
            <Button type="submit" size="lg" className="h-11 w-full rounded-full">
              Continue with Google
            </Button>
          </form>
        ) : (
          <p className="mt-8 rounded-2xl bg-indigo/15 px-3 py-2 text-sm text-blue">
            Google login needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in
            .env.
          </p>
        )}

        <p className="mt-5 text-center text-[11px] text-muted-foreground">
          We only get your name and email. Look stays free.
        </p>
      </div>
    </div>
  );
}
