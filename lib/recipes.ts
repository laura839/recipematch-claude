import "server-only";
import { prisma } from "./prisma";
import type { MatchIngredient, MatchableRecipe } from "./match";

export type RecipeSummary = MatchableRecipe & {
  category: string;
  imageUrl: string | null;
};

export type RecipeDetail = RecipeSummary & {
  steps: string[];
  quantities: Record<string, string>;
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

function toSummary(row: RecipeRow): RecipeSummary {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    prepTimeMinutes: row.prepTimeMinutes,
    imageUrl: row.imageUrl,
    ingredients: row.ingredients.map(
      (ri): MatchIngredient => ({
        slug: ri.ingredient.slug,
        name: ri.ingredient.name,
        isStaple: ri.ingredient.isStaple,
      }),
    ),
  };
}

export async function getRecipeSummaries(filter?: { category?: string; slugs?: string[] }) {
  const rows = await loadRows({
    ...(filter?.category ? { category: filter.category } : {}),
    ...(filter?.slugs ? { slug: { in: filter.slugs } } : {}),
  });
  return rows.map(toSummary);
}

export async function getRecipeDetail(slug: string): Promise<RecipeDetail | null> {
  const row = await prisma.recipe.findUnique({ where: { slug }, include: recipeInclude });
  if (!row) return null;
  return {
    ...toSummary(row),
    steps: row.steps,
    quantities: Object.fromEntries(row.ingredients.map((ri) => [ri.ingredient.slug, ri.quantity])),
  };
}

export async function getSelectableIngredients() {
  return prisma.ingredient.findMany({
    where: { isStaple: false },
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });
}
