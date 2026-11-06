"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFavorites, useHydrated, useSelectedIngredients } from "@/lib/storage";
import type { RecipeCardData } from "@/lib/types";
import { RecipeCard, RecipeCardSkeleton, RecipeGrid } from "./RecipeCard";

export function FavoritesView() {
  const hydrated = useHydrated();
  const { favorites, setFavorites } = useFavorites();
  const [selected] = useSelectedIngredients();
  const [cards, setCards] = useState<RecipeCardData[] | null>(null);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const favoriteKey = favorites.join(",");
  const ingredientKey = selected.map((s) => s.slug).join(",");

  useEffect(() => {
    if (!hydrated) return;
    if (favoriteKey === "") {
      setCards([]);
      return;
    }
    const controller = new AbortController();
    const params = new URLSearchParams({ slugs: favoriteKey });
    if (ingredientKey) params.set("ingredients", ingredientKey);
    setError(false);
    fetch(`/api/recipes/lookup?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<{ results: RecipeCardData[] }>;
      })
      .then((data) => {
        setCards(data.results);
        // Quietly forget favorites whose recipe no longer exists.
        const found = new Set(data.results.map((r) => r.slug));
        const current = favoriteKey.split(",");
        if (current.some((slug) => !found.has(slug))) setFavorites(current.filter((slug) => found.has(slug)));
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [hydrated, favoriteKey, ingredientKey, reloadToken, setFavorites]);

  // Hide cards immediately when un-favorited, without waiting for a refetch.
  const visible = cards?.filter((c) => favorites.includes(c.slug)) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">Favorites</h1>
        <p className="mt-1 text-stone-600">
          Recipes you’ve saved on this device.
          {hydrated && selected.length > 0 && " Match percentages use your current ingredients."}
        </p>
      </div>

      {error ? (
        <div className="rounded-3xl bg-white px-6 py-10 text-center shadow-sm ring-1 ring-stone-200/80">
          <p className="text-stone-700">We couldn’t load your favorites right now.</p>
          <button type="button" onClick={() => setReloadToken((n) => n + 1)} className="mt-2 text-sm font-medium text-emerald-700 underline underline-offset-2">
            Try again
          </button>
        </div>
      ) : !hydrated || visible === null ? (
        <RecipeGrid>{Array.from({ length: 3 }, (_, i) => <RecipeCardSkeleton key={i} />)}</RecipeGrid>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-stone-200/80">
          <span className="mb-3 grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-3xl" aria-hidden="true">💛</span>
          <h2 className="text-lg font-semibold text-stone-900">No favorites yet</h2>
          <p className="mt-1 max-w-sm text-sm text-stone-600">Tap the heart on any recipe to save it here for later.</p>
          <Link href="/" className="mt-5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            Find recipes
          </Link>
        </div>
      ) : (
        <RecipeGrid>
          {visible.map((recipe) => <RecipeCard key={recipe.slug} recipe={recipe} />)}
        </RecipeGrid>
      )}
    </div>
  );
}
