"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { WorkspaceProvider } from "@/lib/workspace-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delay={200}>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </TooltipProvider>
  );
}
