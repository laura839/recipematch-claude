"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCategory } from "@/lib/categories";
import { useHydrated, useSelectedIngredients } from "@/lib/storage";
import type { IngredientOption, RecipeCardData, RecipeSearchResponse, SearchMode } from "@/lib/types";
import { CategoryFilter } from "./CategoryFilter";
import { IngredientPicker } from "./IngredientPicker";
import { RecipeCard, RecipeCardSkeleton, RecipeGrid } from "./RecipeCard";

type Results = {
  status: "idle" | "loading" | "ready" | "error";
  mode: SearchMode;
  items: RecipeCardData[];
  total: number;
  nextOffset: number | null;
  loadingMore: boolean;
};

const INITIAL: Results = { status: "idle", mode: "empty", items: [], total: 0, nextOffset: null, loadingMore: false };

async function fetchRecipes(ingredients: string[], category: string, offset: number, signal?: AbortSignal) {
  const params = new URLSearchParams({ category, offset: String(offset) });
  if (ingredients.length) params.set("ingredients", ingredients.join(","));
  const res = await fetch(`/api/recipes?${params}`, { signal });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as RecipeSearchResponse;
}

export function FindView() {
  const hydrated = useHydrated();
  const [selected, setSelected] = useSelectedIngredients();
  const [category, setCategory] = useState("all"); // intentionally not persisted
  const [options, setOptions] = useState<IngredientOption[]>([]);
  const [optionsStatus, setOptionsStatus] = useState<"loading" | "ready" | "error">("loading");
  const [results, setResults] = useState<Results>(INITIAL);
  const [reloadToken, setReloadToken] = useState(0);
  const requestKey = useRef("");

  const slugs = selected.map((s) => s.slug);
  const slugKey = slugs.join(",");

  // Load the ingredient list once for the autocomplete.
  const loadOptions = useCallback(async () => {
    setOptionsStatus("loading");
    try {
      const res = await fetch("/api/ingredients");
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { ingredients: IngredientOption[] };
      setOptions(data.ingredients);
      setOptionsStatus("ready");
    } catch {
      setOptionsStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  // Quietly drop stored ingredients that no longer exist in the database.
  useEffect(() => {
    if (optionsStatus !== "ready" || options.length === 0) return;
    const known = new Set(options.map((o) => o.slug));
    if (selected.some((s) => !known.has(s.slug))) setSelected(selected.filter((s) => known.has(s.slug)));
  }, [optionsStatus, options, selected, setSelected]);

  // Re-run the search whenever ingredients or category change.
  useEffect(() => {
    if (!hydrated) return;
    const key = `${slugKey}|${category}|${reloadToken}`;
    requestKey.current = key;

    if (slugKey === "" && category === "all") {
      setResults({ ...INITIAL, status: "ready" });
      return;
    }

    const controller = new AbortController();
    setResults((prev) => ({ ...prev, status: "loading", loadingMore: false }));
    fetchRecipes(slugKey ? slugKey.split(",") : [], category, 0, controller.signal)
      .then((data) => {
        if (requestKey.current !== key) return;
        setResults({ status: "ready", mode: data.mode, items: data.results, total: data.total, nextOffset: data.nextOffset, loadingMore: false });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || requestKey.current !== key) return;
        console.error(error);
        setResults((prev) => ({ ...prev, status: "error" }));
      });
    return () => controller.abort();
  }, [hydrated, slugKey, category, reloadToken]);

  async function showMore() {
    if (results.nextOffset === null) return;
    const key = requestKey.current;
    setResults((prev) => ({ ...prev, loadingMore: true }));
    try {
      const data = await fetchRecipes(slugs, category, results.nextOffset);
      if (requestKey.current !== key) return;
      setResults((prev) => ({ ...prev, items: [...prev.items, ...data.results], nextOffset: data.nextOffset, loadingMore: false }));
    } catch {
      if (requestKey.current === key) setResults((prev) => ({ ...prev, loadingMore: false }));
    }
  }

  const categoryName = category === "all" ? null : getCategory(category).name;
  const isEmptyQuery = slugKey === "" && category === "all";
  const view: "skeleton" | "empty" | "error" | "results" = !hydrated
    ? "skeleton"
    : isEmptyQuery
      ? "empty"
      : results.status === "error"
        ? "error"
        : results.status !== "ready" && results.items.length === 0
          ? "skeleton"
          : "results";

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">What’s in your kitchen?</h1>
          <p className="mt-1 text-stone-600">Add the ingredients you have and we’ll find recipes you can cook right now.</p>
        </div>
        <IngredientPicker
          options={options}
          optionsStatus={optionsStatus}
          selected={hydrated ? selected : []}
          onChange={setSelected}
          onRetry={loadOptions}
        />
        <p className="text-xs text-stone-500">Salt, pepper and water are assumed — no need to add them.</p>
      </section>

      <CategoryFilter value={category} onChange={setCategory} />

      <section aria-live="polite" aria-busy={results.status === "loading"} className="space-y-4">
        {view === "skeleton" ? (
          <RecipeGrid>
            {Array.from({ length: 6 }, (_, i) => <RecipeCardSkeleton key={i} />)}
          </RecipeGrid>
        ) : view === "error" ? (
          <Notice title="Something went wrong" emoji="😕">
            We couldn’t load recipes right now.{" "}
            <button type="button" onClick={() => setReloadToken((n) => n + 1)} className="font-medium text-emerald-700 underline underline-offset-2">
              Try again
            </button>
          </Notice>
        ) : view === "empty" ? (
          <EmptyState />
        ) : (
          <>
            {results.mode === "browse" ? (
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-100">
                Browsing all {categoryName} recipes. <strong>Add ingredients</strong> to see what you can cook.
              </div>
            ) : results.total > 0 ? (
              <p className="text-sm text-stone-600">
                <strong className="text-stone-900">{results.total}</strong> {results.total === 1 ? "recipe matches" : "recipes match"} your{" "}
                {slugs.length} {slugs.length === 1 ? "ingredient" : "ingredients"}
                {categoryName ? <> in <strong className="text-stone-900">{categoryName}</strong></> : null}
              </p>
            ) : null}

            {results.items.length === 0 ? (
              <Notice title="No matches yet" emoji="🔍">
                {categoryName
                  ? <>No {categoryName} recipes match your ingredients. Try All Categories or add more ingredients.</>
                  : <>No recipes match your ingredients yet. Try adding a few more.</>}
              </Notice>
            ) : (
              <div className={results.status === "loading" ? "opacity-60 transition-opacity" : "transition-opacity"}>
                <RecipeGrid>
                  {results.items.map((recipe) => <RecipeCard key={recipe.slug} recipe={recipe} />)}
                </RecipeGrid>
              </div>
            )}

            {results.nextOffset !== null && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={showMore}
                  disabled={results.loadingMore}
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-stone-200 transition hover:bg-stone-50 disabled:opacity-60"
                >
                  {results.loadingMore ? "Loading…" : `Show more (${results.total - results.items.length} left)`}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-stone-200/80">
      <div className="mb-4 flex -space-x-3 text-4xl" aria-hidden="true">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-amber-100 ring-4 ring-white">🥚</span>
        <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 ring-4 ring-white">🥕</span>
        <span className="grid h-16 w-16 place-items-center rounded-full bg-rose-100 ring-4 ring-white">🍅</span>
      </div>
      <h2 className="text-lg font-semibold text-stone-900">Add what’s in your fridge to get started</h2>
      <p className="mt-1 max-w-sm text-sm text-stone-600">
        Pick a few ingredients above and we’ll rank recipes by how much you already have — and show what’s missing.
      </p>
      <p className="mt-3 text-sm text-stone-500">Or choose a category to browse recipes.</p>
    </div>
  );
}

function Notice({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-10 text-center shadow-sm ring-1 ring-stone-200/80">
      <span className="mb-3 text-4xl" aria-hidden="true">{emoji}</span>
      <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-stone-600">{children}</p>
    </div>
  );
}
