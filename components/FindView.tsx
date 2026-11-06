"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isCategorySlug } from "@/lib/categories";
import { useHydrated, useSelectedIngredients } from "@/lib/storage";
import type { IngredientOption, RecipeCardData, RecipeSearchResponse, SearchMode } from "@/lib/types";
import { useDocumentTitle, useI18n } from "@/lib/use-i18n";
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

/**
 * The search results contain both languages, so switching language only
 * re-renders — it never refetches or resets ingredients, category or paging.
 */
export function FindView() {
  const hydrated = useHydrated();
  const { t } = useI18n();
  const [selected, setSelected] = useSelectedIngredients();
  const [category, setCategory] = useState("all"); // intentionally not persisted
  const [options, setOptions] = useState<IngredientOption[]>([]);
  const [optionsStatus, setOptionsStatus] = useState<"loading" | "ready" | "error">("loading");
  const [results, setResults] = useState<Results>(INITIAL);
  const [reloadToken, setReloadToken] = useState(0);
  const requestKey = useRef("");

  useDocumentTitle(t.meta.title);

  const slugs = selected.map((s) => s.slug);
  const slugKey = slugs.join(",");

  const loadOptions = useCallback(async () => {
    setOptionsStatus("loading");
    try {
      const res = await fetch("/api/ingredients?v=2");
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

  // Sync stored selections with the database: drop ingredients that no longer
  // exist and upgrade entries saved before Estonian names existed.
  useEffect(() => {
    if (optionsStatus !== "ready" || options.length === 0) return;
    const bySlug = new Map(options.map((o) => [o.slug, o]));
    const next = selected.flatMap((s) => {
      const option = bySlug.get(s.slug);
      return option ? [option] : [];
    });
    const changed =
      next.length !== selected.length ||
      next.some((o, i) => o.name.en !== selected[i].name.en || o.name.et !== selected[i].name.et);
    if (changed) setSelected(next);
  }, [optionsStatus, options, selected, setSelected]);

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

  const categoryName = isCategorySlug(category) ? t.categories[category] : null;
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
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{t.find.title}</h1>
          <p className="mt-1 text-stone-600">{t.find.subtitle}</p>
        </div>
        <IngredientPicker
          options={options}
          optionsStatus={optionsStatus}
          selected={hydrated ? selected : []}
          onChange={setSelected}
          onRetry={loadOptions}
        />
        <p className="text-xs text-stone-500">{t.find.staplesHint}</p>
      </section>

      <CategoryFilter value={category} onChange={setCategory} />

      <section aria-live="polite" aria-busy={results.status === "loading"} className="space-y-4">
        {view === "skeleton" ? (
          <RecipeGrid>
            {Array.from({ length: 6 }, (_, i) => <RecipeCardSkeleton key={i} />)}
          </RecipeGrid>
        ) : view === "error" ? (
          <Notice title={t.results.errorTitle} emoji="😕">
            {t.results.errorBody}{" "}
            <button type="button" onClick={() => setReloadToken((n) => n + 1)} className="font-medium text-emerald-700 underline underline-offset-2">
              {t.find.tryAgain}
            </button>
          </Notice>
        ) : view === "empty" ? (
          <EmptyState />
        ) : (
          <>
            {results.mode === "browse" && categoryName ? (
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-100">
                {t.results.browsing(categoryName)}
              </div>
            ) : results.mode === "match" && results.total > 0 ? (
              <p className="text-sm text-stone-600">
                {t.results.count(results.total, slugs.length)}
                {categoryName ? <> · <strong className="text-stone-900">{categoryName}</strong></> : null}
              </p>
            ) : null}

            {results.items.length === 0 ? (
              <Notice title={t.results.noMatchesTitle} emoji="🔍">
                {categoryName ? t.results.noMatchesCategory(categoryName) : t.results.noMatchesAll}
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
                  {results.loadingMore ? t.results.loading : t.results.showMore(results.total - results.items.length)}
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
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-stone-200/80">
      <div className="mb-4 flex -space-x-3 text-4xl" aria-hidden="true">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-amber-100 ring-4 ring-white">🥚</span>
        <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 ring-4 ring-white">🥕</span>
        <span className="grid h-16 w-16 place-items-center rounded-full bg-rose-100 ring-4 ring-white">🍅</span>
      </div>
      <h2 className="text-lg font-semibold text-stone-900">{t.empty.title}</h2>
      <p className="mt-1 max-w-sm text-sm text-stone-600">{t.empty.body}</p>
      <p className="mt-3 text-sm text-stone-500">{t.empty.browseHint}</p>
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
