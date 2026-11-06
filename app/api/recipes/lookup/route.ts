import type { NextRequest } from "next/server";
import { toCard } from "@/lib/cards";
import { computeMatch } from "@/lib/match";
import { parseSlugList } from "@/lib/params";
import { getRecipeSummaries } from "@/lib/recipes";

export const dynamic = "force-dynamic";

/**
 * GET /api/recipes/lookup?slugs=a,b&ingredients=x,y
 * Returns cards for the given recipe slugs (used by Favorites), in the order
 * requested. Unknown slugs are silently skipped.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const slugs = parseSlugList(params.get("slugs"), 200);
  const selected = new Set(parseSlugList(params.get("ingredients")));

  if (slugs.length === 0) return Response.json({ results: [] });

  try {
    const recipes = await getRecipeSummaries({ slugs });
    const bySlug = new Map(recipes.map((r) => [r.slug, r]));
    const results = slugs.flatMap((slug) => {
      const recipe = bySlug.get(slug);
      if (!recipe) return [];
      return [toCard(recipe, selected.size > 0 ? computeMatch(recipe, selected) : null)];
    });
    return Response.json({ results }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET /api/recipes/lookup failed", error);
    return Response.json({ error: "Could not load favorites." }, { status: 500 });
  }
}
