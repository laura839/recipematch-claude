import type { MatchResult } from "./match";
import type { BilingualIngredient, RecipeSummary } from "./recipes";
import type { RecipeCardData } from "./types";

export function toCard(recipe: RecipeSummary, match: MatchResult<BilingualIngredient> | null): RecipeCardData {
  return {
    slug: recipe.slug,
    name: { en: recipe.name, et: recipe.nameEt },
    category: recipe.category,
    prepTimeMinutes: recipe.prepTimeMinutes,
    imageUrl: recipe.imageUrl,
    match: match
      ? {
          percent: match.percent,
          matchedCount: match.matchedCount,
          totalCount: match.totalCount,
          missing: match.missing.map((i) => ({ en: i.name, et: i.nameEt })),
        }
      : null,
  };
}
