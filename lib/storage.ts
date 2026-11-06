"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { IngredientOption } from "./types";

/**
 * Tiny localStorage-backed store shared by all components.
 * Only ingredient selections and favorite recipe slugs are stored — no personal data.
 */

const KEYS = {
  ingredients: "recipematch:ingredients:v1",
  favorites: "recipematch:favorites:v1",
} as const;

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

function parseIngredients(raw: string | null): IngredientOption[] {
  if (!raw) return EMPTY_INGREDIENTS;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY_INGREDIENTS;
    return data.filter(
      (item): item is IngredientOption =>
        typeof item === "object" && item !== null &&
        typeof (item as IngredientOption).slug === "string" &&
        typeof (item as IngredientOption).name === "string",
    );
  } catch {
    return EMPTY_INGREDIENTS;
  }
}

function parseFavorites(raw: string | null): string[] {
  if (!raw) return EMPTY_FAVORITES;
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter((s): s is string => typeof s === "string") : EMPTY_FAVORITES;
  } catch {
    return EMPTY_FAVORITES;
  }
}

function getSnapshot<T>(key: Key, parse: (raw: string | null) => T): T {
  const raw = readRaw(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  const value = parse(raw);
  cache.set(key, { raw, value });
  return value;
}

function write(key: Key, value: unknown) {
  const raw = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    memoryFallback.set(key, raw);
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
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
