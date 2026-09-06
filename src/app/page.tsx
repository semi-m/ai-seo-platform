"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWorkspace } from "@/lib/workspace-context";

export default function HomePage() {
  const router = useRouter();
  const { status } = useSession();
  const { loading, onboarded } = useWorkspace();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }
    if (status !== "authenticated" || loading) return;
    router.replace(onboarded ? "/overview" : "/onboarding");
  }, [loading, onboarded, router, status]);

  return (
    <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground">
      Opening…
    </div>
  );
}
