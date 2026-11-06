import type { MatchResult } from "./match";
import type { RecipeSummary } from "./recipes";
import type { RecipeCardData } from "./types";

export function toCard(recipe: RecipeSummary, match: MatchResult | null): RecipeCardData {
  return {
    slug: recipe.slug,
    name: recipe.name,
    category: recipe.category,
    prepTimeMinutes: recipe.prepTimeMinutes,
    imageUrl: recipe.imageUrl,
    match: match
      ? {
          percent: match.percent,
          matchedCount: match.matchedCount,
          totalCount: match.totalCount,
          missing: match.missing.map((i) => i.name),
        }
      : null,
  };
}
