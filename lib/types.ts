/** Shapes shared between API routes and client components. */

export type Lang = "et" | "en";

/** A text available in both supported languages. */
export type Localized = { en: string; et: string };

export type CardMatch = {
  percent: number;
  matchedCount: number;
  totalCount: number;
  missing: Localized[];
};

export type RecipeCardData = {
  slug: string;
  name: Localized;
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

export type IngredientOption = { slug: string; name: Localized };

/** Ingredient as used on the recipe detail page. */
export type DetailIngredient = {
  slug: string;
  name: string;
  nameEt: string;
  isStaple: boolean;
  quantity: Localized;
};

export type RecipeDetailData = {
  slug: string;
  name: Localized;
  category: string;
  prepTimeMinutes: number;
  imageUrl: string | null;
  ingredients: DetailIngredient[];
  steps: { en: string[]; et: string[] };
  /** Credit for the recipe photo, when it comes from Unsplash. */
  photoCredit: { photographer: string; pageUrl: string } | null;
};
