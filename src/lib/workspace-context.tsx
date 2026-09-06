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
import { planById, planLimits, type Plan, type PlanId, type PlanLimits } from "./tiers";
import type {
  Competitor,
  Keyword,
  Prompt,
  RecStatus,
  Recommendation,
  Workspace,
} from "./types";

const STORAGE_KEY = "lyra-workspace-overrides";

type Overrides = {
  brand?: string;
  domain?: string;
  products?: string[];
  recStatus?: Record<string, RecStatus>;
  connections?: Record<string, boolean>;
  onboarded?: boolean;
  plan?: PlanId;
  notifiedPlans?: Array<Exclude<PlanId, "free">>;
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
  planId: PlanId;
  plan: Plan;
  limits: PlanLimits;
  visibleKeywords: Keyword[];
  visiblePrompts: Prompt[];
  visibleRivals: Competitor[];
  lockedKeywordCount: number;
  lockedPromptCount: number;
  lockedRivalCount: number;
  completeOnboarding: (input: {
    brand: string;
    domain: string;
    products: string[];
  }) => void;
  setRecStatus: (id: string, status: RecStatus) => void;
  toggleConnection: (id: string) => void;
  setPlan: (id: PlanId) => void;
  notifiedPlans: Array<Exclude<PlanId, "free">>;
  markNotified: (id: Exclude<PlanId, "free">) => void;
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

function rankedKeywords(keywords: Keyword[]) {
  return keywords.filter((k) => k.bucket !== "opportunity" && k.position !== null);
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

  const planId: PlanId = "free";
  const limits = planLimits[planId];
  const plan = planById[planId];
  const notifiedPlans = overrides.notifiedPlans ?? [];

  const keywordPool = limits.rankedKeywordsOnly
    ? rankedKeywords(workspace.keywords)
    : workspace.keywords;
  const visibleKeywords = keywordPool;
  const visiblePrompts = workspace.prompts.slice(0, limits.prompts);
  const visibleRivals = workspace.competitors.slice(0, limits.rivals);
  const lockedKeywordCount = workspace.keywords.length - visibleKeywords.length;
  const lockedPromptCount = Math.max(0, workspace.prompts.length - visiblePrompts.length);
  const lockedRivalCount = Math.max(0, workspace.competitors.length - visibleRivals.length);

  const connections = overrides.connections ?? {};
  const required = integrations.filter((i) => i.tier === "required");
  const requiredConnected = required.filter(
    (i) => i.auth === "built-in" || connections[i.id],
  ).length;
  const connectedCount = integrations.filter(
    (i) => i.auth === "built-in" || connections[i.id],
  ).length;
  const usingDemo = requiredConnected < required.length;

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    fetch("/api/account")
      .then((res) => (res.ok ? res.json() : null))
      .then((account: {
        brand?: string | null;
        domain?: string | null;
        products?: string[];
        onboarded?: boolean;
        notifiedPlans?: Array<Exclude<PlanId, "free">>;
      } | null) => {
        if (cancelled || !account) return;
        setOverrides((prev) => ({
          ...prev,
          brand: account.brand || prev.brand,
          domain: account.domain || prev.domain,
          products: account.products?.length ? account.products : prev.products,
          onboarded: account.onboarded || prev.onboarded,
          notifiedPlans: account.notifiedPlans?.length
            ? account.notifiedPlans
            : prev.notifiedPlans,
        }));
      })
      .catch(() => {
        /* stay on local copy */
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  const completeOnboarding = useCallback(
    (input: { brand: string; domain: string; products: string[] }) => {
      const domain = input.domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
      const products = input.products.filter(Boolean);
      setOverrides((prev) => ({
        ...prev,
        brand: input.brand,
        domain,
        products,
        onboarded: true,
      }));
      void fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: input.brand, domain, products }),
      });
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

  const setPlan = useCallback((id: PlanId) => {
    if (id !== "free") return;
    setOverrides((prev) => ({ ...prev, plan: "free" }));
  }, []);

  const markNotified = useCallback((id: Exclude<PlanId, "free">) => {
    setOverrides((prev) => {
      const current = prev.notifiedPlans ?? [];
      if (current.includes(id)) return prev;
      return { ...prev, notifiedPlans: [...current, id] };
    });
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
      providerLabel: usingDemo ? "Sample company" : "Your data",
      planId,
      plan,
      limits,
      visibleKeywords,
      visiblePrompts,
      visibleRivals,
      lockedKeywordCount,
      lockedPromptCount,
      lockedRivalCount,
      completeOnboarding,
      setRecStatus,
      toggleConnection,
      setPlan,
      notifiedPlans,
      markNotified,
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
      planId,
      plan,
      limits,
      visibleKeywords,
      visiblePrompts,
      visibleRivals,
      lockedKeywordCount,
      lockedPromptCount,
      lockedRivalCount,
      completeOnboarding,
      setRecStatus,
      toggleConnection,
      setPlan,
      notifiedPlans,
      markNotified,
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
