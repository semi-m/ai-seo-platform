"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { demoWorkspace } from "./demo-provider";
import { integrations } from "./integrations";
import type { RecStatus, Recommendation, Workspace } from "./types";

const STORAGE_KEY = "atlas-workspace-overrides";

type Overrides = {
  brand?: string;
  domain?: string;
  products?: string[];
  recStatus?: Record<string, RecStatus>;
  connections?: Record<string, boolean>;
  onboarded?: boolean;
};

type WorkspaceContextValue = {
  workspace: Workspace;
  loading: boolean;
  onboarded: boolean;
  connections: Record<string, boolean>;
  connectedCount: number;
  requiredConnected: number;
  usingDemo: boolean;
  providerLabel: string;
  completeOnboarding: (input: {
    brand: string;
    domain: string;
    products: string[];
  }) => void;
  setRecStatus: (id: string, status: RecStatus) => void;
  toggleConnection: (id: string) => void;
  resetDemo: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function applyOverrides(base: Workspace, overrides: Overrides): Workspace {
  const recStatus = overrides.recStatus ?? {};
  return {
    ...base,
    brand: overrides.brand || base.brand,
    domain: overrides.domain || base.domain,
    products: overrides.products?.length ? overrides.products : base.products,
    recommendations: base.recommendations.map((rec) => ({
      ...rec,
      status: recStatus[rec.id] ?? rec.status,
    })),
  };
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOverrides(JSON.parse(raw) as Overrides);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }, [hydrated, overrides]);

  const workspace = useMemo(
    () => applyOverrides(demoWorkspace, overrides),
    [overrides],
  );

  const connections = overrides.connections ?? {};
  const required = integrations.filter((i) => i.tier === "required");
  const requiredConnected = required.filter(
    (i) => i.auth === "built-in" || connections[i.id],
  ).length;
  const connectedCount = integrations.filter(
    (i) => i.auth === "built-in" || connections[i.id],
  ).length;
  const usingDemo = requiredConnected < required.length;

  const completeOnboarding = useCallback(
    (input: { brand: string; domain: string; products: string[] }) => {
      setOverrides((prev) => ({
        ...prev,
        brand: input.brand,
        domain: input.domain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
        products: input.products.filter(Boolean),
        onboarded: true,
      }));
    },
    [],
  );

  const setRecStatus = useCallback((id: string, status: RecStatus) => {
    setOverrides((prev) => ({
      ...prev,
      recStatus: { ...prev.recStatus, [id]: status },
    }));
  }, []);

  const toggleConnection = useCallback((id: string) => {
    setOverrides((prev) => ({
      ...prev,
      connections: {
        ...prev.connections,
        [id]: !prev.connections?.[id],
      },
    }));
  }, []);

  const resetDemo = useCallback(() => {
    setOverrides({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspace,
      loading: !hydrated,
      onboarded: Boolean(overrides.onboarded),
      connections,
      connectedCount,
      requiredConnected,
      usingDemo,
      providerLabel: usingDemo ? "Sample report" : "Your data",
      completeOnboarding,
      setRecStatus,
      toggleConnection,
      resetDemo,
    }),
    [
      workspace,
      hydrated,
      overrides.onboarded,
      connections,
      connectedCount,
      requiredConnected,
      usingDemo,
      completeOnboarding,
      setRecStatus,
      toggleConnection,
      resetDemo,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}

export function openRecommendations(recs: Recommendation[]) {
  return recs.filter((r) => r.status === "open");
}
