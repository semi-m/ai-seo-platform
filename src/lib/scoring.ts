import type { ScoreFactors } from "./types";

/** Weighted opportunity score. Never invented by an LLM — factors come from data. */
export function opportunityScore(factors: ScoreFactors): number {
  const {
    demand,
    relevance,
    gap,
    reachability,
    competitorPressure,
    confidence,
  } = factors;
  const raw =
    demand * 0.24 +
    relevance * 0.2 +
    gap * 0.18 +
    reachability * 0.16 +
    competitorPressure * 0.12 +
    confidence * 0.1;
  return Math.round(raw * 100);
}

export function formatVisits(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toLocaleString("en-US");
}

export function formatDelta(n: number, suffix = "%"): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n}${suffix}`;
}

export function positionLabel(position: number | null): string {
  if (position === null) return "Not ranking";
  return `#${position}`;
}
