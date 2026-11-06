import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { RecipeDetailView } from "@/components/RecipeDetailView";
import { getRecipeDetail } from "@/lib/recipes";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const loadRecipe = cache(async (slug: string) => {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  return getRecipeDetail(slug);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = await loadRecipe((await params).slug);
  // Server title uses the default language (Estonian); the client updates it on language change.
  return { title: recipe ? recipe.name.et : "Retsepti ei leitud" };
}

export default async function RecipePage({ params }: Props) {
  const recipe = await loadRecipe((await params).slug);
  if (!recipe) notFound();
  return <RecipeDetailView recipe={recipe} />;
}
