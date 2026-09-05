export function todaySentence({
  ups,
  named,
  prompts,
  rival,
}: {
  ups: number;
  named: number;
  prompts: number;
  rival?: string;
}): string {
  const up =
    ups === 0
      ? "Nothing went up since yesterday."
      : ups === 1
        ? "One search went up."
        : `${ups} searches went up.`;
  const ai = `You are named on ${named} of ${prompts} AI questions.`;
  const watch = rival ? `${rival} is the rival we watch.` : "";
  return [up, ai, watch].filter(Boolean).join(" ");
}
