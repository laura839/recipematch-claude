"use client";

import Link from "next/link";
import { computeMatch } from "@/lib/match";
import { useHydrated, useSelectedIngredients } from "@/lib/storage";
import type { DetailIngredient, RecipeDetailData } from "@/lib/types";
import { useDocumentTitle, useI18n } from "@/lib/use-i18n";
import { CategoryPill } from "./CategoryPill";
import { FavoriteButton } from "./FavoriteButton";
import { ArrowLeftIcon, CheckIcon, ClockIcon, XIcon } from "./icons";
import { matchTone } from "./MatchBadge";
import { RecipePlaceholder } from "./RecipePlaceholder";

/** Recipe page body. All text is available in both languages, so switching never reloads the page. */
export function RecipeDetailView({ recipe }: { recipe: RecipeDetailData }) {
  const { t, lang, pick } = useI18n();
  const name = pick(recipe.name);
  const steps = recipe.steps[lang].length ? recipe.steps[lang] : recipe.steps.en;
  useDocumentTitle(name);

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900">
        <ArrowLeftIcon className="h-4 w-4" /> {t.detail.back}
      </Link>

      <header className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/80">
        <RecipePlaceholder category={recipe.category} imageUrl={recipe.imageUrl} name={name} size="hero" />
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 [hyphens:auto] sm:text-3xl">{name}</h1>
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <CategoryPill category={recipe.category} />
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-4 w-4" /> {t.card.minutes(recipe.prepTimeMinutes)}
              </span>
            </div>
          </div>
          <FavoriteButton slug={recipe.slug} name={name} variant="inline" />
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-5">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/80 sm:p-6 md:col-span-2" aria-labelledby="ingredients-heading">
          <h2 id="ingredients-heading" className="mb-4 text-lg font-semibold text-stone-900">{t.detail.ingredients}</h2>
          <IngredientGroups ingredients={recipe.ingredients} />
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/80 sm:p-6 md:col-span-3" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="mb-4 text-lg font-semibold text-stone-900">{t.detail.instructions}</h2>
          <ol className="space-y-4">
            {steps.map((step, index) => (
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

function IngredientGroups({ ingredients }: { ingredients: DetailIngredient[] }) {
  const { t } = useI18n();
  const hydrated = useHydrated();
  const [selected] = useSelectedIngredients();
  const selectedSlugs = new Set(hydrated ? selected.map((s) => s.slug) : []);

  // No ingredients selected → plain, complete list without grouping.
  if (selectedSlugs.size === 0) {
    return (
      <ul className="divide-y divide-stone-100">
        {ingredients.map((i) => <Row key={i.slug} ingredient={i} />)}
      </ul>
    );
  }

  const match = computeMatch({ slug: "", name: "", prepTimeMinutes: 0, ingredients }, selectedSlugs);
  const available = match?.available ?? [];
  const missing = match?.missing ?? [];
  const staples = ingredients.filter((i) => i.isStaple);

  return (
    <div className="space-y-5">
      {match && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-stone-100">
          <span className="text-sm text-stone-700">{t.detail.haveOf(match.matchedCount, match.totalCount)}</span>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${matchTone(match.percent)}`}>{match.percent}%</span>
        </div>
      )}
      <Group title={t.detail.available} tone="text-emerald-700" items={available} icon="check" empty={t.detail.noneAvailable} />
      <Group title={t.detail.missing} tone="text-rose-600" items={missing} icon="x" empty={t.detail.nothingMissing} />
      {staples.length > 0 && <Group title={t.detail.staples} tone="text-stone-500" items={staples} />}
    </div>
  );
}

function Group({
  title, tone, items, icon, empty,
}: {
  title: string; tone: string; items: DetailIngredient[]; icon?: "check" | "x"; empty?: string;
}) {
  return (
    <div>
      <h3 className={`mb-1 text-xs font-semibold uppercase tracking-wide ${tone}`}>
        {title} <span className="font-normal text-stone-400">({items.length})</span>
      </h3>
      {items.length === 0 ? (
        <p className="py-2 text-sm text-stone-500">{empty}</p>
      ) : (
        <ul className="divide-y divide-stone-100">
          {items.map((i) => <Row key={i.slug} ingredient={i} icon={icon} />)}
        </ul>
      )}
    </div>
  );
}

function Row({ ingredient, icon }: { ingredient: DetailIngredient; icon?: "check" | "x" }) {
  const { lang, pick } = useI18n();
  const name = lang === "et" ? ingredient.nameEt : ingredient.name;
  return (
    <li className="flex items-center gap-3 py-2 text-sm">
      {icon === "check" && <CheckIcon className="h-4 w-4 shrink-0 text-emerald-600" />}
      {icon === "x" && <XIcon className="h-4 w-4 shrink-0 text-rose-500" />}
      <span className="flex-1 text-stone-800">{name}</span>
      <span className="shrink-0 text-right text-stone-500">{pick(ingredient.quantity)}</span>
    </li>
  );
}
