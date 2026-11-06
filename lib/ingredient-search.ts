import type { IngredientOption, Lang } from "./types";

/** Lowercases and strips diacritics so "oun" finds "Õunad" and "creme" finds "Crème". */
export function normalizeForSearch(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

/**
 * Finds ingredients whose Estonian or English name matches the query.
 * Prefix matches (in the active language first) rank before substring matches;
 * results are alphabetical within each group, by the active language's name.
 */
export function searchIngredients(
  options: readonly IngredientOption[],
  query: string,
  lang: Lang,
  exclude: ReadonlySet<string> = new Set(),
  limit = 8,
): IngredientOption[] {
  const q = normalizeForSearch(query);
  if (!q) return [];
  const other: Lang = lang === "et" ? "en" : "et";
  const scored: { option: IngredientOption; score: number }[] = [];

  for (const option of options) {
    if (exclude.has(option.slug)) continue;
    const primary = normalizeForSearch(option.name[lang]);
    const secondary = normalizeForSearch(option.name[other]);
    let score = -1;
    if (primary.startsWith(q)) score = 0;
    else if (secondary.startsWith(q)) score = 1;
    else if (primary.includes(q)) score = 2;
    else if (secondary.includes(q)) score = 3;
    if (score >= 0) scored.push({ option, score });
  }

  return scored
    .sort((a, b) => a.score - b.score || a.option.name[lang].localeCompare(b.option.name[lang], lang))
    .slice(0, limit)
    .map((s) => s.option);
}
