export type Tone = "good" | "watch" | "bad" | "neutral";

export type PillarId = "search" | "ai" | "authority" | "health";

export type Pillar = {
  id: PillarId;
  label: string;
  score: number;
  delta: number;
  tone: Tone;
  summary: string;
  href: string;
};

export type Channel = {
  name: string;
  visits: number;
  delta: number;
  share: number;
};

export type Market = {
  country: string;
  code: string;
  traffic: number;
  trafficDelta: number;
  search: number;
  ai: number;
  note: string;
};

export type KeywordBucket = "winning" | "growing" | "declining" | "opportunity";
export type KeywordAction = "protect" | "improve" | "create";

export type Keyword = {
  id: string;
  term: string;
  bucket: KeywordBucket;
  volume: number;
  position: number | null;
  previousPosition: number | null;
  difficulty: number;
  relevance: number;
  opportunityScore: number;
  page: string | null;
  action: KeywordAction;
  competitors: string[];
  potentialTraffic: number;
  market: string;
};

export type PromptIntent = "commercial" | "informational";

export type EngineSample = {
  mentionRate: number;
  citationRate: number;
};

export type Prompt = {
  id: string;
  text: string;
  cluster: string;
  intent: PromptIntent;
  market: string;
  mentionRate: number;
  citationRate: number;
  samples: number;
  engines: Record<string, EngineSample>;
  competitorsPresent: string[];
  blockers: string[];
  sources: string[];
};

export type EngineScore = {
  id: string;
  label: string;
  visibility: number;
  delta: number;
  sov: number;
  mentionRate: number;
  citationRate: number;
};

export type CompetitorSource = "selected" | "search" | "ai";

export type Competitor = {
  id: string;
  name: string;
  domain: string;
  source: CompetitorSource;
  keywordGap: number;
  promptGap: number;
  sourceGap: number;
  momentum: string;
  why: string;
};

export type CitationSource = {
  domain: string;
  title: string;
  citedBy: string[];
  mentionsUs: boolean;
  mentionsCompetitors: string[];
  opportunity: number;
};

export type Impact = "very-high" | "high" | "medium" | "low";
export type Effort = "low" | "medium" | "high";
export type RecStatus = "open" | "done" | "snoozed" | "dismissed";

export type ScoreFactors = {
  demand: number;
  relevance: number;
  gap: number;
  reachability: number;
  competitorPressure: number;
  confidence: number;
};

export type Recommendation = {
  id: string;
  /** What is wrong — Watch tier. */
  problem: string;
  /** How to repair it — Fix / enterprise only. */
  howTo: string;
  reason: string;
  why: string[];
  impact: Impact;
  impactLabel: string;
  effort: Effort;
  confidence: number;
  channels: string[];
  market?: string;
  page?: string;
  competitor?: string;
  status: RecStatus;
  factors: ScoreFactors;
};

export type HealthSeverity = "critical" | "important" | "improvement";

export type HealthIssue = {
  id: string;
  severity: HealthSeverity;
  title: string;
  pages: string[];
  keywords: string[];
  prompts: string[];
  fix: string;
};

export type ContentPage = {
  path: string;
  title: string;
  bucket: "top" | "growing" | "decaying" | "underperforming" | "missing";
  traffic: number;
  trafficDelta: number;
  note: string;
};

export type DailyMover = {
  term: string;
  from: number;
  to: number;
  direction: "up" | "down";
};

export type DailySnapshot = {
  checkedAt: string;
  visits: number;
  visitsDelta: number;
  emailPromise: string;
  lastEmail: {
    sent: string;
    subject: string;
  };
  movers: DailyMover[];
};

export type WeeklyBrief = {
  weekOf: string;
  headline: string;
  wins: string[];
  losses: string[];
  rivalMove: string;
  toFix: { id: string; problem: string; impact: string }[];
};

export type Workspace = {
  brand: string;
  domain: string;
  products: string[];
  periodLabel: string;
  weeklyNarrative: string;
  daily: DailySnapshot;
  weeklyBrief: WeeklyBrief;
  discoverability: {
    score: number;
    formula: string;
    pillars: Pillar[];
  };
  channels: Channel[];
  markets: Market[];
  keywords: Keyword[];
  prompts: Prompt[];
  engines: EngineScore[];
  competitors: Competitor[];
  sources: CitationSource[];
  recommendations: Recommendation[];
  issues: HealthIssue[];
  pages: ContentPage[];
};

export type ProviderName = "demo" | "search-console" | "serper" | "llm";

export type DiscoverabilityProvider = {
  name: ProviderName;
  label: string;
  live: boolean;
  loadWorkspace: () => Promise<Workspace>;
};
