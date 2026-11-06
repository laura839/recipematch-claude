import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  parseFavorites,
  parseIngredients,
  parseLanguage,
  readLanguage,
  STORAGE_KEYS,
  subscribe,
  writeLanguage,
} from "./storage";

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(key: string) {
    return this.data.has(key) ? this.data.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, String(value));
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  clear() {
    this.data.clear();
  }
}

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: storage,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
});

afterEach(() => {
  delete (globalThis as unknown as { window?: unknown }).window;
});

describe("language persistence", () => {
  it("defaults to Estonian for new users", () => {
    expect(readLanguage()).toBe("et");
  });

  it("persists the selected language in localStorage", () => {
    writeLanguage("en");
    expect(storage.getItem(STORAGE_KEYS.language)).toBe('"en"');
    expect(readLanguage()).toBe("en");
    writeLanguage("et");
    expect(readLanguage()).toBe("et");
  });

  it("survives a 'reload' (a fresh read of the same storage)", () => {
    storage.setItem(STORAGE_KEYS.language, JSON.stringify("en"));
    expect(readLanguage()).toBe("en");
  });

  it("falls back to Estonian for invalid stored values", () => {
    expect(parseLanguage(null)).toBe("et");
    expect(parseLanguage('"de"')).toBe("et");
    expect(parseLanguage("not json")).toBe("et");
    expect(parseLanguage('"en"')).toBe("en");
  });

  it("does not touch selected ingredients or favorites when switching", () => {
    const ingredients = JSON.stringify([{ slug: "eggs", name: { en: "Eggs", et: "Munad" } }]);
    const favorites = JSON.stringify(["fluffy-pancakes"]);
    storage.setItem(STORAGE_KEYS.ingredients, ingredients);
    storage.setItem(STORAGE_KEYS.favorites, favorites);

    writeLanguage("en");
    writeLanguage("et");

    expect(storage.getItem(STORAGE_KEYS.ingredients)).toBe(ingredients);
    expect(storage.getItem(STORAGE_KEYS.favorites)).toBe(favorites);
  });

  it("notifies subscribers so the UI re-renders immediately", () => {
    let calls = 0;
    const unsubscribe = subscribe(() => calls++);
    writeLanguage("en");
    unsubscribe();
    writeLanguage("et");
    expect(calls).toBe(1);
  });
});

describe("stored data parsing", () => {
  it("reads the bilingual ingredient format", () => {
    const raw = JSON.stringify([{ slug: "eggs", name: { en: "Eggs", et: "Munad" } }]);
    expect(parseIngredients(raw)).toEqual([{ slug: "eggs", name: { en: "Eggs", et: "Munad" } }]);
  });

  it("keeps selections saved before Estonian support existed", () => {
    const legacy = JSON.stringify([{ slug: "eggs", name: "Eggs" }]);
    expect(parseIngredients(legacy)).toEqual([{ slug: "eggs", name: { en: "Eggs", et: "Eggs" } }]);
  });

  it("ignores malformed entries", () => {
    const raw = JSON.stringify([{ slug: 1 }, null, "x", { slug: "milk", name: { en: "Milk" } }, { slug: "rice", name: "Rice" }]);
    expect(parseIngredients(raw).map((i) => i.slug)).toEqual(["rice"]);
    expect(parseIngredients("{bad")).toEqual([]);
  });

  it("parses favorites", () => {
    expect(parseFavorites(JSON.stringify(["a", 2, "b"]))).toEqual(["a", "b"]);
    expect(parseFavorites(null)).toEqual([]);
  });
});
