import type { Effort, Impact, Tone } from "./types";

export function toneClass(tone: Tone): string {
  switch (tone) {
    case "good":
      return "text-ink bg-pear/35 border-pear";
    case "watch":
      return "text-blue bg-indigo/15 border-indigo/40";
    case "bad":
      return "text-blue bg-indigo/25 border-indigo";
    default:
      return "text-muted-foreground bg-muted border-border";
  }
}

export function impactClass(impact: Impact): string {
  switch (impact) {
    case "very-high":
      return "bg-indigo/20 text-blue border-indigo/50";
    case "high":
      return "bg-pear/30 text-ink border-pear/70";
    case "medium":
      return "bg-blue/10 text-blue border-blue/25";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function effortLabel(effort: Effort): string {
  return effort === "low" ? "Quick" : effort === "medium" ? "A half day" : "A real project";
}

export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}
