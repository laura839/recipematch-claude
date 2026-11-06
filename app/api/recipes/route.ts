import type { NextRequest } from "next/server";
import { isCategorySlug } from "@/lib/categories";
import { toCard } from "@/lib/cards";
import { rankRecipes } from "@/lib/match";
import { parseBoundedInt, parseSlugList } from "@/lib/params";
import { getRecipeSummaries } from "@/lib/recipes";
import type { RecipeSearchResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

/**
 * GET /api/recipes?ingredients=a,b&category=pasta&offset=0
 * - ingredients selected        → "match" mode (ranked, ≥1 match), optionally per category
 * - no ingredients + category   → "browse" mode (alphabetical, no match info)
 * - no ingredients, no category → "empty" mode
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const ingredients = parseSlugList(params.get("ingredients"));
  const categoryParam = params.get("category") ?? "all";
  const category = isCategorySlug(categoryParam) ? categoryParam : undefined;
  const offset = parseBoundedInt(params.get("offset"), 0, 10_000);

  try {
    if (ingredients.length === 0 && !category) {
      return json({ mode: "empty", results: [], total: 0, nextOffset: null });
    }

    const recipes = await getRecipeSummaries({ category });

    if (ingredients.length === 0) {
      const sorted = recipes.sort((a, b) => a.name.localeCompare(b.name));
      return json(page("browse", sorted.map((r) => toCard(r, null)), offset));
    }

    const ranked = rankRecipes(recipes, ingredients);
    return json(page("match", ranked.map(({ recipe, match }) => toCard(recipe, match)), offset));
  } catch (error) {
    console.error("GET /api/recipes failed", error);
    return Response.json({ error: "Could not load recipes." }, { status: 500 });
  }
}

function page<T>(mode: RecipeSearchResponse["mode"], all: T[], offset: number) {
  const results = all.slice(offset, offset + PAGE_SIZE);
  const next = offset + PAGE_SIZE;
  return { mode, results, total: all.length, nextOffset: next < all.length ? next : null };
}

function json(body: RecipeSearchResponse) {
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}
