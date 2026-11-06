import { getSelectableIngredients } from "@/lib/recipes";

export const dynamic = "force-dynamic";

/** All non-staple ingredients for the autocomplete (≈140 rows, filtered client-side). */
export async function GET() {
  try {
    const ingredients = await getSelectableIngredients();
    return Response.json(
      { ingredients },
      { headers: { "Cache-Control": "public, max-age=300" } },
    );
  } catch (error) {
    console.error("GET /api/ingredients failed", error);
    return Response.json({ error: "Could not load ingredients." }, { status: 500 });
  }
}
