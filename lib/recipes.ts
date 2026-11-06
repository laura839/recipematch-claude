import "server-only";
import { prisma } from "./prisma";
import type { MatchIngredient, MatchableRecipe } from "./match";
import type { IngredientOption, RecipeDetailData } from "./types";

/** Ingredient carrying both languages; matching only uses `slug` and `isStaple`. */
export type BilingualIngredient = MatchIngredient & { nameEt: string };

export type RecipeSummary = MatchableRecipe<BilingualIngredient> & {
  nameEt: string;
  category: string;
  imageUrl: string | null;
};

const recipeInclude = {
  ingredients: {
    orderBy: { position: "asc" as const },
    include: { ingredient: true },
  },
};

type RecipeRow = Awaited<ReturnType<typeof loadRows>>[number];

function loadRows(where?: { category?: string; slug?: { in: string[] } }) {
  return prisma.recipe.findMany({ where, include: recipeInclude });
}

/** Falls back to English if an Estonian value is somehow empty. */
const et = (value: string, fallback: string) => (value.trim() ? value : fallback);

function toSummary(row: RecipeRow): RecipeSummary {
  return {
    slug: row.slug,
    name: row.name,
    nameEt: et(row.nameEt, row.name),
    category: row.category,
    prepTimeMinutes: row.prepTimeMinutes,
    imageUrl: row.imageUrl,
    ingredients: row.ingredients.map((ri) => ({
      slug: ri.ingredient.slug,
      name: ri.ingredient.name,
      nameEt: et(ri.ingredient.nameEt, ri.ingredient.name),
      isStaple: ri.ingredient.isStaple,
    })),
  };
}

export async function getRecipeSummaries(filter?: { category?: string; slugs?: string[] }) {
  const rows = await loadRows({
    ...(filter?.category ? { category: filter.category } : {}),
    ...(filter?.slugs ? { slug: { in: filter.slugs } } : {}),
  });
  return rows.map(toSummary);
}

export async function getRecipeDetail(slug: string): Promise<RecipeDetailData | null> {
  const row = await prisma.recipe.findUnique({ where: { slug }, include: recipeInclude });
  if (!row) return null;
  const hasEtSteps = row.stepsEt.length === row.steps.length;
  return {
    slug: row.slug,
    name: { en: row.name, et: et(row.nameEt, row.name) },
    category: row.category,
    prepTimeMinutes: row.prepTimeMinutes,
    imageUrl: row.imageUrl,
    steps: { en: row.steps, et: hasEtSteps ? row.stepsEt : row.steps },
    ingredients: row.ingredients.map((ri) => ({
      slug: ri.ingredient.slug,
      name: ri.ingredient.name,
      nameEt: et(ri.ingredient.nameEt, ri.ingredient.name),
      isStaple: ri.ingredient.isStaple,
      quantity: { en: ri.quantity, et: et(ri.quantityEt, ri.quantity) },
    })),
  };
}

export async function getSelectableIngredients(): Promise<IngredientOption[]> {
  const rows = await prisma.ingredient.findMany({
    where: { isStaple: false },
    select: { slug: true, name: true, nameEt: true },
    orderBy: { name: "asc" },
  });
  return rows.map((r) => ({ slug: r.slug, name: { en: r.name, et: et(r.nameEt, r.name) } }));
}
