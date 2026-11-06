"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_LANGUAGE, isLang } from "./i18n";
import type { IngredientOption, Lang } from "./types";

/**
 * Tiny localStorage-backed store shared by all components.
 * Only ingredient selections, favorite recipe slugs and the UI language are
 * stored — no personal data. Each lives under its own key, so changing one
 * never touches the others.
 */

export const STORAGE_KEYS = {
  ingredients: "recipematch:ingredients:v1",
  favorites: "recipematch:favorites:v1",
  language: "recipematch:language:v1",
} as const;
const KEYS = STORAGE_KEYS;

type Key = (typeof KEYS)[keyof typeof KEYS];

const listeners = new Set<() => void>();
const cache = new Map<Key, { raw: string | null; value: unknown }>();
/** Used only if localStorage is unavailable (e.g. blocked), so the app still works for this visit. */
const memoryFallback = new Map<Key, string>();

const EMPTY_INGREDIENTS: IngredientOption[] = [];
const EMPTY_FAVORITES: string[] = [];

function readRaw(key: Key): string | null {
  if (memoryFallback.has(key)) return memoryFallback.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Parses stored ingredient selections. Supports the original format
 * ({ slug, name: string }) as well as the bilingual one ({ slug, name: { en, et } }).
 */
export function parseIngredients(raw: string | null): IngredientOption[] {
  if (!raw) return EMPTY_INGREDIENTS;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY_INGREDIENTS;
    const result: IngredientOption[] = [];
    for (const item of data) {
      if (typeof item !== "object" || item === null) continue;
      const { slug, name } = item as { slug?: unknown; name?: unknown };
      if (typeof slug !== "string") continue;
      if (typeof name === "string") {
        result.push({ slug, name: { en: name, et: name } });
      } else if (
        typeof name === "object" && name !== null &&
        typeof (name as { en?: unknown }).en === "string" &&
        typeof (name as { et?: unknown }).et === "string"
      ) {
        const n = name as { en: string; et: string };
        result.push({ slug, name: { en: n.en, et: n.et } });
      }
    }
    return result;
  } catch {
    return EMPTY_INGREDIENTS;
  }
}

/** Parses the stored language; anything missing or invalid means the default (Estonian). */
export function parseLanguage(raw: string | null): Lang {
  if (!raw) return DEFAULT_LANGUAGE;
  try {
    const value: unknown = JSON.parse(raw);
    return isLang(value) ? value : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function parseFavorites(raw: string | null): string[] {
  if (!raw) return EMPTY_FAVORITES;
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter((s): s is string => typeof s === "string") : EMPTY_FAVORITES;
  } catch {
    return EMPTY_FAVORITES;
  }
}

export function getSnapshot<T>(key: Key, parse: (raw: string | null) => T): T {
  const raw = readRaw(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  const value = parse(raw);
  cache.set(key, { raw, value });
  return value;
}

export function write(key: Key, value: unknown) {
  const raw = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    memoryFallback.set(key, raw);
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || (Object.values(KEYS) as string[]).includes(event.key)) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

/** true after hydration on the client; false during server render. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function useSelectedIngredients() {
  const selected = useSyncExternalStore(
    subscribe,
    () => getSnapshot(KEYS.ingredients, parseIngredients),
    () => EMPTY_INGREDIENTS,
  );
  const setSelected = useCallback((next: IngredientOption[]) => write(KEYS.ingredients, next), []);
  return [selected, setSelected] as const;
}

export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribe,
    () => getSnapshot(KEYS.favorites, parseFavorites),
    () => EMPTY_FAVORITES,
  );
  const toggleFavorite = useCallback((slug: string) => {
    const current = getSnapshot(KEYS.favorites, parseFavorites);
    write(KEYS.favorites, current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current]);
  }, []);
  const setFavorites = useCallback((next: string[]) => write(KEYS.favorites, next), []);
  return { favorites, toggleFavorite, setFavorites };
}

/** Reads the current language outside React (e.g. in tests). */
export function readLanguage(): Lang {
  return getSnapshot(KEYS.language, parseLanguage);
}

/** Stores the language. Only the language key is written. */
export function writeLanguage(lang: Lang) {
  write(KEYS.language, lang);
}

export function useLanguage() {
  const lang = useSyncExternalStore(subscribe, readLanguage, () => DEFAULT_LANGUAGE);
  const setLanguage = useCallback((next: Lang) => writeLanguage(next), []);
  return [lang, setLanguage] as const;
}
