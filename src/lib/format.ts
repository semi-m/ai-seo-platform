import type { Effort, Impact, Tone } from "./types";

export function toneClass(tone: Tone): string {
  switch (tone) {
    case "good":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "watch":
      return "text-amber-800 bg-amber-50 border-amber-200";
    case "bad":
      return "text-red-700 bg-red-50 border-red-200";
    default:
      return "text-stone-600 bg-stone-50 border-stone-200";
  }
}

export function impactClass(impact: Impact): string {
  switch (impact) {
    case "very-high":
      return "bg-red-50 text-red-800 border-red-200";
    case "high":
      return "bg-amber-50 text-amber-900 border-amber-200";
    case "medium":
      return "bg-stone-100 text-stone-700 border-stone-200";
    default:
      return "bg-stone-50 text-stone-500 border-stone-200";
  }
}

export function effortLabel(effort: Effort): string {
  return effort === "low" ? "Low effort" : effort === "medium" ? "Medium effort" : "High effort";
}

export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}
