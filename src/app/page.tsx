"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWorkspace } from "@/lib/workspace-context";

export default function HomePage() {
  const router = useRouter();
  const { loading, onboarded } = useWorkspace();

  useEffect(() => {
    if (loading) return;
    router.replace(onboarded ? "/overview" : "/onboarding");
  }, [loading, onboarded, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground">
      Opening…
    </div>
  );
}
