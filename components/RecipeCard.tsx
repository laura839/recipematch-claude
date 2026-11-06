"use client";

import Link from "next/link";
import type { RecipeCardData } from "@/lib/types";
import { useI18n } from "@/lib/use-i18n";
import { CategoryPill } from "./CategoryPill";
import { FavoriteButton } from "./FavoriteButton";
import { CheckIcon, ClockIcon } from "./icons";
import { MatchBadge } from "./MatchBadge";
import { RecipePlaceholder } from "./RecipePlaceholder";

export function RecipeCard({ recipe }: { recipe: RecipeCardData }) {
  const { t, pick } = useI18n();
  const { match } = recipe;
  const name = pick(recipe.name);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/80 transition hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-emerald-500">
      <RecipePlaceholder category={recipe.category} imageUrl={recipe.imageUrl} name={name} />

      {match && (
        <div className="absolute left-3 top-3">
          <MatchBadge percent={match.percent} />
        </div>
      )}
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton slug={recipe.slug} name={name} />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-semibold leading-snug text-stone-900 [hyphens:auto]">
          {/* Stretched link: the whole card is clickable, the heart stays a separate button. */}
          <Link href={`/recipes/${recipe.slug}`} className="outline-none after:absolute after:inset-0">
            {name}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <CategoryPill category={recipe.category} />
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            {t.card.minutes(recipe.prepTimeMinutes)}
          </span>
        </div>

        {match && (
          <div className="mt-auto pt-1 text-sm">
            {match.missing.length === 0 ? (
              <p className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <CheckIcon className="h-4 w-4" /> {t.card.haveEverything}
              </p>
            ) : (
              <p className="line-clamp-2 text-stone-600">
                <span className="font-medium text-rose-600">{t.card.missing(match.missing.length)}</span>{" "}
                {match.missing.map((m) => pick(m).toLowerCase()).join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80" aria-hidden="true">
      <div className="h-36 animate-pulse bg-stone-100" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-stone-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-stone-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-stone-100" />
      </div>
    </div>
  );
}

export function RecipeGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
