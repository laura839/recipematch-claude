import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CategoryPill } from "@/components/CategoryPill";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ArrowLeftIcon, ClockIcon } from "@/components/icons";
import { IngredientGroups } from "@/components/IngredientGroups";
import { RecipePlaceholder } from "@/components/RecipePlaceholder";
import { getRecipeDetail } from "@/lib/recipes";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const loadRecipe = cache(async (slug: string) => {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  return getRecipeDetail(slug);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = await loadRecipe((await params).slug);
  return { title: recipe ? recipe.name : "Recipe not found" };
}

export default async function RecipePage({ params }: Props) {
  const recipe = await loadRecipe((await params).slug);
  if (!recipe) notFound();

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900">
        <ArrowLeftIcon className="h-4 w-4" /> Back to recipes
      </Link>

      <header className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/80">
        <RecipePlaceholder category={recipe.category} imageUrl={recipe.imageUrl} name={recipe.name} size="hero" />
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{recipe.name}</h1>
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <CategoryPill category={recipe.category} />
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-4 w-4" /> {recipe.prepTimeMinutes} min
              </span>
            </div>
          </div>
          <FavoriteButton slug={recipe.slug} name={recipe.name} variant="inline" />
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-5">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/80 sm:p-6 md:col-span-2" aria-labelledby="ingredients-heading">
          <h2 id="ingredients-heading" className="mb-4 text-lg font-semibold text-stone-900">Ingredients</h2>
          <IngredientGroups ingredients={recipe.ingredients} quantities={recipe.quantities} />
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/80 sm:p-6 md:col-span-3" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="mb-4 text-lg font-semibold text-stone-900">Instructions</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="pt-0.5 leading-relaxed text-stone-700">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
