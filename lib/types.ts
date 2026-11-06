/** Shapes shared between API routes and client components. */

export type CardMatch = {
  percent: number;
  matchedCount: number;
  totalCount: number;
  missing: string[];
};

export type RecipeCardData = {
  slug: string;
  name: string;
  category: string;
  prepTimeMinutes: number;
  imageUrl: string | null;
  /** null in browse mode or when no ingredients are selected */
  match: CardMatch | null;
};

export type SearchMode = "empty" | "browse" | "match";

export type RecipeSearchResponse = {
  mode: SearchMode;
  results: RecipeCardData[];
  total: number;
  nextOffset: number | null;
};

export type IngredientOption = { slug: string; name: string };
