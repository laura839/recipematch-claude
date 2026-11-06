import type { CategorySlug } from "../lib/categories";

export type SeedIngredient = {
  slug: string;
  name: string;
  isStaple?: boolean;
};

/** [ingredient slug, quantity] */
export type SeedRecipeIngredient = readonly [string, string];

export type SeedRecipe = {
  slug: string;
  name: string;
  category: CategorySlug;
  prepTimeMinutes: number;
  ingredients: readonly SeedRecipeIngredient[];
  steps: readonly string[];
  imageUrl?: string;
};

type RecipeInput = Omit<SeedRecipe, "category" | "prepTimeMinutes"> & { prep: number };

/** Small helper so each category file stays compact. */
export function defineRecipes(category: CategorySlug, recipes: RecipeInput[]): SeedRecipe[] {
  return recipes.map(({ prep, ...rest }) => ({ ...rest, category, prepTimeMinutes: prep }));
}
