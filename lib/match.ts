/**
 * RecipeMatch matching logic — a pure, database-free module.
 *
 * Rules:
 * - Staple ingredients (salt, pepper, water) are ignored: they never count
 *   towards the match percentage and never appear as "missing".
 * - Match % = available non-staple ingredients / all non-staple ingredients.
 * - Only recipes with at least one matching non-staple ingredient are returned.
 * - Recipes that consist only of staples are never returned.
 * - Sort: highest match % → fewest missing → shortest prep time → name.
 */

export type MatchIngredient = {
  slug: string;
  name: string;
  isStaple: boolean;
};

export type MatchableRecipe = {
  slug: string;
  name: string;
  prepTimeMinutes: number;
  ingredients: MatchIngredient[];
};

export type MatchResult = {
  /** Rounded percentage, 0–100 */
  percent: number;
  matchedCount: number;
  totalCount: number;
  available: MatchIngredient[];
  missing: MatchIngredient[];
  staples: MatchIngredient[];
};

export type RankedRecipe<R extends MatchableRecipe> = {
  recipe: R;
  match: MatchResult;
};

/**
 * Computes the match for one recipe. Returns null if the recipe has no
 * non-staple ingredients (staple-only recipes are never matchable).
 */
export function computeMatch(
  recipe: MatchableRecipe,
  selected: ReadonlySet<string>,
): MatchResult | null {
  const available: MatchIngredient[] = [];
  const missing: MatchIngredient[] = [];
  const staples: MatchIngredient[] = [];

  for (const ingredient of recipe.ingredients) {
    if (ingredient.isStaple) staples.push(ingredient);
    else if (selected.has(ingredient.slug)) available.push(ingredient);
    else missing.push(ingredient);
  }

  const totalCount = available.length + missing.length;
  if (totalCount === 0) return null;

  return {
    percent: Math.round((available.length / totalCount) * 100),
    matchedCount: available.length,
    totalCount,
    available,
    missing,
    staples,
  };
}

/** Sort comparator implementing the agreed ranking order. */
export function compareRanked<R extends MatchableRecipe>(
  a: RankedRecipe<R>,
  b: RankedRecipe<R>,
): number {
  // Exact ratio comparison (cross-multiplied) so rounding never changes order.
  const ratioDiff =
    b.match.matchedCount * a.match.totalCount -
    a.match.matchedCount * b.match.totalCount;
  if (ratioDiff !== 0) return ratioDiff;

  const missingDiff = a.match.missing.length - b.match.missing.length;
  if (missingDiff !== 0) return missingDiff;

  const prepDiff = a.recipe.prepTimeMinutes - b.recipe.prepTimeMinutes;
  if (prepDiff !== 0) return prepDiff;

  return a.recipe.name.localeCompare(b.recipe.name);
}

/** Filters and ranks recipes for the selected ingredient slugs. */
export function rankRecipes<R extends MatchableRecipe>(
  recipes: readonly R[],
  selectedSlugs: Iterable<string>,
): RankedRecipe<R>[] {
  const selected = new Set(selectedSlugs);
  const ranked: RankedRecipe<R>[] = [];

  for (const recipe of recipes) {
    const match = computeMatch(recipe, selected);
    if (match && match.matchedCount >= 1) ranked.push({ recipe, match });
  }

  return ranked.sort(compareRanked);
}
